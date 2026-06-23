from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class SourceMetadata:
    name: str
    url: str
    authority: str
    quality: str
    refresh_cadence: str
    last_refreshed: str


class SourceAdapter(ABC):
    """Shared contract for source-specific ETL adapters used across PoCs."""

    @abstractmethod
    def metadata(self) -> SourceMetadata:
        raise NotImplementedError

