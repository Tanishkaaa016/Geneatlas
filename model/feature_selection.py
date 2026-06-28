from pathlib import Path

import pandas as pd
from sklearn.feature_selection import VarianceThreshold

DATA = Path("data/processed")

print("=" * 60)
print("GeneAtlas Feature Selection")
print("=" * 60)

# ----------------------
# Load dataset
# ----------------------

dataset = pd.read_csv(DATA / "geneatlas_dataset.csv")

print("Original dataset:")
print(dataset.shape)

# ----------------------
# Separate features and labels
# ----------------------

X = dataset.drop(
    columns=["sample", "primary disease or tissue"]
)

y = dataset["primary disease or tissue"]

# ----------------------
# Keep top 5000 most variable genes
# ----------------------

variances = X.var()

top_genes = variances.sort_values(
    ascending=False
).head(5000).index

X_selected = X[top_genes]

print("\nFeatures before:", X.shape[1])
print("Top variable genes kept:", X_selected.shape[1])

# ----------------------
# Save
# ----------------------

X_selected.to_csv(
    DATA / "X_selected.csv",
    index=False
)

y.to_csv(
    DATA / "y.csv",
    index=False
)
import joblib

joblib.dump(
    list(X_selected.columns),
    DATA / "selected_genes.pkl"
)

print("selected_genes.pkl saved")

print("\nSaved:")
print("X_selected.csv")
print("y.csv")