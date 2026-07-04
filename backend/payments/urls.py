from django.urls import path
from .views import CreatePaymentOrderView, PaymentWebhookView

urlpatterns = [
    path('create-order/', CreatePaymentOrderView.as_view(), name='create_order'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment_webhook'),
]
