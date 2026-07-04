import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import VideoJob, DeveloperAPIKey, Plan
from .serializers import VideoJobSerializer, DeveloperAPIKeySerializer, PlanSerializer
from .tasks import process_video_generation

class APIKeyPermission(permissions.BasePermission):
    """
    Custom permission class to authorize requests containing X-API-KEY headers.
    """
    def has_permission(self, request, view):
        api_key_header = request.headers.get('X-API-KEY')
        if not api_key_header:
            return request.user and request.user.is_authenticated
        
        # Verify developer API key
        try:
            # Match preview prefix
            preview = f"{api_key_header[:10]}...{api_key_header[-4:]}"
            keys = DeveloperAPIKey.objects.filter(raw_key_preview=preview, active=True)
            for db_key in keys:
                if db_key.get_key() == api_key_header:
                    request.user = db_key.user # bind user to request context
                    return True
        except Exception:
            return False
        return False

class GenerateVideoView(APIView):
    permission_classes = (APIKeyPermission,)

    def post(self, request):
        cost = int(request.data.get('duration', 5)) * 3
        if request.user.credits < cost:
            return Response(
                {'error': 'Insufficient credits', 'cost': cost, 'available': request.user.credits}, 
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Create Database entry
        job = VideoJob.objects.create(
            user=request.user,
            prompt=request.data.get('prompt'),
            negative_prompt=request.data.get('negativePrompt', ''),
            model=request.data.get('model', 'seedance-v2'),
            resolution=request.data.get('resolution', '1080p'),
            aspect_ratio=request.data.get('aspectRatio', '16:9'),
            duration=int(request.data.get('duration', 5)),
            camera_motion=request.data.get('cameraMotion', 'None'),
            style_preset=request.data.get('stylePreset', 'None'),
            seed=request.data.get('seed') or None,
            progress=0,
            eta=int(request.data.get('duration', 5)) * 3,
            credits_used=cost
        )

        # Trigger background execution queue
        process_video_generation.delay(job.id)

        return Response({
            'message': 'Generation job accepted and queued in Celery broker',
            'job_id': job.id,
            'status': job.status,
            'eta': job.eta
        }, status=status.HTTP_202_ACCEPTED)

class VideoJobStatusView(APIView):
    permission_classes = (APIKeyPermission,)

    def get(self, request, job_id):
        job = get_object_or_404(VideoJob, id=job_id, user=request.user)
        serializer = VideoJobSerializer(job)
        return Response(serializer.data)

class VideoHistoryView(APIView):
    permission_classes = (APIKeyPermission,)

    def get(self, request):
        jobs = VideoJob.objects.filter(user=request.user).order_by('-created_at')
        serializer = VideoJobSerializer(jobs, many=True)
        return Response(serializer.data)

class VideoDeleteView(APIView):
    permission_classes = (APIKeyPermission,)

    def delete(self, request, id):
        job = get_object_or_404(VideoJob, id=id, user=request.user)
        job.delete()
        return Response({'message': 'Video history item deleted successfully'}, status=status.HTTP_200_OK)

class DeveloperAPIKeyView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        keys = DeveloperAPIKey.objects.filter(user=request.user)
        serializer = DeveloperAPIKeySerializer(keys, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get('key_name', 'Unnamed API Key')
        scope = request.data.get('scope', 'Read & Write')
        
        # Generate token
        prefix = 'sd_live_' if scope == 'Read & Write' else 'sd_test_'
        raw_key = prefix + uuid.uuid4().hex + uuid.uuid4().hex[:10]
        
        db_key = DeveloperAPIKey(
            user=request.user,
            key_name=name,
            scope=scope
        )
        db_key.set_key(raw_key)
        db_key.save()
        
        return Response({
            'message': 'API Key generated. Copy it now, it will not be displayed again.',
            'key': raw_key,
            'key_name': db_key.key_name,
            'scope': db_key.scope
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, key_id):
        key = get_object_or_404(DeveloperAPIKey, id=key_id, user=request.user)
        key.delete()
        return Response({'message': 'Developer key revoked'}, status=status.HTTP_200_OK)
