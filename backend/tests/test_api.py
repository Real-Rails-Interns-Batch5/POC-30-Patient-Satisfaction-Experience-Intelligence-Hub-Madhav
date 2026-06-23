from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_dashboard_contract_and_intelligence() -> None:
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["domain_scores"]) == 6
    assert len(payload["nps_cohorts"]) == 4
    assert len(payload["correlations"]) == 4
    assert len(payload["insights"]) == 3
    assert payload["sidebar"]["headline_metric"]["detail"]
    assert all("delta" in item for item in payload["domain_scores"])


def test_filters_change_results() -> None:
    baseline = client.get("/api/dashboard").json()
    filtered = client.get(
        "/api/dashboard",
        params={"hospital": "Riyadh Central", "department": "Emergency", "month": "2025-12"},
    ).json()
    assert filtered["selected_hospital"] == "Riyadh Central"
    assert filtered["selected_department"] == "Emergency"
    assert filtered["metrics"][0]["value"] != baseline["metrics"][0]["value"]


def test_invalid_filter_is_rejected() -> None:
    response = client.get("/api/dashboard", params={"hospital": "Unknown"})
    assert response.status_code == 422


def test_sample_download() -> None:
    response = client.get("/api/sample.csv")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert response.text.startswith("SYNTHETIC DATA - NOT REAL")
    assert "hospital,department,month,domain" in response.text


def test_json_sample_download_is_labeled() -> None:
    response = client.get("/api/sample.json")
    assert response.status_code == 200
    assert response.json()["synthetic_data_notice"] == "SYNTHETIC DATA - NOT REAL"
    assert len(response.json()["records"]) == 250
