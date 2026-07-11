import logging
from celery import shared_task
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import VideoJob, Transaction, Notification
from video_gen.providers.factory import ProviderFactory

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task(bind=True, max_retries=3)
def process_video_generation(self, job_id):
    """
    Celery task to dispatch video generation to the correct AI provider class.
    """
    logger.info(f"Starting video generation dispatch for Job ID: {job_id}")
    try:
        job = VideoJob.objects.get(id=job_id)
    except VideoJob.DoesNotExist:
        logger.error(f"Job {job_id} not found in database.")
        return

    job.status = 'PROCESSING'
    job.progress = 10
    job.save()

    # Deduct credits from user (standard audit ledger log)
    user = job.user
    cost = job.duration * 3
    if user.credits < cost:
        job.status = 'FAILED'
        job.progress = 0
        job.save()
        # Add error alert log
        Notification.objects.create(
            user=user,
            title="Insufficient Credits",
            message=f"Generation failed: Required {cost} credits, available {user.credits}."
        )
        return

    user.credits -= cost
    user.save()
    
    # Track the transaction
    Transaction.objects.create(
        user=user,
        type='DEDUCTION',
        amount=cost,
        status='COMPLETED'
    )

    options = {
        'prompt': job.prompt,
        'negativePrompt': job.negative_prompt,
        'aspectRatio': job.aspect_ratio,
        'resolution': job.resolution,
        'duration': job.duration,
        'cameraMotion': job.camera_motion,
        'stylePreset': job.style_preset,
        'seed': job.seed,
        'fps': getattr(job, 'fps', 24)
    }

    try:
        # Resolve provider subclass
        provider = ProviderFactory.get_provider(job.model)
        
        # Dispatch generation
        external_id = provider.generate(options)
        
        job.external_job_id = external_id
        job.progress = 20
        job.save()

        # Queue polling task with countdown
        poll_external_job_status.delay(job.id)

    except Exception as e:
        logger.error(f"Error calling provider for Job {job_id}: {str(e)}")
        # Retry logic for network/API limits
        try:
            self.retry(exc=e, countdown=10)
        except self.MaxRetriesExceededError:
            # Mark failed, refund credits
            job.status = 'FAILED'
            job.save()
            
            # Refund
            user.credits += cost
            user.save()
            Transaction.objects.create(
                user=user,
                type='REFUND',
                amount=cost,
                status='COMPLETED'
            )
            Notification.objects.create(
                user=user,
                title="Generation Failed",
                message=f"Job {job_id} failed to connect to provider. Credits have been refunded."
            )

@shared_task(bind=True)
def poll_external_job_status(self, job_id):
    """
    Celery task to poll active status from provider and update database records.
    Schedules another poll if still rendering.
    """
    try:
        job = VideoJob.objects.get(id=job_id)
    except VideoJob.DoesNotExist:
        return

    if job.status in ['COMPLETED', 'FAILED', 'CANCELLED']:
        return

    try:
        provider = ProviderFactory.get_provider(job.model)
        status_res = provider.status(job.external_job_id)
        
        ext_status = status_res.get('status')
        progress = status_res.get('progress', 0)
        video_url = status_res.get('video_url')
        error_msg = status_res.get('error')

        if ext_status == 'COMPLETED':
            local_url = None
            try:
                if video_url:
                    import os
                    from django.conf import settings
                    
                    videos_dir = os.path.join(settings.MEDIA_ROOT, 'videos')
                    os.makedirs(videos_dir, exist_ok=True)
                    
                    file_name = f"{job.id}_{job.external_job_id}.mp4"
                    local_path = os.path.join(videos_dir, file_name)
                    
                    logger.info(f"Downloading video from {video_url} to local store: {local_path}")
                    video_bytes = provider.download(video_url)
                    if video_bytes:
                        with open(local_path, 'wb') as f:
                            f.write(video_bytes)
                        local_url = f"{settings.MEDIA_URL}videos/{file_name}"
                        logger.info(f"Successfully saved video locally: {local_url}")
                    else:
                        logger.error("Download returned empty bytes stream.")
            except Exception as download_err:
                logger.error(f"Error downloading completed video file: {str(download_err)}")

            job.status = 'COMPLETED'
            job.progress = 100
            job.video_url = local_url or video_url or '/cyberpunk.jpg'
            job.save()

            # Create notification
            Notification.objects.create(
                user=job.user,
                title="Video Render Completed",
                message=f"Your video for '{job.prompt[:25]}...' is ready to view and download."
            )
            
        elif ext_status == 'FAILED':
            job.status = 'FAILED'
            job.progress = 0
            job.save()

            # Refund credits
            user = job.user
            cost = job.credits_used
            user.credits += cost
            user.save()
            
            Transaction.objects.create(
                user=user,
                type='REFUND',
                amount=cost,
                status='COMPLETED'
            )
            Notification.objects.create(
                user=user,
                title="Generation Failed",
                message=f"Rendering failed on provider side. {cost} credits refunded: {error_msg or 'Unknown Error'}"
            )
            
        else:
            # Still processing or queued
            job.status = ext_status # PROCESSING, QUEUED
            job.progress = max(20, progress)
            # decrement eta slowly
            job.eta = max(5, job.eta - 5)
            job.save()

            # Queue next poll in 5 seconds
            poll_external_job_status.apply_async(args=[job.id], countdown=5)

    except Exception as e:
        logger.error(f"Error polling status for Job {job_id}: {str(e)}")
        # schedule retry poll
        poll_external_job_status.apply_async(args=[job.id], countdown=10)

@shared_task
def delete_expired_files():
    """
    Periodic task to clean up old generated videos to free up storage space.
    """
    logger.info("Running storage cleanup tasks.")
    # Implement local files deleting query logic here if needed
    return True
