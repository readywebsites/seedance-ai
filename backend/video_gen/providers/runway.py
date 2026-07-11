import requests
import logging
from django.conf import settings
from .base import BaseVideoProvider

logger = logging.getLogger(__name__)

class RunwayProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.RUNWAY_API_KEY
        self.base_url = "https://api.runwayml.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-Runway-Version": "2024-11-06"
        }

    def _request(self, method: str, url: str, **kwargs) -> requests.Response:
        """
        Helper method to make HTTP requests with automatic retries for transient failures.
        """
        import time
        max_retries = 3
        backoff_factor = 1.0
        
        headers = self.headers.copy()
        if "headers" in kwargs:
            headers.update(kwargs.pop("headers"))
            
        for attempt in range(1, max_retries + 1):
            try:
                response = requests.request(method, url, headers=headers, **kwargs)
                if response.status_code >= 500 or response.status_code == 429:
                    if attempt == max_retries:
                        return response
                    logger.warning(f"Runway API returned HTTP {response.status_code} on attempt {attempt}. Retrying...")
                    time.sleep(backoff_factor * attempt)
                    continue
                return response
            except (requests.ConnectionError, requests.Timeout) as e:
                if attempt == max_retries:
                    raise e
                logger.warning(f"Runway API connection error/timeout on attempt {attempt}: {str(e)}. Retrying...")
                time.sleep(backoff_factor * attempt)

    def generate(self, options: dict) -> str:
        if not self.api_key:
            raise ValueError("Runway API key is not configured. Please set RUNWAY_API_KEY in settings.")

        # Map aspect ratios to Runway resolution strings
        ratio_map = {
            "16:9": "1280:720",
            "9:16": "720:1280",
            "1:1": "1280:1280",
            "2.35:1": "21:9",
        }
        ratio = ratio_map.get(options.get("aspectRatio"), "1280:720")

        # Map and cap duration (Runway typically supports 5s or 10s)
        duration = int(options.get("duration", 5))
        if duration <= 7:
            duration = 5
        else:
            duration = 10

        prompt_text = options.get("prompt", "")
        
        # Append camera motion and style preset to prompt text if provided
        camera_motion = options.get("cameraMotion")
        if camera_motion and camera_motion.lower() != "none":
            prompt_text += f", camera motion: {camera_motion}"
            
        style_preset = options.get("stylePreset")
        if style_preset and style_preset.lower() != "none":
            prompt_text += f", style: {style_preset}"

        payload = {
            "model": "gen4.5",
            "promptText": prompt_text,
            "ratio": ratio,
            "duration": duration,
        }

        # Add seed if valid integer
        seed = options.get("seed")
        if seed is not None:
            try:
                payload["seed"] = int(seed)
            except (ValueError, TypeError):
                pass

        logger.info(f"Submitting Runway video generation task with payload: {payload}")

        try:
            response = self._request("POST", f"{self.base_url}/text_to_video", json=payload, timeout=15)
            if response.status_code in [200, 201, 202]:
                data = response.json()
                task_id = data.get("id")
                if task_id:
                    logger.info(f"Runway task created successfully. Task ID: {task_id}")
                    return task_id
            raise Exception(f"Runway API failed with HTTP {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error creating Runway video generation task: {str(e)}")
            raise e

    def status(self, external_job_id: str) -> dict:
        if not self.api_key:
            raise ValueError("Runway API key is not configured. Please set RUNWAY_API_KEY in settings.")

        try:
            response = self._request("GET", f"{self.base_url}/tasks/{external_job_id}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                raw_status = data.get("status", "").upper()
                
                status_map = {
                    "PENDING": "QUEUED",
                    "IN QUEUE": "QUEUED",
                    "IN_QUEUE": "QUEUED",
                    "SUBMITTED": "QUEUED",
                    "RUNNING": "PROCESSING",
                    "SUCCEEDED": "COMPLETED",
                    "SUCCESS": "COMPLETED",
                    "FAILED": "FAILED",
                    "CANCELLED": "CANCELLED",
                    "CANCELED": "CANCELLED",
                    "THROTTLED": "QUEUED"
                }
                
                mapped_status = status_map.get(raw_status, "FAILED")
                
                progress = 0
                if mapped_status == "QUEUED":
                    progress = 20
                elif mapped_status == "PROCESSING":
                    progress = 50
                elif mapped_status == "COMPLETED":
                    progress = 100

                video_url = None
                output = data.get("output")
                if isinstance(output, list) and len(output) > 0:
                    video_url = output[0]
                elif isinstance(output, str):
                    video_url = output
                    
                error_msg = None
                error_data = data.get("error")
                if isinstance(error_data, dict):
                    error_msg = error_data.get("message") or str(error_data)
                elif error_data:
                    error_msg = str(error_data)

                return {
                    'status': mapped_status,
                    'progress': progress,
                    'video_url': video_url,
                    'error': error_msg
                }
            raise Exception(f"Runway status check failed with HTTP {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error polling Runway task status for {external_job_id}: {str(e)}")
            return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': str(e)}

    def cancel(self, external_job_id: str) -> bool:
        if not self.api_key:
            raise ValueError("Runway API key is not configured. Please set RUNWAY_API_KEY in settings.")
        try:
            response = self._request("DELETE", f"{self.base_url}/tasks/{external_job_id}", timeout=10)
            return response.status_code in [200, 202, 204]
        except Exception as e:
            logger.error(f"Error cancelling Runway job {external_job_id}: {str(e)}")
            return False

    def download(self, video_url: str) -> bytes:
        if not video_url:
            return b""
        try:
            import time
            max_retries = 3
            backoff_factor = 1.0
            for attempt in range(1, max_retries + 1):
                try:
                    # We must not pass Runway auth/version headers to the S3 bucket URL
                    response = requests.get(video_url, timeout=30)
                    if response.status_code == 200:
                        return response.content
                    if response.status_code >= 500 or response.status_code == 429:
                        if attempt == max_retries:
                            raise Exception(f"HTTP {response.status_code}")
                        time.sleep(backoff_factor * attempt)
                        continue
                    raise Exception(f"HTTP {response.status_code}")
                except (requests.ConnectionError, requests.Timeout) as e:
                    if attempt == max_retries:
                        raise e
                    time.sleep(backoff_factor * attempt)
        except Exception as e:
            logger.error(f"Error downloading video from {video_url}: {str(e)}")
            return b""
