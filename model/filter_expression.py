from pathlib import Path
import pandas as pd
import gzip

RAW = Path("data/raw")
OUT = Path("data/processed")

print("=" * 60)
print("GeneAtlas Expression Filter")
print("=" * 60)

# ---------------------------
# Load filtered phenotype
# ---------------------------

phenotype = pd.read_csv(
    OUT / "phenotype_filtered.csv"
)

samples = set(phenotype["sample"])

print(f"Keeping {len(samples)} TCGA samples")

# ---------------------------
# Read ONLY header
# ---------------------------

expression_file = RAW / "TcgaTargetGtex_rsem_gene_tpm.gz"

with gzip.open(expression_file, "rt") as f:
    header = f.readline().strip().split("\t")

print(f"Total columns: {len(header)}")

# ---------------------------
# Find columns to keep
# ---------------------------

keep_indices = [0]

for i, sample in enumerate(header[1:], start=1):
    if sample in samples:
        keep_indices.append(i)

print(f"Keeping {len(keep_indices)-1} samples")

# ---------------------------
# Read filtered columns only
# ---------------------------

expression = pd.read_csv(
    expression_file,
    sep="\t",
    compression="gzip",
    usecols=keep_indices,
)

print("\nExpression shape:")
print(expression.shape)

expression.to_csv(
    OUT / "expression_filtered.csv",
    index=False
)

print("\nSaved expression_filtered.csv")