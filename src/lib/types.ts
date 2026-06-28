export type BiomarkerGene = {
  symbol: string;
  ensembl?: string;
  shap: number;
  note?: string;
};

export type BiomarkerAtlas = Record<
  string,
  {
    code: string;
    full: string;
    genes: BiomarkerGene[];
  }
>;

export type PathwayRow = {
  pathway: string;
  source: string;
  nes: number;
  q: string;
  overlap_genes?: string[];
};

export type PathwaySubtype = {
  code: string;
  full: string;
  rows: PathwayRow[];
};

export type PerClassMetric = {
  label: string;
  code: string;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  support: number;
};

export type MetricsPayload = {
  dataset: {
    samples: number;
    features: number;
    classes: string[];
    test_size: number;
  };
  model: {
    architecture: string;
    framework: string;
    feature_selection: string;
  };
  evaluation: {
    accuracy: number;
    macro_f1: number;
    confusion_matrix: number[][];
    class_codes: string[];
    class_labels: string[];
    per_class: PerClassMetric[];
  };
  baselines: { model: string; accuracy: number; f1: number }[];
  calibration: {
    bin: string;
    confidence: number;
    accuracy: number;
    count: number;
  }[];
};

export type SurvivalCurve = {
  code: string;
  label: string;
  median_months: number;
  five_year_survival: number;
  points: { months: number; survival: number }[];
};

export type SurvivalPayload = {
  disclaimer: string;
  source: string;
  curves: SurvivalCurve[];
};

export type ClinicalContext = {
  code: string;
  label: string;
  confidence: number;
  entropy: number;
  uncertainty_level: "high" | "moderate" | "low";
  uncertainty_message: string;
  recommended_tests: string[];
  therapeutic_targets: string[];
  standard_of_care: string;
  follow_up: string;
  disclaimer: string;
};

export type PredictionResult = {
  prediction: string;
  code?: string;
  confidence: number;
  entropy?: number;
  probabilities: Record<string, number>;
  probabilities_by_code?: Record<string, number>;
  biomarkers?: { gene: string; importance: number; shap?: number }[];
  clinical?: ClinicalContext;
  error?: string;
};
