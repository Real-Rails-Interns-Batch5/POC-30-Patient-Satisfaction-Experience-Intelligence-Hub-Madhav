from __future__ import annotations

from datetime import UTC, datetime
from functools import lru_cache
from math import sin

import pandas as pd

from .adapters import source_catalog
from .schemas import (
    CorrelationPoint,
    DashboardResponse,
    DomainScore,
    FilterOptions,
    HeatmapCell,
    Metric,
    NpsCohort,
    Sidebar,
    TrendPoint,
)

HOSPITALS = ["Al Noor Medical City", "Gulfview Specialist", "Riyadh Central", "Marina Health Campus"]
DEPARTMENTS = ["Emergency", "Inpatient", "Outpatient", "Maternity", "Surgery"]
MONTHS = ["2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"]
DOMAINS = [
    "Nurse Communication",
    "Doctor Communication",
    "Staff Responsiveness",
    "Medication Communication",
    "Discharge Information",
    "Care Transition",
]
BENCHMARKS = {
    "Nurse Communication": 78.0,
    "Doctor Communication": 80.0,
    "Staff Responsiveness": 69.0,
    "Medication Communication": 66.0,
    "Discharge Information": 84.0,
    "Care Transition": 57.0,
}


@lru_cache(maxsize=1)
def survey_frame() -> pd.DataFrame:
    rows: list[dict] = []
    for hi, hospital in enumerate(HOSPITALS):
        for di, department in enumerate(DEPARTMENTS):
            for mi, month in enumerate(MONTHS):
                for oi, domain in enumerate(DOMAINS):
                    score = BENCHMARKS[domain] + (2.8 - hi * 1.7) + (mi - 2) * 0.65
                    score += (di - 2) * 0.55 + sin((hi + 1) * (di + 2) * (mi + oi + 1)) * 2.3
                    rows.append(
                        {
                            "hospital": hospital,
                            "department": department,
                            "month": month,
                            "domain": domain,
                            "score": round(max(48, min(94, score)), 1),
                            "benchmark": BENCHMARKS[domain],
                            "responses": 82 + hi * 19 + di * 13 + mi * 7 + oi * 3,
                        }
                    )
    return pd.DataFrame(rows)


def _filtered(frame: pd.DataFrame, hospital: str, department: str, month: str) -> pd.DataFrame:
    result = frame
    if hospital != "All Hospitals":
        result = result[result["hospital"] == hospital]
    if department != "All Departments":
        result = result[result["department"] == department]
    if month != "All Months":
        result = result[result["month"] == month]
    return result


def build_dashboard(hospital: str, department: str, month: str) -> DashboardResponse:
    frame = survey_frame()
    selected = _filtered(frame, hospital, department, month)
    radar_hospital = HOSPITALS[0] if hospital == "All Hospitals" else hospital
    radar = frame[frame["hospital"] == radar_hospital]
    if department != "All Departments":
        radar = radar[radar["department"] == department]
    if month != "All Months":
        radar = radar[radar["month"] == month]

    domain_group = radar.groupby("domain", as_index=False).agg(score=("score", "mean"), benchmark=("benchmark", "mean"))
    domain_scores = [
        DomainScore(domain=r.domain, score=round(r.score, 1), benchmark=round(r.benchmark, 1), delta=round(r.score - r.benchmark, 1))
        for r in domain_group.itertuples()
    ]

    trend_source = frame if hospital == "All Hospitals" else frame[frame["hospital"] == hospital]
    if department != "All Departments":
        trend_source = trend_source[trend_source["department"] == department]
    trend_group = trend_source.groupby(["month", "department"], as_index=False).agg(score=("score", "mean"), benchmark=("benchmark", "mean"))
    trends = [TrendPoint(month=r.month, department=r.department, score=round(r.score, 1), benchmark=round(r.benchmark, 1)) for r in trend_group.itertuples()]

    average = float(selected["score"].mean())
    response_count = int(selected.drop_duplicates(["hospital", "department", "month"])["responses"].sum())
    previous_months = MONTHS[:-1]
    earliest = float(trend_source[trend_source["month"] == previous_months[0]]["score"].mean())
    latest = float(trend_source[trend_source["month"] == MONTHS[-1]]["score"].mean())
    movement = latest - earliest

    nps_cohorts: list[NpsCohort] = []
    cohort_names = ["Digital check-in", "Standard admission", "Post-discharge follow-up", "Complex care"]
    base = int(round(average - 48))
    for index, cohort in enumerate(cohort_names):
        nps = max(-20, min(72, base + [12, 1, 18, -8][index]))
        promoters = 48 + nps // 2
        detractors = promoters - nps
        passives = 100 - promoters - detractors
        nps_cohorts.append(NpsCohort(cohort=cohort, promoters=promoters, passives=passives, detractors=detractors, nps=nps))

    hospital_scores = frame.groupby("hospital", as_index=False)["score"].mean().sort_values("score", ascending=False).reset_index(drop=True)
    correlations: list[CorrelationPoint] = []
    for index, row in hospital_scores.iterrows():
        readmission = round(18.8 - (row["score"] - 65) * 0.34 + index * 0.15, 1)
        correlations.append(CorrelationPoint(hospital=row["hospital"], satisfaction=round(row["score"], 1), readmission_rate=readmission, quartile=f"Q{index + 1}"))

    heat_source = frame[frame["domain"] == "Staff Responsiveness"]
    if hospital != "All Hospitals":
        heat_source = heat_source[heat_source["hospital"] == hospital]
    heat_group = heat_source.groupby(["department", "month"], as_index=False)["score"].mean()
    responsiveness = [
        HeatmapCell(
            department=r.department,
            month=r.month,
            score=round(r.score, 1),
            status="above" if r.score >= BENCHMARKS["Staff Responsiveness"] else "watch" if r.score >= 66 else "priority",
        )
        for r in heat_group.itertuples()
    ]

    best_domain = max(domain_scores, key=lambda item: item.delta)
    risk_domain = min(domain_scores, key=lambda item: item.delta)
    readmission_spread = correlations[-1].readmission_rate - correlations[0].readmission_rate
    metrics = [
        Metric(label="Experience score", value=f"{average:.1f}", detail=f"{average - selected['benchmark'].mean():+.1f} vs benchmark", direction="up" if average >= selected["benchmark"].mean() else "down"),
        Metric(label="NPS", value=f"{nps_cohorts[0].nps:+d}", detail="Digital check-in cohort", direction="up" if nps_cohorts[0].nps >= 0 else "down"),
        Metric(label="Responses", value=f"{response_count:,}", detail="Filtered survey coverage", direction="neutral"),
        Metric(label="Trend", value=f"{movement:+.1f}", detail="Points since July", direction="up" if movement >= 0 else "down"),
    ]

    sidebar = Sidebar(
        title="Infocreon Internship - Patient Satisfaction & Experience Intelligence Hub",
        rail_category="Patient Experience",
        headline_metric=metrics[0],
        why_this_matters="Patient experience is the lagging indicator that reflects everything else in a hospital - this turns survey data into an actionable intelligence tool for Gulf accreditation teams.",
        who_controls="Hospital leadership, quality improvement teams, accreditation bodies, and healthcare regulators influence outcomes through service standards, metric oversight, and operational improvement.",
        sources=[source.__dict__ for source in source_catalog()],
    )
    insights = [
        f"{best_domain.domain} leads its benchmark by {best_domain.delta:+.1f} points.",
        f"{risk_domain.domain} is the highest-priority opportunity at {risk_domain.delta:+.1f} points versus benchmark.",
        f"The bottom satisfaction quartile carries {readmission_spread:.1f} points more readmission risk than the top quartile.",
    ]
    return DashboardResponse(
        generated_at=datetime.now(UTC).isoformat(),
        selected_hospital=hospital,
        selected_department=department,
        selected_month=month,
        filters=FilterOptions(hospitals=["All Hospitals", *HOSPITALS], departments=["All Departments", *DEPARTMENTS], months=["All Months", *MONTHS]),
        sidebar=sidebar,
        metrics=metrics,
        domain_scores=domain_scores,
        trends=trends,
        nps_cohorts=nps_cohorts,
        correlations=correlations,
        responsiveness=responsiveness,
        insights=insights,
    )


def sample_csv() -> str:
    return "SYNTHETIC DATA - NOT REAL\n" + survey_frame().head(250).to_csv(index=False)


def sample_json() -> str:
    return survey_frame().head(250).to_json(orient="records", indent=2)
