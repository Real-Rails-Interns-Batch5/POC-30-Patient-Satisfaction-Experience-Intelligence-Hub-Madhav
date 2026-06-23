from dataclasses import dataclass

from .base import SourceAdapter, SourceMetadata


@dataclass(frozen=True)
class CatalogAdapter(SourceAdapter):
    source: SourceMetadata

    def metadata(self) -> SourceMetadata:
        return self.source


_ADAPTERS = [
    CatalogAdapter(SourceMetadata("HCAHPS public benchmarks", "https://hcahpsonline.org/", "CMS", "High", "Quarterly", "2026-06-22")),
    CatalogAdapter(SourceMetadata("CMS Care Compare", "https://www.medicare.gov/care-compare/", "U.S. CMS", "High", "Quarterly", "2026-06-22")),
    CatalogAdapter(SourceMetadata("Saudi CBAHI standards", "https://portal.cbahi.gov.sa/", "CBAHI", "High", "Standards cycle", "2026-06-22")),
    CatalogAdapter(SourceMetadata("UAE DOH reports", "https://www.doh.gov.ae/", "Abu Dhabi DOH", "High", "Annual", "2026-06-22")),
    CatalogAdapter(SourceMetadata("NHS Friends & Family Test", "https://www.england.nhs.uk/fft/", "NHS England", "High", "Monthly", "2026-06-22")),
]


def source_catalog() -> list[SourceMetadata]:
    return [adapter.metadata() for adapter in _ADAPTERS]

