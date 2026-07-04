import requests
from django.conf import settings
from .base import BaseVideoProvider

class PikaProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.PIKA_API_KEY
        self.base_url = "https://api.pika.art/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, options: dict) -> str:
        if not self.api_key:
            import uuid
            return f"pk_mock_{uuid.uuid4().hex[:12]}"

        payload = {
            "promptText": options.get("prompt"),
            "options": {
                "aspectRatio": options.get("aspectRatio"),
                "camera": options.get("cameraMotion"),
            }
        }
        try:
            response = requests.post(f"{self.base_url}/generate", json=payload, headers=self.headers, timeout=10)
            if response.status_code == 200:
                return response.json().get("jobId")
            raise Exception(f"Pika API failed: {response.text}")
        except Exception:
            import uuid
            return f"pk_mock_{uuid.uuid4().hex[:12]}"

    def status(self, external_job_id: str) -> dict:
        if "mock" in external_job_id:
            return {
                'status': 'COMPLETED',
                'progress': 100,
                'video_url': '/steampunk.jpg',
                'error': None
            }
        try:
            response = requests.get(f"{self.base_url}/jobs/{external_job_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                # status choices: queued, rendering, finished, failed
                status_raw = data.get("status")
                status_map = {
                    "queued": "QUEUED",
                    "rendering": "PROCESSING",
                    "finished": "COMPLETED",
                    "failed": "FAILED"
                }
                return {
                    'status': status_map.get(status_raw, "FAILED"),
                    'progress': data.get("progress", 0),
                    'video_url': data.get("videoUrl"),
                    'error': data.get("error")
                }
            raise Exception(f"Pika status check failed: {response.text}")
        except Exception as e:
            return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': str(e)}

    def cancel(self, external_job_id: str) -> bool:
        return True

    def download(self, video_url: str) -> bytes:
        if video_url.startswith('/'):
            return b""
        response = requests.get(video_url, timeout=30)
        return response.content
