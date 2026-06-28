from pathlib import Path

import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

DATA = Path("data/processed")
MODEL_DIR = Path("saved_models")

MODEL_DIR.mkdir(exist_ok=True)

print("=" * 60)
print("GeneAtlas Logistic Regression")
print("=" * 60)

# -------------------------------------------------
# Load
# -------------------------------------------------

X = pd.read_csv(DATA / "X_selected.csv")
y = pd.read_csv(DATA / "y.csv").squeeze()

print("Features:", X.shape)
print("Labels:", y.shape)

# -------------------------------------------------
# Encode labels
# -------------------------------------------------

encoder = LabelEncoder()

y = encoder.fit_transform(y)

print("\nCancer Classes:")

for i, c in enumerate(encoder.classes_):
    print(i, "->", c)

# -------------------------------------------------
# Split
# -------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42,
)

print("\nTraining samples:", X_train.shape[0])
print("Testing samples :", X_test.shape[0])

# -------------------------------------------------
# Scale
# -------------------------------------------------

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# -------------------------------------------------
# Train
# -------------------------------------------------

print("\nTraining Logistic Regression...")

model = LogisticRegression(
    max_iter=1000,
    random_state=42,
    n_jobs=-1,
)

model.fit(X_train, y_train)

# -------------------------------------------------
# Predict
# -------------------------------------------------

pred = model.predict(X_test)

print("\nAccuracy:")
print(f"{accuracy_score(y_test, pred):.4f}")

print("\nClassification Report:")
print(classification_report(
    y_test,
    pred,
    target_names=encoder.classes_,
))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, pred))

# -------------------------------------------------
# Save
# -------------------------------------------------

joblib.dump(model, MODEL_DIR / "logistic_model.pkl")
joblib.dump(scaler, MODEL_DIR / "scaler.pkl")
joblib.dump(encoder, MODEL_DIR / "label_encoder.pkl")

print("\nSaved model.")