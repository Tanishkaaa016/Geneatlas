from pathlib import Path
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline

DATA = Path("data/processed")

X = pd.read_csv(DATA / "X_selected.csv")
y = pd.read_csv(DATA / "y.csv").squeeze()

encoder = LabelEncoder()
y = encoder.fit_transform(y)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(
        max_iter=1000,
        random_state=42,
        n_jobs=-1
    ))
])

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = cross_val_score(
    pipeline,
    X,
    y,
    cv=cv,
    scoring="accuracy"
)

print("=" * 50)
print("5-Fold Cross Validation")
print("=" * 50)

print(scores)

print("\nMean Accuracy:")
print(scores.mean())

print("\nStd:")
print(scores.std())