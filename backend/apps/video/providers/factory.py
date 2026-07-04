from .seedance import SeedanceProvider
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
        else:
            # Default to Seedance as standard provider
            return SeedanceProvider()
