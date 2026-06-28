from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
import tensorflow as tf

DATA = Path("data/processed")
MODEL = Path("saved_models")

print("=" * 60)
print("GeneAtlas SHAP Explainability")
print("=" * 60)

# --------------------------------------------------
# Load
# --------------------------------------------------

X = pd.read_csv(DATA / "X_selected.csv")

encoder = joblib.load(
    MODEL / "label_encoder.pkl"
)

scaler = joblib.load(
    MODEL / "scaler.pkl"
)

model = tf.keras.models.load_model(
    MODEL / "geneatlas_model.keras"
)

# --------------------------------------------------
# Scale
# --------------------------------------------------

X_scaled = scaler.transform(X)

# --------------------------------------------------
# Prediction
# --------------------------------------------------

sample = X_scaled[:1]

prediction = model.predict(sample, verbose=0)

pred_class = prediction.argmax(axis=1)[0]

print("\nPrediction:")
print(encoder.inverse_transform([pred_class])[0])

print("\nConfidence:")
print(float(prediction.max()))

# --------------------------------------------------
# SHAP
# --------------------------------------------------

background = X_scaled[np.random.choice(len(X_scaled), 100, replace=False)]

explainer = shap.GradientExplainer(
    model,
    background
)

shap_values = explainer.shap_values(sample)

print("\nSHAP shape:")
print(shap_values.shape)

# Shape = (samples, genes, classes)

importance = np.abs(
    shap_values[0, :, pred_class]
)

top = np.argsort(importance)[::-1][:20]

print("\nTop 20 Biomarkers\n")

for rank, idx in enumerate(top, start=1):

    print(
        f"{rank:2d}. {X.columns[idx]:35s} {importance[idx]:.6f}"
    )