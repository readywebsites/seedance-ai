from .seedance import SeedanceProvider
from .base import BaseVideoProvider
from video_gen.providers.runway import RunwayProvider

class ProviderFactory:
    """
    Factory class to instantiate correct provider subclass.
    """
    
    @staticmethod
    def get_provider(model_name: str) -> BaseVideoProvider:
        model_name = model_name.lower()
        if 'runway' in model_name:
            return RunwayProvider()
        elif 'seedance' in model_name:
            return SeedanceProvider()
        else:
            # Default to Runway as standard provider
            return RunwayProvider()
