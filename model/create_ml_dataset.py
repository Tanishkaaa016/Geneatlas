from pathlib import Path
import pandas as pd

DATA = Path("data/processed")

print("=" * 60)
print("Creating Machine Learning Dataset")
print("=" * 60)

# --------------------
# Load files
# --------------------

expression = pd.read_csv(
    DATA / "expression_filtered.csv"
)

phenotype = pd.read_csv(
    DATA / "phenotype_filtered.csv"
)

print("Expression:", expression.shape)
print("Phenotype:", phenotype.shape)

# --------------------
# Transpose
# --------------------

expression = expression.set_index("sample").T

expression.index.name = "sample"

expression.reset_index(inplace=True)

print("\nAfter transpose:")
print(expression.shape)

# --------------------
# Merge
# --------------------

dataset = expression.merge(
    phenotype[
        ["sample", "primary disease or tissue"]
    ],
    on="sample"
)

print("\nMerged dataset:")
print(dataset.shape)

# --------------------
# Save
# --------------------

dataset.to_csv(
    DATA / "geneatlas_dataset.csv",
    index=False
)

print("\nSaved geneatlas_dataset.csv")