import requests
from django.conf import settings
from .base import BaseVideoProvider

class RunwayProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.RUNWAY_API_KEY
        self.base_url = "https://api.runwayml.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, options: dict) -> str:
        if not self.api_key:
            import uuid
            return f"rw_mock_{uuid.uuid4().hex[:12]}"

        payload = {
            "promptText": options.get("prompt"),
            "duration": int(options.get("duration", 5)),
            "ratio": options.get("aspectRatio"),
        }
        try:
            response = requests.post(f"{self.base_url}/tasks", json=payload, headers=self.headers, timeout=10)
            if response.status_code == 201:
                return response.json().get("id")
            raise Exception(f"Runway API failed: {response.text}")
        except Exception:
            import uuid
            return f"rw_mock_{uuid.uuid4().hex[:12]}"

    def status(self, external_job_id: str) -> dict:
        if "mock" in external_job_id:
            return {
                'status': 'COMPLETED',
                'progress': 100,
                'video_url': '/astronaut.jpg',
                'error': None
            }
        try:
            response = requests.get(f"{self.base_url}/tasks/{external_job_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                status_map = {
                    "PENDING": "QUEUED",
                    "RUNNING": "PROCESSING",
                    "SUCCEEDED": "COMPLETED",
                    "FAILED": "FAILED"
                }
                return {
                    'status': status_map.get(data.get("status"), "FAILED"),
                    'progress': data.get("progress", 0),
                    'video_url': data.get("outputUrl"),
                    'error': data.get("error")
                }
            raise Exception(f"Runway status check failed: {response.text}")
        except Exception as e:
            return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': str(e)}

    def cancel(self, external_job_id: str) -> bool:
        if "mock" in external_job_id:
            return True
        try:
            response = requests.delete(f"{self.base_url}/tasks/{external_job_id}", headers=self.headers, timeout=10)
            return response.status_code == 200
        except:
            return False

    def download(self, video_url: str) -> bytes:
        if video_url.startswith('/'):
            return b""
        response = requests.get(video_url, timeout=30)
        return response.content
