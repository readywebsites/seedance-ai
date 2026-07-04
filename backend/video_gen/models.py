from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from cryptography.fernet import Fernet
import base64

User = get_user_model()

class Plan(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    credits = models.PositiveIntegerField()
    max_duration = models.PositiveIntegerField(default=15)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class VideoJob(models.Model):
    STATUS_CHOICES = (
        ('QUEUED', 'Queued'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_jobs')
    prompt = models.TextField()
    negative_prompt = models.TextField(blank=True, default='')
    model = models.CharField(max_length=50)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='QUEUED')
    resolution = models.CharField(max_length=15, default='1080p')
    aspect_ratio = models.CharField(max_length=15, default='16:9')
    duration = models.PositiveIntegerField(default=5)
    camera_motion = models.CharField(max_length=50, default='None')
    style_preset = models.CharField(max_length=50, default='None')
    seed = models.BigIntegerField(null=True, blank=True)
    progress = models.PositiveIntegerField(default=0)
    eta = models.PositiveIntegerField(default=15)
    video_url = models.CharField(max_length=512, blank=True, null=True)
    external_job_id = models.CharField(max_length=255, blank=True, null=True)
    credits_used = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.user.email} - {self.status}"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESSFUL', 'Successful'),
        ('FAILED', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    gateway = models.CharField(max_length=20) # STRIPE, RAZORPAY
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    order_id = models.CharField(max_length=255, unique=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id} - {self.user.email} - {self.status}"

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('DEPOSIT', 'Deposit'),
        ('DEDUCTION', 'Deduction'),
        ('REFUND', 'Refund'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    amount = models.IntegerField() # credit amount
    status = models.CharField(max_length=15, default='COMPLETED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.amount}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.title}"

class Settings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    webhook_url = models.URLField(blank=True, null=True)
    notification_browser = models.BooleanField(default=True)
    notification_email = models.BooleanField(default=True)

    def __str__(self):
        return f"Settings for {self.user.email}"

class DeveloperAPIKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    key_name = models.CharField(max_length=100)
    encrypted_key = models.TextField()
    raw_key_preview = models.CharField(max_length=50) # e.g. sd_live_4f89ac...
    scope = models.CharField(max_length=20, default='Read & Write')
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.key_name} - {self.user.email}"

    @staticmethod
    def get_fernet():
        # Fernet requires 32 urlsafe base64-encoded bytes
        # Pad key if needed
        key = settings.ENCRYPTION_KEY.encode()
        if len(key) < 32:
            key = key.ljust(32, b'=')
        elif len(key) > 32:
            key = key[:32]
        encoded = base64.urlsafe_b64encode(key)
        return Fernet(encoded)

    def set_key(self, raw_key):
        fernet = self.get_fernet()
        self.encrypted_key = fernet.encrypt(raw_key.encode()).decode()
        self.raw_key_preview = f"{raw_key[:10]}...{raw_key[-4:]}"

    def get_key(self):
        fernet = self.get_fernet()
        return fernet.decrypt(self.encrypted_key.encode()).decode()
