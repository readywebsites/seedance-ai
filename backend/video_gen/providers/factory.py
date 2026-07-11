from .seedance import SeedanceProvider
from .runway import RunwayProvider
from .kling import KlingProvider
from .veo import VeoProvider
from .pika import PikaProvider
from .base import BaseVideoProvider

class ProviderFactory:
    """
    Factory class to instantiate correct provider subclass.
    """
    
    @staticmethod
    def get_provider(model_name: str) -> BaseVideoProvider:
        model_name = model_name.lower()
        if 'seedance' in model_name:
            return SeedanceProvider()
        elif 'runway' in model_name:
            return RunwayProvider()
        elif 'kling' in model_name:
            return KlingProvider()
        elif 'veo' in model_name:
            return VeoProvider()
        elif 'pika' in model_name:
            return PikaProvider()
        else:
            # Default fallback
            return RunwayProvider()
