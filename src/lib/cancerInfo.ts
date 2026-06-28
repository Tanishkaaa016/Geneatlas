export const cancerInfo: Record<
  string,
  {
    description: string;
    biomarkers: string[];
    tcgaSamples: number;
  }
> = {
  "Kidney Clear Cell Carcinoma": {
    description:
      "The most common subtype of kidney cancer, arising from the renal cortex. It is frequently associated with alterations in the VHL pathway and hypoxia signaling.",

    biomarkers: [
      "VHL",
      "CA9",
      "PAX8",
      "KDR",
      "VEGFA",
    ],

    tcgaSamples: 603,
  },

  "Breast Invasive Carcinoma": {
    description:
      "The most common type of breast cancer, originating from the breast ducts or lobules.",

    biomarkers: [
      "ERBB2",
      "ESR1",
      "PGR",
      "GATA3",
      "FOXA1",
    ],

    tcgaSamples: 1212,
  },

  "Lung Adenocarcinoma": {
    description:
      "The most common non-small cell lung cancer subtype, often associated with EGFR and KRAS mutations.",

    biomarkers: [
      "EGFR",
      "KRAS",
      "ALK",
      "MET",
      "ROS1",
    ],

    tcgaSamples: 574,
  },

  "Colon Adenocarcinoma": {
    description:
      "A malignant epithelial tumor originating in the colon, commonly involving APC and KRAS pathways.",

    biomarkers: [
      "APC",
      "KRAS",
      "TP53",
      "SMAD4",
      "PIK3CA",
    ],

    tcgaSamples: 331,
  },

  "Prostate Adenocarcinoma": {
    description:
      "The most common prostate malignancy, often characterized by androgen receptor signaling.",

    biomarkers: [
      "AR",
      "TMPRSS2",
      "ERG",
      "PTEN",
      "NKX3-1",
    ],

    tcgaSamples: 548,
  },
};