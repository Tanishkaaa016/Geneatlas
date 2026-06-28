# GeneAtlas

GeneAtlas is an explainable pan-cancer RNA-Seq classification platform for Medical Intelligence research. It combines a TensorFlow deep neural network, SHAP biomarker discovery, pathway enrichment, clinical decision support, and an interactive web portal.

**Live demo:** https://geneatlas.tanishkabajpai2005.workers.dev

## What it does

- Classifies **5 TCGA cancer subtypes** (BRCA, COAD, KIRC, LUAD, PRAD) from bulk RNA-Seq
- Returns **SHAP-based biomarkers** per prediction
- Provides **clinical decision-support context** (recommended tests, therapeutic targets, uncertainty bands)
- Exports a **PDF research report**
- Displays **real held-out test metrics**, baseline comparisons, calibration, pathway enrichment, and survival context

## Architecture

```text
TCGA RNA-Seq → preprocessing → 5000-gene panel → TensorFlow MLP → FastAPI
                                                      ↓
                                            SHAP + clinical context
                                                      ↓
                              TanStack Start UI (Cloudflare Workers)
```

## Quick start

### 1. Frontend

```bash
npm install
npm run dev
```

### 2. ML API (local)

```bash
cd model
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

Point the frontend proxy at your local API:

```bash
VITE_GENEATLAS_API_URL=http://127.0.0.1:8000 npm run dev
```

### 3. Export real metrics (after training)

```bash
cd model
source venv/bin/activate
python export_metrics.py
```

This writes JSON to `src/data/` for the Results, Biomarkers, Pathways, and Survival sections.

## Project structure

```text
src/
├── components/site/     # Research portal UI
├── data/                # Exported metrics (generated)
├── lib/                 # Clinical logic, PDF report, types
└── routes/api/          # Server-side API proxy

model/
├── api.py               # FastAPI inference service
├── predictor.py         # Model loading + prediction
├── shap_service.py      # SHAP explainability
├── clinical.py          # Decision-support logic
├── export_metrics.py    # Export evaluation JSON
├── pathway_enrichment.py
└── train_neural_network.py
```

## Portfolio highlights (MI / BME)

| Feature | Skill demonstrated |
|---------|-------------------|
| TCGA pipeline | Computational biology |
| TensorFlow MLP | Deep learning |
| SHAP | Explainable AI |
| Calibration + baselines | Rigorous ML evaluation |
| Clinical panel | Medical decision support |
| Pathway enrichment | Systems biology |
| Full-stack deployment | Software engineering |

## Important disclaimer

GeneAtlas is a **research and education prototype**. It is not an FDA-cleared diagnostic device and must not be used for clinical decision-making without proper validation.

## Author

**Tanishka Bajpai** — B.Tech Biomedical Engineering (Medical Intelligence)
