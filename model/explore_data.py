import gzip
import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw")

expression_path = list(RAW_DIR.glob("*gene_tpm*.gz"))[0]
phenotype_path = list(RAW_DIR.glob("*phenotype*.gz"))[0]

print("=" * 60)
print("GeneAtlas Dataset Explorer")
print("=" * 60)

# --------------------------
# Phenotype
# --------------------------
print("\nLoading phenotype...")

import gzip
import io

with gzip.open(phenotype_path, "rb") as f:
    raw = f.read()

text = raw.decode("utf-8", errors="replace")

phenotype = pd.read_csv(
    io.StringIO(text),
    sep="\t",
    engine="python"
)

print("\nPhenotype Shape:")
print(phenotype.shape)

print("\nPhenotype Columns:")
print(phenotype.columns.tolist())

print("\nCancer Types:")
print(phenotype["primary disease or tissue"].value_counts().head(20))

# --------------------------
# Expression Header
# --------------------------
print("\nReading expression header...")

with gzip.open(expression_path, "rt") as f:
    header = f.readline().strip().split("\t")

print(f"\nNumber of samples: {len(header)-1}")

print("\nFirst 10 samples:")
print(header[:10])