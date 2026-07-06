import os
from celery import Celery

# Monkey-patch redis-py ConnectionPool to force protocol version 2 (RESP2).
# This is required to bypass the default RESP3 HELLO handshake which is unsupported by the local Redis 3.0.504 server.
try:
    import redis
    original_pool_init = redis.ConnectionPool.__init__
    def patched_pool_init(self, *args, **kwargs):
        kwargs['protocol'] = 2
        original_pool_init(self, *args, **kwargs)
    redis.ConnectionPool.__init__ = patched_pool_init
except Exception:
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
