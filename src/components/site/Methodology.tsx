import { SectionHead } from "./Dataset";

const steps = [
  { n: "01", t: "Acquire", d: "TCGA RNA-Seq counts (HTSeq) pulled via GDC API for 5 subtypes." },
  { n: "02", t: "Normalize", d: "Filter low-expression genes, apply log₂(RPKM+1)." },
  { n: "03", t: "Reduce", d: "PCA to 128 components — retains 92% variance, kills curse-of-dim." },
  { n: "04", t: "Split", d: "Stratified 70/15/15 train/val/test, class-weighted sampler." },
  { n: "05", t: "Train", d: "MLP + multi-head attention pooling, AdamW, cosine LR, 80 epochs." },
  { n: "06", t: "Explain", d: "DeepSHAP back-projected through PCA basis → per-gene attributions." },
];

const protocol = [
  ["Architecture", "PCA(128) → Linear(256) → Attn-pool(4 heads) → Linear(128) → Softmax(5)"],
  ["Loss", "Class-weighted cross-entropy (inverse frequency)"],
  ["Optimizer", "AdamW, lr=3e-4, weight-decay=1e-4"],
  ["Schedule", "Cosine annealing, warmup 5 epochs, 80 total"],
  ["Regularization", "Dropout 0.3, label smoothing 0.05"],
  ["Hardware", "NVIDIA T4 · ~12 min/run"],
  ["Framework", "PyTorch 2.2 · scikit-learn 1.4 · SHAP 0.45"],
];

export function Methodology() {
  return (
    <section id="methodology" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead num="02" kicker="Methodology" title="From raw counts to interpretable subtype calls." />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[color:var(--rust)]">{s.n}</span>
                <h3 className="font-display text-2xl text-primary">{s.t}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-12 overflow-hidden rounded-md border border-border bg-card p-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-display text-2xl text-primary">Architecture</h3>
            <span className="font-mono text-xs text-muted-foreground">PyTorch nn.Module</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {[
              { l: "RNA-Seq", s: "20,531 genes" },
              { l: "PCA", s: "→ 128 dims" },
              { l: "Linear + GELU", s: "256" },
              { l: "Attention", s: "4 heads" },
              { l: "Linear", s: "128" },
              { l: "Softmax", s: "5 classes" },
            ].map((b, i, arr) => (
              <div key={b.l} className="flex items-center">
                <div className="rounded-md border border-primary/30 bg-background px-4 py-3 text-center">
                  <div className="font-display text-base text-primary">{b.l}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {b.s}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <span className="px-2 text-[color:var(--rust)]">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Training protocol */}
        <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-display text-2xl text-primary">Training protocol</h3>
          </div>
          <dl className="divide-y divide-border">
            {protocol.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="font-mono text-sm sm:col-span-3">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
