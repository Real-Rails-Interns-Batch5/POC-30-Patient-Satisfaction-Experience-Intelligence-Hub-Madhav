# Patient Satisfaction & Experience Intelligence Hub

Real Rails PoC 30 is a FastAPI + Next.js intelligence dashboard for HCAHPS-style experience signals, NPS cohorts, readmission linkage, and staff responsiveness.

## Run

Backend:

```powershell
cd backend
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

The UI runs at `http://localhost:3000`. It automatically switches to `public/mock_data.json` when the API is unavailable.

## Data provenance and adapters

Reusable source adapters live in `backend/app/adapters`. Each adapter exposes source authority, quality, refresh cadence, last-refresh date, and a public source link. The same metadata appears in the dashboard's Source Quality panel.

Synthetic sample artifacts are clearly labeled and stored in:

- `mock_data/patient_experience_synthetic.csv`
- `mock_data/patient_experience_synthetic.json`
- `mock_data/patient_experience_synthetic_data_dictionary.md`

These files contain fictional Gulf facilities and aggregate experience metrics only. They contain no PHI. The API also provides filtered demonstration exports at `/api/sample.csv` and `/api/sample.json`.

## Dashboard controls

Hospital search and hospital, department, and month filters update the visualizations without navigation. Tooltips are available on every chart, the shared legend explains signal colors, and the sidebar exports CSV or JSON.
