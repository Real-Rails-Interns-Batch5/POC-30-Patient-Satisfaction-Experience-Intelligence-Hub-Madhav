from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, Response

from .data_service import DEPARTMENTS, HOSPITALS, MONTHS, build_dashboard, sample_csv, sample_json
from .schemas import DashboardResponse

app = FastAPI(title="Patient Experience Intelligence API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "patient-experience-intelligence"}


@app.get("/api/dashboard", response_model=DashboardResponse)
def dashboard(
    hospital: str = Query("All Hospitals"),
    department: str = Query("All Departments"),
    month: str = Query("All Months"),
) -> DashboardResponse:
    valid = hospital in ["All Hospitals", *HOSPITALS] and department in ["All Departments", *DEPARTMENTS] and month in ["All Months", *MONTHS]
    if not valid:
        raise HTTPException(status_code=422, detail="Unknown filter value")
    return build_dashboard(hospital, department, month)


@app.get("/api/sample.csv", response_class=PlainTextResponse)
def download_sample() -> PlainTextResponse:
    return PlainTextResponse(
        sample_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=patient_experience_sample.csv"},
    )


@app.get("/api/sample.json")
def download_sample_json() -> Response:
    return Response(
        content='{"synthetic_data_notice":"SYNTHETIC DATA - NOT REAL","records":' + sample_json() + "}",
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=patient_experience_synthetic.json"},
    )
