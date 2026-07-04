import stripe
import razorpay
import json
import logging
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from video_gen.models import Payment, Transaction, Notification

logger = logging.getLogger(__name__)

# Initialize clients
stripe.api_key = settings.STRIPE_SECRET_KEY
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreatePaymentOrderView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        gateway = request.data.get('gateway', 'STRIPE').upper() # STRIPE, RAZORPAY
        amount_usd = float(request.data.get('amount', 5.0)) # dollar value
        credits = int(request.data.get('credits', 100))

        order_id = f"ord_{uuid_helper()}"
        
        # Save a pending payment record
        Payment.objects.create(
            user=request.user,
            amount=amount_usd,
            gateway=gateway,
            status='PENDING',
            order_id=order_id
        )

        if gateway == 'STRIPE':
            # Create Stripe Checkout Session
            try:
                session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[{
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {'name': f'{credits} Seedance Generation Credits'},
                            'unit_amount': int(amount_usd * 100),
                        },
                        'quantity': 1,
                    }],
                    mode='payment',
                    success_url=request.build_absolute_uri('/billing?success=true'),
                    cancel_url=request.build_absolute_uri('/billing?cancel=true'),
                    client_reference_id=order_id
                )
                return Response({'checkout_url': session.url, 'order_id': order_id})
            except Exception as e:
                logger.error(f"Stripe session error: {str(e)}")
                # Mock return for development
                return Response({
                    'checkout_url': f"https://checkout.stripe.com/pay/mock_{order_id}",
                    'order_id': order_id,
                    'mock': True
                })

        elif gateway == 'RAZORPAY':
            # Create Razorpay Order
            try:
                # Razorpay expects amount in paise (cents)
                order_data = {
                    'amount': int(amount_usd * 100 * 80), # approx conversion to INR
                    'currency': 'INR',
                    'receipt': order_id,
                    'payment_capture': 1
                }
                rzp_order = razorpay_client.order.create(data=order_data)
                return Response({
                    'razorpay_order_id': rzp_order.get('id'),
                    'amount': order_data['amount'],
                    'currency': 'INR',
                    'key': settings.RAZORPAY_KEY_ID,
                    'order_id': order_id
                })
            except Exception as e:
                logger.error(f"Razorpay session error: {str(e)}")
                return Response({
                    'razorpay_order_id': f"rzp_mock_{order_id}",
                    'amount': int(amount_usd * 100 * 80),
                    'currency': 'INR',
                    'key': settings.RAZORPAY_KEY_ID,
                    'order_id': order_id,
                    'mock': True
                })

        return Response({'error': 'Invalid payment gateway'}, status=status.HTTP_400_BAD_REQUEST)

def uuid_helper():
    import uuid
    return uuid.uuid4().hex[:12]

@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        payload = request.body
        sig_header = request.headers.get('STRIPE-SIGNATURE')
        
        # Verify Stripe webhook
        if sig_header:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
                )
            except Exception as e:
                logger.error(f"Webhook signature validation error: {str(e)}")
                return HttpResponse(status=400)

            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                order_id = session.get('client_reference_id')
                txn_id = session.get('payment_intent')
                self.fulfill_order(order_id, txn_id)
            return HttpResponse(status=200)

        # Razorpay Signature Check
        rzp_signature = request.headers.get('X-RAZORPAY-SIGNATURE')
        if rzp_signature:
            # Parse body
            body = json.loads(payload.decode('utf-8'))
            payment_id = body.get('payload', {}).get('payment', {}).get('entity', {}).get('id')
            rzp_order_id = body.get('payload', {}).get('payment', {}).get('entity', {}).get('order_id')
            
            try:
                # Verify webhook integrity
                razorpay_client.utility.verify_webhook_signature(
                    payload.decode('utf-8'), rzp_signature, settings.RAZORPAY_KEY_SECRET
                )
                payment = get_object_or_404(Payment, order_id=rzp_order_id)
                self.fulfill_order(payment.order_id, payment_id)
                return HttpResponse(status=200)
            except Exception as e:
                logger.error(f"Razorpay Webhook Error: {str(e)}")
                return HttpResponse(status=400)

        # Fallback raw handler for mocked gateway completes
        try:
            body = json.loads(payload.decode('utf-8'))
            order_id = body.get('order_id')
            txn_id = body.get('transaction_id', f"txn_mock_{uuid_helper()}")
            if order_id:
                self.fulfill_order(order_id, txn_id)
                return Response({'status': 'fulfilled'}, status=status.HTTP_200_OK)
        except Exception:
            pass

        return Response({'status': 'ignored'}, status=status.HTTP_400_BAD_REQUEST)

    def fulfill_order(self, order_id, transaction_id):
        try:
            payment = Payment.objects.get(order_id=order_id)
            if payment.status == 'SUCCESSFUL':
                return
            
            payment.status = 'SUCCESSFUL'
            payment.transaction_id = transaction_id
            payment.save()

            # Credit calculations
            credits_to_add = 100 # default
            if payment.amount == 19.0:
                credits_to_add = 300
            elif payment.amount == 49.0:
                credits_to_add = 1000
            elif payment.amount == 149.0:
                credits_to_add = 4000
            elif payment.amount == 5.0:
                credits_to_add = 100
            elif payment.amount == 20.0:
                credits_to_add = 500
            elif payment.amount == 50.0:
                credits_to_add = 1500

            # Update User credits
            user = payment.user
            user.credits += credits_to_add
            user.save()

            # Log Transaction ledger
            Transaction.objects.create(
                user=user,
                type='DEPOSIT',
                amount=credits_to_add,
                status='COMPLETED'
            )

            # Notification
            Notification.objects.create(
                user=user,
                title="Payment Successful",
                message=f"Purchase completed. {credits_to_add} credits added to your active balance."
            )

            logger.info(f"Payment {order_id} fulfilled. {credits_to_add} credits added to user {user.email}")
        except Payment.DoesNotExist:
            logger.error(f"Fulfillment failed: Payment {order_id} not found.")
