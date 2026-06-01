# GeneAtlas

GeneAtlas is an interactive pan-cancer classification platform that combines deep learning, biomarker discovery, and explainable AI to analyze RNA-Seq gene expression data.

The project uses a self-attention neural network to classify cancer types from transcriptomic profiles while identifying biologically relevant biomarkers through SHAP-based explainability methods. An accompanying web interface allows users to explore the methodology, datasets, biomarkers, pathways, and classification results interactively.

## Live Website

🌐 https://geneatlas.tanishkabajpai2005.workers.dev

## Overview

Cancer classification using high-dimensional gene expression data remains a challenging problem due to biological heterogeneity and the large number of genes involved. GeneAtlas addresses this challenge through:

* RNA-Seq gene expression analysis
* Deep learning-based cancer classification
* Self-attention neural network architecture
* Explainable AI using SHAP
* Interactive visualization of biomarkers and pathways
* Modern web-based research presentation

## Features

### Cancer Classification

* Multi-class classification of cancer types using RNA-Seq expression profiles
* Attention-based feature learning
* High-dimensional transcriptomic data processing

### Biomarker Discovery

* SHAP-driven feature importance analysis
* Identification of cancer-specific biomarkers
* Interpretability of model predictions

### Interactive Research Portal

* Dataset overview
* Methodology explanation
* Biomarker visualization
* Pathway exploration
* Results presentation
* References and supporting literature

## Technology Stack

### Machine Learning

* Python
* TensorFlow / Keras
* SHAP
* NumPy
* Pandas
* Scikit-learn

### Web Application

* React
* TypeScript
* TanStack Start
* Vite
* Tailwind CSS
* Cloudflare Workers

## Repository Structure

```text
src/
├── components/
├── routes/
├── server/
├── assets/
└── styles/
```

## Deployment

The project is deployed using Cloudflare Workers.

Production URL:

https://geneatlas.tanishkabajpai2005.workers.dev

## Research Significance

GeneAtlas demonstrates the integration of modern deep learning techniques with explainable artificial intelligence for biomedical applications. The project highlights how attention-based architectures can be used not only for accurate cancer classification but also for extracting biologically meaningful insights from gene expression data.

## Future Improvements

* Integration of additional omics datasets
* Survival prediction modules
* Drug response prediction
* Pathway enrichment analysis
* Clinical decision support features

## Author

**Tanishka Bajpai**

Biomedical Engineering (Medical Intelligence)

Developed as a research-focused project exploring machine learning, explainable AI, and computational biology for cancer classification.

