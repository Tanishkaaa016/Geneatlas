from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
import tensorflow as tf

BASE = Path(__file__).parent

MODEL_DIR = BASE / "saved_models"
DATA_DIR = BASE / "data" / "processed"

gene_map = pd.read_csv(DATA_DIR / "gene_mapping.csv")
gene_dict = dict(zip(gene_map["ensembl"], gene_map["symbol"]))

model = tf.keras.models.load_model(MODEL_DIR / "geneatlas_model.keras")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
selected_genes = joblib.load(DATA_DIR / "selected_genes.pkl")

X_background = pd.read_csv(DATA_DIR / "X_selected.csv").iloc[:100]
X_background = scaler.transform(X_background)

explainer = shap.DeepExplainer(model, X_background)


def _symbol(ensembl: str) -> str:
    base_id = ensembl.split(".")[0]
    return gene_dict.get(base_id, ensembl)


def explain_sample(df: pd.DataFrame) -> list[dict]:
    X = scaler.transform(df[selected_genes])
    prediction = model.predict(X, verbose=0)
    pred_class = int(np.argmax(prediction[0]))
    shap_values = explainer.shap_values(X)

    if isinstance(shap_values, list):
        values = np.abs(shap_values[pred_class][0])
    else:
        values = np.abs(shap_values[0, :, pred_class])

    top = np.argsort(values)[::-1][:10]

    return [
        {
            "gene": _symbol(selected_genes[idx]),
            "ensembl": selected_genes[idx],
            "importance": float(values[idx]),
            "shap": float(values[idx]),
        }
        for idx in top
    ]
