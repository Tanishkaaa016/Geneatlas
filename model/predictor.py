from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

from clinical import get_clinical_context, prediction_entropy
from constants import CANCER_LABELS

BASE = Path(__file__).parent

MODEL_DIR = BASE / "saved_models"
DATA_DIR = BASE / "data" / "processed"

model = tf.keras.models.load_model(MODEL_DIR / "geneatlas_model.keras")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")
selected_genes = joblib.load(DATA_DIR / "selected_genes.pkl")


def prepare_dataframe(df: pd.DataFrame) -> np.ndarray:
    missing = [gene for gene in selected_genes if gene not in df.columns]

    if missing:
        raise ValueError(
            f"Missing {len(missing)} required genes (need {len(selected_genes)}). "
            f"First missing: {missing[:5]}"
        )

    return scaler.transform(df[selected_genes])


def _format_prediction(label: str, confidence: float, probabilities: dict[str, float]) -> dict:
    meta = CANCER_LABELS.get(label, {})
    entropy = prediction_entropy(probabilities)
    clinical = get_clinical_context(label, confidence, probabilities)

    return {
        "prediction": label,
        "code": meta.get("code", label),
        "confidence": confidence,
        "entropy": round(entropy, 4),
        "probabilities": probabilities,
        "probabilities_by_code": {
            CANCER_LABELS[name]["code"]: value
            for name, value in probabilities.items()
            if name in CANCER_LABELS
        },
        "clinical": clinical,
    }


def predict_dataframe(df: pd.DataFrame) -> list[dict]:
    X = prepare_dataframe(df)
    probabilities = model.predict(X, verbose=0)
    class_names = list(encoder.classes_)
    predictions = []

    for row in probabilities:
        idx = int(np.argmax(row))
        label = class_names[idx]
        confidence = float(row[idx])
        probs = {class_names[i]: float(row[i]) for i in range(len(class_names))}
        predictions.append(_format_prediction(label, confidence, probs))

    return predictions


def get_demo_sample() -> pd.DataFrame:
    """Return one held-out-style sample from the processed dataset."""
    X = pd.read_csv(DATA_DIR / "X_selected.csv", nrows=1)
    return X
