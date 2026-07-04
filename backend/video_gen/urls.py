from django.urls import path
from .views import (
    GenerateVideoView, VideoJobStatusView, VideoHistoryView, 
    VideoDeleteView, DeveloperAPIKeyView
)

urlpatterns = [
    path('generate/', GenerateVideoView.as_view(), name='video_generate'),
    path('status/<int:job_id>/', VideoJobStatusView.as_view(), name='video_status'),
    path('history/', VideoHistoryView.as_view(), name='video_history'),
    path('delete/<int:id>/', VideoDeleteView.as_view(), name='video_delete'),
    path('apikeys/', DeveloperAPIKeyView.as_view(), name='api_keys_list'),
    path('apikeys/<int:key_id>/', DeveloperAPIKeyView.as_view(), name='api_keys_revoke'),
]
