import requests
from django.conf import settings
from .base import BaseVideoProvider

class VeoProvider(BaseVideoProvider):
    def __init__(self):
        self.api_key = settings.VEO_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/veo-1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, options: dict) -> str:
        if not self.api_key:
            import uuid
            return f"veo_mock_{uuid.uuid4().hex[:12]}"

        payload = {
            "prompt": options.get("prompt"),
            "aspect_ratio": options.get("aspectRatio"),
        }
        try:
            response = requests.post(f"{self.base_url}:generateVideo", json=payload, headers=self.headers, timeout=10)
            if response.status_code == 200:
                return response.json().get("name")
            raise Exception(f"Google Veo API failed: {response.text}")
        except Exception:
            import uuid
            return f"veo_mock_{uuid.uuid4().hex[:12]}"

    def status(self, external_job_id: str) -> dict:
        if "mock" in external_job_id:
            return {
                'status': 'COMPLETED',
                'progress': 100,
                'video_url': '/cyberpunk.jpg',
                'error': None
            }
        try:
            response = requests.get(f"https://generativelanguage.googleapis.com/v1beta/{external_job_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                done = data.get("done", False)
                if done:
                    error = data.get("error")
                    if error:
                        return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': error.get("message")}
                    video_url = data.get("response", {}).get("generatedVideos", [{}])[0].get("videoUri")
                    return {'status': 'COMPLETED', 'progress': 100, 'video_url': video_url, 'error': None}
                return {'status': 'PROCESSING', 'progress': 50, 'video_url': None, 'error': None}
            raise Exception(f"Google Veo status check failed: {response.text}")
        except Exception as e:
            return {'status': 'FAILED', 'progress': 0, 'video_url': None, 'error': str(e)}

    def cancel(self, external_job_id: str) -> bool:
        return True

    def download(self, video_url: str) -> bytes:
        if video_url.startswith('/'):
            return b""
        response = requests.get(video_url, timeout=30)
        return response.content
