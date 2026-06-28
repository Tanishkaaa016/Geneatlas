from pathlib import Path
import pandas as pd

RAW_DIR = Path("data/raw")

expression_path = list(RAW_DIR.glob("*gene_tpm*.gz"))[0]
phenotype_path = list(RAW_DIR.glob("*phenotype*.gz"))[0]

print("Loading phenotype...")
phenotype = pd.read_csv(
    phenotype_path,
    sep="\t",
    compression="gzip",
    engine="python"
)

print("Phenotype shape:", phenotype.shape)

print("\nLoading ONLY first 5 rows of expression...")

expression = pd.read_csv(
    expression_path,
    sep="\t",
    compression="gzip",
    nrows=5
)

print("Expression preview shape:", expression.shape)

print("\nFirst columns:")
print(expression.columns[:10])

print("\nFirst rows:")
print(expression.head())