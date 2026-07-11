from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
import requests
from django.conf import settings

from video_gen.models import VideoJob, Transaction, Notification
from video_gen.providers.factory import ProviderFactory
from video_gen.providers.runway import RunwayProvider
from video_gen.tasks import process_video_generation, poll_external_job_status

User = get_user_model()

class RunwayProviderTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword"
        )
        # Give user enough credits
        self.user.credits = 100
        self.user.save()

    def test_provider_factory_default(self):
        """Test that ProviderFactory returns RunwayProvider by default."""
        provider = ProviderFactory.get_provider("unknown-model")
        self.assertTrue(isinstance(provider, RunwayProvider))

        provider_runway = ProviderFactory.get_provider("runway-gen3")
        self.assertTrue(isinstance(provider_runway, RunwayProvider))

        # Check the apps.video factory too using path insertion to avoid namespace collision
        import importlib
        import sys
        import os
        
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        apps_path = os.path.join(backend_dir, 'apps')
        if apps_path not in sys.path:
            sys.path.insert(0, apps_path)
            
        try:
            video_factory = importlib.import_module("video.providers.factory")
            AppsFactory = video_factory.ProviderFactory
            provider_apps = AppsFactory.get_provider("unknown-model")
            self.assertTrue(isinstance(provider_apps, RunwayProvider))
        finally:
            if apps_path in sys.path:
                sys.path.remove(apps_path)

    @patch("video_gen.providers.runway.requests.request")
    def test_runway_generate_success(self, mock_request):
        """Test successful video generation request to Runway."""
        # Setup mock response
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {"id": "rw_task_12345"}
        mock_request.return_value = mock_response

        # Call generate
        provider = RunwayProvider()
        options = {
            "prompt": "An astronaut riding a horse",
            "aspectRatio": "16:9",
            "duration": 5,
            "seed": 9999,
            "cameraMotion": "Zoom In",
            "stylePreset": "Cinematic"
        }
        task_id = provider.generate(options)

        self.assertEqual(task_id, "rw_task_12345")
        
        # Verify the headers and payload passed to request
        mock_request.assert_called_once()
        args, kwargs = mock_request.call_args
        self.assertEqual(args[0], "POST")
        self.assertEqual(args[1], "https://api.runwayml.com/v1/text_to_video")
        
        payload = kwargs["json"]
        self.assertEqual(payload["model"], "gen4.5")
        self.assertIn("An astronaut riding a horse", payload["promptText"])
        self.assertIn("camera motion: Zoom In", payload["promptText"])
        self.assertIn("style: Cinematic", payload["promptText"])
        self.assertEqual(payload["ratio"], "1280:720")
        self.assertEqual(payload["duration"], 5)
        self.assertEqual(payload["seed"], 9999)

    @patch("video_gen.providers.runway.requests.request")
    def test_runway_status_polling(self, mock_request):
        """Test status polling parsing under various API responses."""
        provider = RunwayProvider()

        # 1. Test RUNNING/PROCESSING
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "RUNNING"}
        mock_request.return_value = mock_response

        res = provider.status("rw_task_12345")
        self.assertEqual(res["status"], "PROCESSING")
        self.assertEqual(res["progress"], 50)
        self.assertIsNone(res["video_url"])

        # 2. Test SUCCEEDED/COMPLETED
        mock_response.json.return_value = {
            "status": "SUCCEEDED",
            "output": ["https://s3.amazonaws.com/runway-videos/output.mp4"]
        }
        res = provider.status("rw_task_12345")
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["progress"], 100)
        self.assertEqual(res["video_url"], "https://s3.amazonaws.com/runway-videos/output.mp4")

        # 3. Test FAILED
        mock_response.json.return_value = {
            "status": "FAILED",
            "error": {"message": "Safety filter blocked prompt"}
        }
        res = provider.status("rw_task_12345")
        self.assertEqual(res["status"], "FAILED")
        self.assertEqual(res["progress"], 0)
        self.assertEqual(res["error"], "Safety filter blocked prompt")

    @patch("video_gen.providers.runway.requests.request")
    def test_runway_generate_no_key_error(self, mock_request):
        """Test that generate raises error if API key is missing."""
        provider = RunwayProvider()
        provider.api_key = None
        
        with self.assertRaises(ValueError):
            provider.generate({"prompt": "test"})

    @patch("video_gen.providers.runway.requests.request")
    @patch("video_gen.tasks.poll_external_job_status.delay")
    def test_process_video_generation_celery_task(self, mock_poll_delay, mock_request):
        """Test the end-to-end celery task flow for submitting a job."""
        # Create a video job
        job = VideoJob.objects.create(
            user=self.user,
            prompt="An astronaut riding a horse",
            model="runway-gen3",
            duration=5,
            credits_used=15
        )

        # Mock the Runway API generation response
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {"id": "rw_task_98765"}
        mock_request.return_value = mock_response

        # Execute Celery task directly (synchronously)
        process_video_generation(job.id)

        # Reload job and user
        job.refresh_from_db()
        self.user.refresh_from_db()

        self.assertEqual(job.status, "PROCESSING")
        self.assertEqual(job.external_job_id, "rw_task_98765")
        self.assertEqual(job.progress, 20)
        
        # Verify user credits deducted
        self.assertEqual(self.user.credits, 85) # 100 - 15

        # Verify transaction created
        transaction = Transaction.objects.filter(user=self.user, type="DEDUCTION").first()
        self.assertIsNotNone(transaction)
        self.assertEqual(transaction.amount, 15)

        # Verify polling task was triggered
        mock_poll_delay.assert_called_once_with(job.id)

    @patch("video_gen.providers.runway.requests.request")
    @patch("video_gen.providers.runway.requests.get")
    @patch("video_gen.tasks.poll_external_job_status.apply_async")
    def test_poll_status_completed_and_download(self, mock_apply_async, mock_get, mock_request):
        """Test polling status, complete status transition, download video locally."""
        # Create a job
        job = VideoJob.objects.create(
            user=self.user,
            prompt="An astronaut riding a horse",
            model="runway-gen3",
            duration=5,
            status="PROCESSING",
            external_job_id="rw_task_completed",
            credits_used=15
        )

        # Mock status GET request to Runway
        mock_status_response = MagicMock()
        mock_status_response.status_code = 200
        mock_status_response.json.return_value = {
            "status": "SUCCEEDED",
            "output": ["https://s3.amazonaws.com/runway-videos/completed_output.mp4"]
        }
        mock_request.return_value = mock_status_response

        # Mock download response content
        mock_download_response = MagicMock()
        mock_download_response.status_code = 200
        mock_download_response.content = b"fake-video-bytes"
        mock_get.return_value = mock_download_response

        # Run polling task
        with patch("builtins.open", create=True) as mock_open:
            mock_file = MagicMock()
            mock_open.return_value.__enter__.return_value = mock_file
            
            poll_external_job_status(job.id)

            # Verify file was written
            mock_open.assert_called_once()
            mock_file.write.assert_called_once_with(b"fake-video-bytes")

        # Reload job
        job.refresh_from_db()
        self.assertEqual(job.status, "COMPLETED")
        self.assertEqual(job.progress, 100)
        self.assertTrue(job.video_url.endswith(f"{job.id}_{job.external_job_id}.mp4"))

        # Verify completion notification
        notification = Notification.objects.filter(user=self.user, title="Video Render Completed").first()
        self.assertIsNotNone(notification)

    @patch("video_gen.providers.runway.requests.request")
    @patch("video_gen.tasks.poll_external_job_status.apply_async")
    def test_poll_status_failed_refund(self, mock_apply_async, mock_request):
        """Test that failed status refunds credits and updates job."""
        job = VideoJob.objects.create(
            user=self.user,
            prompt="An astronaut riding a horse",
            model="runway-gen3",
            duration=5,
            status="PROCESSING",
            external_job_id="rw_task_failed",
            credits_used=15
        )

        # Mock status GET request showing FAILED
        mock_status_response = MagicMock()
        mock_status_response.status_code = 200
        mock_status_response.json.return_value = {
            "status": "FAILED",
            "error": "Moderation blocked generation"
        }
        mock_request.return_value = mock_status_response

        # Run polling task
        poll_external_job_status(job.id)

        # Reload job and user
        job.refresh_from_db()
        self.user.refresh_from_db()

        self.assertEqual(job.status, "FAILED")
        self.assertEqual(job.progress, 0)
        
        # Verify refund: 100 original + 15 refund (deduction was not run in this test, so it's 100 + 15 = 115)
        self.assertEqual(self.user.credits, 115)

        # Verify refund transaction
        transaction = Transaction.objects.filter(user=self.user, type="REFUND").first()
        self.assertIsNotNone(transaction)
        self.assertEqual(transaction.amount, 15)

        # Verify failed notification
        notification = Notification.objects.filter(user=self.user, title="Generation Failed").first()
        self.assertIsNotNone(notification)
        self.assertIn("Moderation blocked generation", notification.message)
