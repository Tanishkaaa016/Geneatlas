import { SectionHead } from "./Dataset";

const limitations = [
  "Trained on bulk RNA-Seq — does not resolve tumour heterogeneity or single-cell signal.",
  "5 subtypes only; pan-cancer extension requires retraining on the full 33-cohort TCGA set.",
  "Demo endpoint runs on Render's free tier — cold starts and model-load failures are possible.",
  "SHAP attributions are correlational, not causal; biomarkers should be validated experimentally.",
  "No external validation cohort yet (e.g. ICGC, GTEx tumour-adjacent). Generalization is unverified.",
];

const refs = [
  {
    t: "The Cancer Genome Atlas Research Network — Pan-Cancer Atlas",
    a: "TCGA, 2018",
    href: "https://www.cell.com/pb-assets/consortium/pancanceratlas/pancani3/index.html",
  },
  {
    t: "Attention Is All You Need",
    a: "Vaswani et al., NeurIPS 2017",
    href: "https://arxiv.org/abs/1706.03762",
  },
  {
    t: "A Unified Approach to Interpreting Model Predictions (SHAP)",
    a: "Lundberg & Lee, NeurIPS 2017",
    href: "https://arxiv.org/abs/1705.07874",
  },
  {
    t: "Deep learning for cancer type classification from gene expression data",
    a: "Lyu & Haque, ACM-BCB 2018",
    href: "https://doi.org/10.1145/3233547.3233588",
  },
  {
    t: "GeneCards — the human gene database",
    a: "Weizmann Institute",
    href: "https://www.genecards.org",
  },
  {
    t: "Source code — Tanishkaaa016 / Geneatlas",
    a: "GitHub",
    href: "https://github.com/Tanishkaaa016/Geneatlas",
  },
];

export function References() {
  return (
    <section id="references" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead num="06" kicker="Scope · Citations" title="Honest limits, primary sources." />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl text-primary">Limitations</h3>
            <ul className="mt-4 space-y-3">
              {limitations.map((l, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-mono text-xs text-[color:var(--rust)]">
                    0{i + 1}
                  </span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-2xl text-primary">References</h3>
            <ul className="mt-4 divide-y divide-border">
              {refs.map((r) => (
                <li key={r.t} className="py-3">
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <span className="text-sm text-foreground group-hover:text-primary">
                      {r.t}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {r.a} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
