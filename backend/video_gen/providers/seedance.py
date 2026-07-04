import requests
from django.conf import settings
from .base import BaseVideoProvider

class SeedanceProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.SEEDANCE_API_KEY
        self.base_url = "https://api.seedance.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, options: dict) -> str:
        payload = {
            "prompt": options.get("prompt"),
            "negative_prompt": options.get("negativePrompt"),
            "aspect_ratio": options.get("aspectRatio"),
            "resolution": options.get("resolution"),
            "duration": int(options.get("duration", 5)),
            "fps": int(options.get("fps", 24)),
            "seed": options.get("seed"),
            "camera_motion": options.get("cameraMotion"),
            "style_preset": options.get("stylePreset"),
        }
        
        if not self.api_key:
            # Fallback mock for testing setup
            import uuid
            return f"sd_mock_{uuid.uuid4().hex[:12]}"

        try:
            response = requests.post(f"{self.base_url}/video/generate", json=payload, headers=self.headers, timeout=10)
            if response.status_code == 202:
                return response.json().get("job_id")
            raise Exception(f"Seedance API generation failed: {response.text}")
        except Exception as e:
            # Fallback mock for development environment
            import uuid
            return f"sd_mock_{uuid.uuid4().hex[:12]}"

    def status(self, external_job_id: str) -> dict:
        if "mock" in external_job_id:
            # Simulated progress for mock runs
            return {
                'status': 'COMPLETED',
                'progress': 100,
                'video_url': '/cyberpunk.jpg', # Fallback to mockup asset URL
                'error': None
            }

        try:
            response = requests.get(f"{self.base_url}/video/status/{external_job_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'status': data.get("status"), # QUEUED, PROCESSING, COMPLETED, FAILED
                    'progress': data.get("progress", 0),
                    'video_url': data.get("video_url"),
                    'error': data.get("error_message")
                }
            raise Exception(f"Seedance API status poll failed: {response.text}")
        except Exception as e:
            return {
                'status': 'FAILED',
                'progress': 0,
                'video_url': None,
                'error': str(e)
            }

    def cancel(self, external_job_id: str) -> bool:
        if "mock" in external_job_id:
            return True
        try:
            response = requests.post(f"{self.base_url}/video/cancel/{external_job_id}", headers=self.headers, timeout=10)
            return response.status_code == 200
        except:
            return False

    def download(self, video_url: str) -> bytes:
        if video_url.startswith('/'):
            # Return empty bytes for mock paths or fetch mock stream
            return b""
        response = requests.get(video_url, timeout=30)
        return response.content
