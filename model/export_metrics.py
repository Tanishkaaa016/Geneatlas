"""Export real evaluation metrics, biomarkers, pathways, and survival stats to JSON."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import LinearSVC

from constants import CANCER_LABELS

BASE = Path(__file__).parent
DATA = BASE / "data" / "processed"
MODEL_DIR = BASE / "saved_models"
EXPORTS = BASE / "exports"
FRONTEND_DATA = BASE.parent / "src" / "data"

EXPORTS.mkdir(exist_ok=True)
FRONTEND_DATA.mkdir(exist_ok=True)


def label_to_code(label: str) -> str:
    return CANCER_LABELS.get(label, {}).get("code", label)


def evaluate_neural_network(X_test, y_test, encoder):
    model = tf.keras.models.load_model(MODEL_DIR / "geneatlas_model.keras")
    probs = model.predict(X_test, verbose=0)
    y_pred = probs.argmax(axis=1)
    y_true = y_test

    report = classification_report(
        y_true,
        y_pred,
        target_names=encoder.classes_,
        output_dict=True,
        zero_division=0,
    )

    cm = confusion_matrix(y_true, y_pred)
    codes = [label_to_code(name) for name in encoder.classes_]

    per_class = []
    for idx, name in enumerate(encoder.classes_):
        key = name if name in report else str(idx)
        row = report.get(name, report.get(str(idx), {}))
        try:
            auc = roc_auc_score((y_true == idx).astype(int), probs[:, idx])
        except ValueError:
            auc = float("nan")
        per_class.append(
            {
                "label": name,
                "code": label_to_code(name),
                "precision": round(row.get("precision", 0), 3),
                "recall": round(row.get("recall", 0), 3),
                "f1": round(row.get("f1-score", 0), 3),
                "auc": round(auc, 3) if not np.isnan(auc) else 0,
                "support": int(row.get("support", 0)),
            }
        )

    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "macro_f1": round(float(f1_score(y_true, y_pred, average="macro")), 4),
        "confusion_matrix": cm.tolist(),
        "class_codes": codes,
        "class_labels": list(encoder.classes_),
        "per_class": per_class,
        "probabilities": probs.tolist(),
        "y_true": y_true.tolist(),
    }


def evaluate_baseline(name, estimator, X_train, X_test, y_train, y_test):
    estimator.fit(X_train, y_train)
    pred = estimator.predict(X_test)
    return {
        "model": name,
        "accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "f1": round(float(f1_score(y_test, pred, average="macro")), 4),
    }


def calibration_bins(probabilities, y_true, n_bins=10):
    confidences = probabilities.max(axis=1)
    predictions = probabilities.argmax(axis=1)
    correct = predictions == y_true

    bins = []
    for i in range(n_bins):
        lo = i / n_bins
        hi = (i + 1) / n_bins
        mask = (confidences > lo) & (confidences <= hi)
        if mask.sum() == 0:
            continue
        bins.append(
            {
                "bin": f"{lo:.1f}-{hi:.1f}",
                "confidence": round(float(confidences[mask].mean()), 3),
                "accuracy": round(float(correct[mask].mean()), 3),
                "count": int(mask.sum()),
            }
        )
    return bins


def export_biomarkers(X, y, encoder):
    """Top genes per class by mean standardized expression (fast, reproducible)."""
    from shap_service import _symbol

    atlas = {}
    X_scaled = (X - X.mean()) / X.std().replace(0, 1)

    for class_idx, label in enumerate(encoder.classes_):
        mask = y == class_idx
        if mask.sum() == 0:
            continue

        class_mean = X_scaled[mask].mean(axis=0)
        top = class_mean.nlargest(8).index

        genes = []
        for rank, ensembl in enumerate(top, start=1):
            score = float(class_mean[ensembl])
            genes.append(
                {
                    "symbol": _symbol(ensembl),
                    "ensembl": ensembl,
                    "shap": round(score, 4),
                    "note": f"Rank {rank} by class mean expression",
                }
            )

        meta = CANCER_LABELS.get(label, {})
        atlas[meta.get("code", label)] = {
            "code": meta.get("code", label),
            "full": label,
            "genes": genes,
        }

    return atlas


def export_pathways(biomarker_atlas):
    from pathway_enrichment import enrich_subtype_pathways

    enriched = []
    for code, payload in biomarker_atlas.items():
        genes = [g["symbol"] for g in payload["genes"]]
        rows = enrich_subtype_pathways(genes, code)
        enriched.append(
            {
                "code": code,
                "full": payload["full"],
                "rows": rows,
            }
        )
    return enriched


def export_survival():
    """Subtype-level survival statistics from TCGA literature (illustrative)."""
    return {
        "disclaimer": "Illustrative TCGA literature-based median overall survival by cancer type. Not computed from this cohort (clinical follow-up not in current dataset).",
        "source": "TCGA Pan-Cancer Atlas published survival summaries",
        "curves": [
            {
                "code": "BRCA",
                "label": "Breast Invasive Carcinoma",
                "median_months": 126,
                "five_year_survival": 0.89,
                "points": [
                    {"months": 0, "survival": 1.0},
                    {"months": 12, "survival": 0.96},
                    {"months": 36, "survival": 0.92},
                    {"months": 60, "survival": 0.89},
                    {"months": 120, "survival": 0.78},
                ],
            },
            {
                "code": "KIRC",
                "label": "Kidney Clear Cell Carcinoma",
                "median_months": 68,
                "five_year_survival": 0.74,
                "points": [
                    {"months": 0, "survival": 1.0},
                    {"months": 12, "survival": 0.88},
                    {"months": 36, "survival": 0.79},
                    {"months": 60, "survival": 0.74},
                    {"months": 120, "survival": 0.58},
                ],
            },
            {
                "code": "LUAD",
                "label": "Lung Adenocarcinoma",
                "median_months": 48,
                "five_year_survival": 0.55,
                "points": [
                    {"months": 0, "survival": 1.0},
                    {"months": 12, "survival": 0.78},
                    {"months": 36, "survival": 0.64},
                    {"months": 60, "survival": 0.55},
                    {"months": 120, "survival": 0.38},
                ],
            },
            {
                "code": "PRAD",
                "label": "Prostate Adenocarcinoma",
                "median_months": 144,
                "five_year_survival": 0.98,
                "points": [
                    {"months": 0, "survival": 1.0},
                    {"months": 12, "survival": 0.99},
                    {"months": 36, "survival": 0.98},
                    {"months": 60, "survival": 0.98},
                    {"months": 120, "survival": 0.94},
                ],
            },
            {
                "code": "COAD",
                "label": "Colon Adenocarcinoma",
                "median_months": 42,
                "five_year_survival": 0.65,
                "points": [
                    {"months": 0, "survival": 1.0},
                    {"months": 12, "survival": 0.82},
                    {"months": 36, "survival": 0.71},
                    {"months": 60, "survival": 0.65},
                    {"months": 120, "survival": 0.52},
                ],
            },
        ],
    }


def main():
    print("=" * 60)
    print("Exporting GeneAtlas metrics")
    print("=" * 60)

    X = pd.read_csv(DATA / "X_selected.csv")
    y_raw = pd.read_csv(DATA / "y.csv").squeeze()

    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    nn = evaluate_neural_network(X_test_scaled, y_test, encoder)

    baselines = [
        evaluate_baseline(
            "Logistic Regression",
            LogisticRegression(max_iter=1000, random_state=42),
            X_train_scaled,
            X_test_scaled,
            y_train,
            y_test,
        ),
        evaluate_baseline(
            "Linear SVM",
            LinearSVC(random_state=42, max_iter=3000),
            X_train_scaled,
            X_test_scaled,
            y_train,
            y_test,
        ),
    ]

    baselines.append(
        {
            "model": "GeneAtlas Neural Network",
            "accuracy": nn["accuracy"],
            "f1": nn["macro_f1"],
        }
    )

    probs = np.array(nn.pop("probabilities"))
    y_true = np.array(nn.pop("y_true"))

    metrics = {
        "dataset": {
            "samples": int(len(y_raw)),
            "features": int(X.shape[1]),
            "classes": list(encoder.classes_),
            "test_size": int(len(y_test)),
        },
        "model": {
            "architecture": "MLP (1024→512→256→softmax)",
            "framework": "TensorFlow/Keras",
            "feature_selection": "Top 5000 variable genes",
        },
        "evaluation": nn,
        "baselines": baselines,
        "calibration": calibration_bins(probs, y_true),
    }

    biomarkers = export_biomarkers(X, y, encoder)
    pathways = export_pathways(biomarkers)
    survival = export_survival()

    outputs = {
        "metrics.json": metrics,
        "biomarkers.json": biomarkers,
        "pathways.json": pathways,
        "survival.json": survival,
    }

    for name, payload in outputs.items():
        text = json.dumps(payload, indent=2)
        (EXPORTS / name).write_text(text)
        (FRONTEND_DATA / name).write_text(text)
        print(f"Wrote {name}")

    print("\nDone.")


if __name__ == "__main__":
    main()
