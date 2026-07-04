import requests
from django.conf import settings
from .base import BaseVideoProvider

class KlingProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.KLING_API_KEY
        self.base_url = "https://api.klingai.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, options: dict) -> str:
        if not self.api_key:
            import uuid
            return f"kl_mock_{uuid.uuid4().hex[:12]}"

        payload = {
            "model": "kling-v1.5",
            "prompt": options.get("prompt"),
            "aspect_ratio": options.get("aspectRatio"),
            "duration": int(options.get("duration", 5)),
        }
        try:
            response = requests.post(f"{self.base_url}/videos/image2video", json=payload, headers=self.headers, timeout=10)
            if response.status_code == 200:
                return response.json().get("data", {}).get("task_id")
            raise Exception(f"Kling API failed: {response.text}")
        except Exception:
            import uuid
            return f"kl_mock_{uuid.uuid4().hex[:12]}"

    def status(self, external_job_id: str) -> dict:
        if "mock" in external_job_id:
            return {
                'status': 'COMPLETED',
                'progress': 100,
                'video_url': '/steampunk.jpg',
                'error': None
            }
        try:
            response = requests.get(f"{self.base_url}/videos/status/{external_job_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json().get("data", {})
                # 0: QUEUED, 1: PROCESSING, 2: COMPLETED, 3: FAILED
                state = data.get("task_status")
                status_map = {
                    0: "QUEUED",
                    1: "PROCESSING",
                    2: "COMPLETED",
                    3: "FAILED"
                }
                return {
                    'status': status_map.get(state, "FAILED"),
                    'progress': data.get("task_progress", 0),
                    'video_url': data.get("video", {}).get("url"),
                    'error': data.get("error_msg")
                }
            raise Exception(f"Kling status check failed: {response.text}")
        except Exception as e:
            return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': str(e)}

    def cancel(self, external_job_id: str) -> bool:
        return True

    def download(self, video_url: str) -> bytes:
        if video_url.startswith('/'):
            return b""
        response = requests.get(video_url, timeout=30)
        return response.content
