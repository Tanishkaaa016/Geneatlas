"""FastAPI backend for GeneAtlas predictions and exports."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predictor import get_demo_sample, predict_dataframe
from shap_service import explain_sample

BASE = Path(__file__).parent
EXPORTS = BASE / "exports"


class PredictJsonBody(BaseModel):
    csv: str | None = None
    mode: str | None = None


app = FastAPI(title="GeneAtlas API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _success(result: list[dict]) -> dict:
    return {"success": True, "results": result}


def _error(message: str) -> dict:
    return {"success": False, "error": message}


@app.get("/")
def home():
    return {
        "message": "GeneAtlas API running",
        "endpoints": ["/predict", "/api/predict", "/api/demo", "/api/metrics"],
    }


@app.get("/api/demo")
def demo():
    try:
        df = get_demo_sample()
        result = predict_dataframe(df)
        result[0]["biomarkers"] = explain_sample(df)
        return _success(result)
    except Exception as exc:
        return _error(str(exc))


@app.get("/api/metrics")
def metrics():
    path = EXPORTS / "metrics.json"
    if not path.exists():
        return _error("Metrics not exported yet. Run: python export_metrics.py")
    return json.loads(path.read_text())


@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
        result = predict_dataframe(df)
        result[0]["biomarkers"] = explain_sample(df)
        return _success(result)
    except Exception as exc:
        return _error(str(exc))


@app.post("/api/predict/json")
async def predict_json(body: PredictJsonBody):
    try:
        if body.mode == "demo" or not body.csv:
            df = get_demo_sample()
        else:
            from io import StringIO

            df = pd.read_csv(StringIO(body.csv))
        result = predict_dataframe(df)
        result[0]["biomarkers"] = explain_sample(df)
        return _success(result)
    except Exception as exc:
        return _error(str(exc))
