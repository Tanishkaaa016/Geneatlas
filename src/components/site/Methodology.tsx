import { SectionHead } from "./Dataset";

const steps = [
  { n: "01", t: "Acquire", d: "TCGA RNA-Seq counts (HTSeq) via GDC API for 5 pan-cancer subtypes." },
  { n: "02", t: "Filter", d: "Low-expression gene removal, log₂(RPKM+1) normalization." },
  { n: "03", t: "Select", d: "Top 5000 most variable genes retained as model input panel." },
  { n: "04", t: "Split", d: "Stratified 80/20 train/test split (random_state=42)." },
  { n: "05", t: "Train", d: "TensorFlow/Keras MLP with batch norm, dropout, early stopping." },
  { n: "06", t: "Explain", d: "DeepSHAP per-prediction attributions mapped to gene symbols." },
];

const protocol = [
  ["Architecture", "Input(5000) → Dense(1024) → BN → Dropout → Dense(512) → BN → Dropout → Dense(256) → Softmax(5)"],
  ["Loss", "Sparse categorical cross-entropy"],
  ["Optimizer", "Adam, lr=1e-3"],
  ["Regularization", "Dropout 0.2–0.4, early stopping (patience=10)"],
  ["Features", "5000 Ensembl genes (variance-ranked)"],
  ["Explainability", "SHAP DeepExplainer, 100-sample background"],
  ["Framework", "TensorFlow/Keras · scikit-learn · SHAP"],
];

export function Methodology() {
  return (
    <section id="methodology" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead num="02" kicker="Methodology" title="From raw counts to interpretable subtype calls." />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="bg-card p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[color:var(--rust)]">{step.n}</span>
                <h3 className="font-display text-2xl text-primary">{step.t}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{step.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-md border border-border bg-card p-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-display text-2xl text-primary">Architecture</h3>
            <span className="font-mono text-xs text-muted-foreground">TensorFlow Sequential</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {[
              { l: "RNA-Seq", s: "5000 genes" },
              { l: "Dense", s: "1024 + ReLU" },
              { l: "Dense", s: "512 + ReLU" },
              { l: "Dense", s: "256 + ReLU" },
              { l: "Softmax", s: "5 classes" },
            ].map((block, index, blocks) => (
              <div key={block.l} className="flex items-center">
                <div className="rounded-md border border-primary/30 bg-background px-4 py-3 text-center">
                  <div className="font-display text-base text-primary">{block.l}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {block.s}
                  </div>
                </div>
                {index < blocks.length - 1 && (
                  <span className="px-2 text-[color:var(--rust)]">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-display text-2xl text-primary">Training protocol</h3>
          </div>
          <dl className="divide-y divide-border">
            {protocol.map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{key}</dt>
                <dd className="font-mono text-sm sm:col-span-3">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
