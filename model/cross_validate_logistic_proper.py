from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_selection import VarianceThreshold
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

DATA = Path("data/processed")

print("=" * 60)
print("Leakage-Free Logistic Regression")
print("=" * 60)

# --------------------------------------------------------
# Load
# --------------------------------------------------------

X = pd.read_csv(DATA / "geneatlas_dataset.csv")

y = X["primary disease or tissue"]

X = X.drop(columns=["sample", "primary disease or tissue"])

encoder = LabelEncoder()

y = encoder.fit_transform(y)

# --------------------------------------------------------
# Cross Validation
# --------------------------------------------------------

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = []

for fold, (train_idx, test_idx) in enumerate(cv.split(X, y), start=1):

    print(f"\nFold {fold}")

    X_train = X.iloc[train_idx].copy()
    X_test = X.iloc[test_idx].copy()

    y_train = y[train_idx]
    y_test = y[test_idx]

    # ----------------------------------------
    # Feature selection ONLY on training fold
    # ----------------------------------------

    variances = X_train.var()

    top_genes = variances.nlargest(5000).index

    X_train = X_train[top_genes]

    X_test = X_test[top_genes]

    # ----------------------------------------
    # Remove zero variance genes
    # ----------------------------------------

    selector = VarianceThreshold()

    X_train = selector.fit_transform(X_train)

    X_test = selector.transform(X_test)

    # ----------------------------------------
    # Scale
    # ----------------------------------------

    scaler = StandardScaler()

    X_train = scaler.fit_transform(X_train)

    X_test = scaler.transform(X_test)

    # ----------------------------------------
    # Train
    # ----------------------------------------

    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    pred = model.predict(X_test)

    acc = accuracy_score(y_test, pred)

    scores.append(acc)

    print(f"Accuracy: {acc:.4f}")

print("\n" + "=" * 60)

print("Cross Validation Results")

print("=" * 60)

print(scores)

print("\nMean Accuracy:", np.mean(scores))

print("Std:", np.std(scores))