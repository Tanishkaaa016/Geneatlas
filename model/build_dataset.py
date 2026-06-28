from pathlib import Path
import pandas as pd
import gzip

RAW = Path("data/raw")
OUT = Path("data/processed")

OUT.mkdir(exist_ok=True)

TARGET_CANCERS = [
    "Breast Invasive Carcinoma",
    "Kidney Clear Cell Carcinoma",
    "Lung Adenocarcinoma",
    "Colon Adenocarcinoma",
    "Prostate Adenocarcinoma",
]

# -----------------------------
# Load phenotype
# -----------------------------

print("Loading phenotype...")

phenotype = pd.read_csv(
    RAW / "TcgaTargetGTEX_phenotype.txt.gz",
    sep="\t",
    compression="gzip",
    encoding_errors="replace"
)

phenotype = phenotype[
    phenotype["primary disease or tissue"].isin(TARGET_CANCERS)
]

print("Samples kept:", len(phenotype))

print("\nCancer counts:")
print(phenotype["primary disease or tissue"].value_counts())

# Save filtered phenotype
phenotype.to_csv(
    OUT / "phenotype_filtered.csv",
    index=False
)

print("\nSaved phenotype_filtered.csv")