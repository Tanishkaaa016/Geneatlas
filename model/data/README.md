# TCGA data (not committed)

Raw and processed expression matrices are too large for GitHub (~3 GB).

## Regenerate locally

1. Run the notebooks/scripts in `model/notebooks/` and `model/build_dataset.py`
2. Or place your processed files here:
   - `processed/X_selected.csv`
   - `processed/y.csv`
   - `processed/selected_genes.pkl`
   - `processed/gene_mapping.csv`

3. Export UI metrics:
   ```bash
   cd model && source venv/bin/activate && python export_metrics.py
   ```

Trained model weights are committed under `model/saved_models/`.
