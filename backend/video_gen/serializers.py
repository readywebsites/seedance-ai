from rest_framework import serializers
from .models import VideoJob, Plan, Payment, Transaction, Notification, Settings, DeveloperAPIKey

class VideoJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoJob
        fields = '__all__'
        read_only_fields = ('id', 'user', 'progress', 'status', 'eta', 'video_url', 'external_job_id', 'credits_used', 'created_at', 'updated_at')

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'
        read_only_fields = ('user',)

class DeveloperAPIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeveloperAPIKey
        fields = ('id', 'key_name', 'raw_key_preview', 'scope', 'active', 'created_at')
        read_only_fields = ('id', 'raw_key_preview', 'created_at')
