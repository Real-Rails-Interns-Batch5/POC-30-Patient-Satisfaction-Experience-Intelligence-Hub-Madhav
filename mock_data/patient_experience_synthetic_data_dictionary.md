# Patient Experience Synthetic Data Dictionary

> **SYNTHETIC DATA - NOT REAL**

This dataset supports the Patient Satisfaction & Experience Intelligence Hub demo. Facility names are fictional and modelled on Gulf healthcare naming conventions. It contains no PHI or patient-level identities.

| Field | Type | Unit / format | Meaning | Realistic range |
|---|---|---|---|---|
| `response_id` | String | `PXS-NNNN` | Synthetic aggregate record identifier | Unique within file |
| `survey_month` | String | `YYYY-MM` | Month represented by the aggregate | 2025-07 to 2025-12 |
| `country` | String | Gulf country | Country of the fictional facility | Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman |
| `city` | String | City | Gulf city associated with the facility | Valid city for country |
| `facility` | String | Name | Fictional hospital or medical campus | Non-empty |
| `department` | Category | Name | Clinical service line | Emergency, Inpatient, Outpatient, Maternity, Surgery |
| `domain` | Category | HCAHPS-style domain | Experience dimension measured | Six supported domains |
| `score_pct` | Decimal | Percent | Positive-response experience score | 45.0-95.0 |
| `benchmark_pct` | Decimal | Percent | Reference benchmark for the domain | 50.0-90.0 |
| `nps` | Integer | Score | Net Promoter Score for the cohort | -100 to +100 |
| `readmission_rate_pct` | Decimal | Percent | Synthetic 30-day readmission linkage | 5.0-25.0 |
| `response_count` | Integer | Responses | Aggregate survey response volume | 25-500 |

The intentionally low values in `PXS-0001`, `PXS-0006`, and `PXS-0010` provide realistic priority outliers for demonstrations.
