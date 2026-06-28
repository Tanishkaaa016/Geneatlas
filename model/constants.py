"""Shared constants for GeneAtlas backend."""

CANCER_LABELS = {
    "Breast Invasive Carcinoma": {
        "code": "BRCA",
        "full": "Breast Invasive Carcinoma",
        "site": "Breast",
    },
    "Colon Adenocarcinoma": {
        "code": "COAD",
        "full": "Colon Adenocarcinoma",
        "site": "Colon",
    },
    "Kidney Clear Cell Carcinoma": {
        "code": "KIRC",
        "full": "Kidney Renal Clear Cell Carcinoma",
        "site": "Kidney",
    },
    "Lung Adenocarcinoma": {
        "code": "LUAD",
        "full": "Lung Adenocarcinoma",
        "site": "Lung",
    },
    "Prostate Adenocarcinoma": {
        "code": "PRAD",
        "full": "Prostate Adenocarcinoma",
        "site": "Prostate",
    },
}

CODE_TO_LABEL = {v["code"]: k for k, v in CANCER_LABELS.items()}

CLINICAL_GUIDANCE = {
    "Breast Invasive Carcinoma": {
        "recommended_tests": [
            "ER/PR immunohistochemistry",
            "HER2 (ERBB2) amplification testing",
            "Ki-67 proliferation index",
        ],
        "therapeutic_targets": ["ERBB2", "ESR1", "CDK4/6 pathway"],
        "standard_of_care": "Subtype-guided endocrine therapy, anti-HER2 therapy, or chemotherapy based on receptor status.",
        "follow_up": "Confirmatory histopathology and receptor panel before treatment decisions.",
    },
    "Kidney Clear Cell Carcinoma": {
        "recommended_tests": [
            "VHL pathway assessment",
            "CA9 (carbonic anhydrase IX) IHC",
            "Staging imaging (CT/MRI)",
        ],
        "therapeutic_targets": ["VEGF", "mTOR", "HIF pathway"],
        "standard_of_care": "Surgical resection for localized disease; VEGF/IO combinations for advanced RCC.",
        "follow_up": "Validate with radiology and histology; assess IMDC risk group.",
    },
    "Lung Adenocarcinoma": {
        "recommended_tests": [
            "EGFR mutation testing",
            "ALK/ROS1 fusion testing",
            "PD-L1 expression",
            "KRAS status if EGFR/ALK negative",
        ],
        "therapeutic_targets": ["EGFR", "ALK", "KRAS G12C", "MET"],
        "standard_of_care": "Molecular profiling drives TKI or immunotherapy selection in advanced disease.",
        "follow_up": "Never treat on expression alone — confirm driver mutations.",
    },
    "Prostate Adenocarcinoma": {
        "recommended_tests": [
            "PSA trend and Gleason grade",
            "AR signalling assessment",
            "TMPRSS2-ERG fusion (where indicated)",
        ],
        "therapeutic_targets": ["AR", "PARP (HRR-deficient)", "PSMA-directed therapy"],
        "standard_of_care": "Risk-stratified active surveillance, ADT, or multimodal therapy.",
        "follow_up": "Integrate PSA, grade group, and staging before systemic therapy.",
    },
    "Colon Adenocarcinoma": {
        "recommended_tests": [
            "MSI/MMR status",
            "KRAS/NRAS/BRAF mutation panel",
            "CEA baseline",
        ],
        "therapeutic_targets": ["EGFR (RAS wild-type)", "BRAF V600E", "MSI-high → immunotherapy"],
        "standard_of_care": "Stage-dependent surgery ± adjuvant chemo; molecular profile guides metastatic therapy.",
        "follow_up": "Confirm MSS/MSI and RAS status before anti-EGFR therapy.",
    },
}

UNCERTAINTY_THRESHOLDS = {
    "high": 0.75,
    "moderate": 0.55,
}
