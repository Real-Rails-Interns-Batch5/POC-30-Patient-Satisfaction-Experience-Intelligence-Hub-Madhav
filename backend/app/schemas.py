from pydantic import BaseModel


class Metric(BaseModel):
    label: str
    value: str
    detail: str
    direction: str


class DomainScore(BaseModel):
    domain: str
    score: float
    benchmark: float
    delta: float


class TrendPoint(BaseModel):
    month: str
    department: str
    score: float
    benchmark: float


class NpsCohort(BaseModel):
    cohort: str
    promoters: int
    passives: int
    detractors: int
    nps: int


class CorrelationPoint(BaseModel):
    hospital: str
    satisfaction: float
    readmission_rate: float
    quartile: str


class HeatmapCell(BaseModel):
    department: str
    month: str
    score: float
    status: str


class FilterOptions(BaseModel):
    hospitals: list[str]
    departments: list[str]
    months: list[str]


class SourceQuality(BaseModel):
    name: str
    url: str
    authority: str
    quality: str
    refresh_cadence: str
    last_refreshed: str


class Sidebar(BaseModel):
    title: str
    rail_category: str
    headline_metric: Metric
    why_this_matters: str
    who_controls: str
    sources: list[SourceQuality]


class DashboardResponse(BaseModel):
    generated_at: str
    selected_hospital: str
    selected_department: str
    selected_month: str
    filters: FilterOptions
    sidebar: Sidebar
    metrics: list[Metric]
    domain_scores: list[DomainScore]
    trends: list[TrendPoint]
    nps_cohorts: list[NpsCohort]
    correlations: list[CorrelationPoint]
    responsiveness: list[HeatmapCell]
    insights: list[str]
