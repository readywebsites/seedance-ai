from abc import ABC, abstractmethod

class BaseVideoProvider(ABC):
    """
    Abstract Base Class defining the contract for all external AI Video Generation APIs.
    """
    
    @abstractmethod
    def generate(self, options: dict) -> str:
        """
        Submits a video generation task to the external API.
        Returns external job ID.
        """
        pass

    @abstractmethod
    def status(self, external_job_id: str) -> dict:
        """
        Polls the status of the external job.
        Returns:
            {
                'status': 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
                'progress': int (0-100),
                'video_url': str | None,
                'error': str | None
            }
        """
        pass

    @abstractmethod
    def cancel(self, external_job_id: str) -> bool:
        """
        Cancels the active rendering task on the external provider.
        """
        pass

    @abstractmethod
    def download(self, video_url: str) -> bytes:
        """
        Retrieves the generated video binary file.
        """
        pass
