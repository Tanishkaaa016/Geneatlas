import joblib
import pandas as pd
import mygene

# Load selected genes
genes = joblib.load("data/processed/selected_genes.pkl")

# Remove version numbers (e.g. ENSG00000123456.12 -> ENSG00000123456)
gene_ids = [g.split(".")[0] for g in genes]

mg = mygene.MyGeneInfo()

results = mg.querymany(
    gene_ids,
    scopes="ensembl.gene",
    fields="symbol",
    species="human"
)

mapping = []

for r in results:
    mapping.append({
        "ensembl": r.get("query", ""),
        "symbol": r.get("symbol", r.get("query", ""))
    })

df = pd.DataFrame(mapping)

df.to_csv(
    "data/processed/gene_mapping.csv",
    index=False
)

print("Saved gene_mapping.csv")
print(df.head())