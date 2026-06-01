import { useState } from "react";
import { SectionHead } from "./Dataset";

type Gene = { symbol: string; shap: number; note: string };
type Atlas = Record<string, { color: string; full: string; genes: Gene[] }>;

const atlas: Atlas = {
  BRCA: {
    color: "oklch(0.28 0.05 155)",
    full: "Breast Invasive Carcinoma",
    genes: [
      { symbol: "ESR1", shap: 0.92, note: "Estrogen receptor, luminal driver" },
      { symbol: "ERBB2", shap: 0.81, note: "HER2 amplification target" },
      { symbol: "GATA3", shap: 0.74, note: "Luminal differentiation TF" },
      { symbol: "FOXA1", shap: 0.68, note: "Pioneer factor co-regulates ESR1" },
      { symbol: "PGR", shap: 0.61, note: "Progesterone receptor" },
      { symbol: "BRCA1", shap: 0.55, note: "DNA-damage repair, hereditary risk" },
      { symbol: "TP53", shap: 0.47, note: "Tumor suppressor, basal-like" },
      { symbol: "MKI67", shap: 0.44, note: "Proliferation marker" },
    ],
  },
  KIRC: {
    color: "oklch(0.45 0.08 150)",
    full: "Kidney Renal Clear Cell",
    genes: [
      { symbol: "VHL", shap: 0.95, note: "Inactivated → HIF stabilization" },
      { symbol: "CA9", shap: 0.88, note: "Hypoxia marker, near-pathognomonic" },
      { symbol: "PBRM1", shap: 0.72, note: "SWI/SNF chromatin remodeler" },
      { symbol: "BAP1", shap: 0.66, note: "Aggressive subtype marker" },
      { symbol: "SETD2", shap: 0.59, note: "H3K36 methyltransferase" },
      { symbol: "NDUFA4L2", shap: 0.55, note: "HIF target, mitochondrial" },
      { symbol: "EGLN3", shap: 0.48, note: "HIF prolyl hydroxylase" },
      { symbol: "ANGPTL4", shap: 0.43, note: "Angiogenesis driver" },
    ],
  },
  LUAD: {
    color: "oklch(0.58 0.14 40)",
    full: "Lung Adenocarcinoma",
    genes: [
      { symbol: "EGFR", shap: 0.9, note: "Targetable kinase, TKI-sensitive" },
      { symbol: "KRAS", shap: 0.83, note: "Most common driver mutation" },
      { symbol: "TTF1", shap: 0.75, note: "NKX2-1, lineage marker" },
      { symbol: "ALK", shap: 0.62, note: "Fusion partner, crizotinib target" },
      { symbol: "SFTPC", shap: 0.58, note: "Surfactant, alveolar identity" },
      { symbol: "NAPSA", shap: 0.52, note: "Adenocarcinoma marker" },
      { symbol: "STK11", shap: 0.46, note: "Tumor suppressor, immune-cold" },
      { symbol: "KEAP1", shap: 0.41, note: "NRF2 pathway, chemoresistance" },
    ],
  },
  PRAD: {
    color: "oklch(0.72 0.12 75)",
    full: "Prostate Adenocarcinoma",
    genes: [
      { symbol: "AR", shap: 0.93, note: "Androgen receptor, master driver" },
      { symbol: "KLK3", shap: 0.86, note: "PSA, clinical biomarker" },
      { symbol: "TMPRSS2", shap: 0.78, note: "ERG fusion partner" },
      { symbol: "ERG", shap: 0.71, note: "Fusion oncogene, ~50% cases" },
      { symbol: "FOXA1", shap: 0.62, note: "AR cofactor" },
      { symbol: "NKX3-1", shap: 0.57, note: "Prostate lineage TF" },
      { symbol: "PTEN", shap: 0.5, note: "Tumor suppressor, often deleted" },
      { symbol: "SPDEF", shap: 0.44, note: "Luminal differentiation" },
    ],
  },
  COAD: {
    color: "oklch(0.55 0.1 200)",
    full: "Colon Adenocarcinoma",
    genes: [
      { symbol: "APC", shap: 0.89, note: "Wnt gatekeeper, earliest hit" },
      { symbol: "CDX2", shap: 0.82, note: "Intestinal lineage TF" },
      { symbol: "KRAS", shap: 0.74, note: "Driver, anti-EGFR resistance" },
      { symbol: "MUC2", shap: 0.66, note: "Goblet cell mucin" },
      { symbol: "VIL1", shap: 0.6, note: "Villin, brush border" },
      { symbol: "MLH1", shap: 0.52, note: "Mismatch repair, MSI subtype" },
      { symbol: "BRAF", shap: 0.46, note: "V600E in serrated pathway" },
      { symbol: "AXIN2", shap: 0.41, note: "Wnt target, feedback marker" },
    ],
  },
};

export function Biomarkers() {
  const [active, setActive] = useState<keyof typeof atlas>("BRCA");
  const data = atlas[active];

  return (
    <section id="biomarkers" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="04"
          kicker="Biomarkers"
          title="Which genes drove each call?"
        />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          SHAP values back-projected through the PCA basis surface the genes the
          model relied on per subtype. Every symbol links to GeneCards for
          functional annotation.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {Object.entries(atlas).map(([code, d]) => (
            <button
              key={code}
              onClick={() => setActive(code as keyof typeof atlas)}
              className="rounded-full border px-4 py-1.5 text-sm font-mono transition"
              style={{
                background: active === code ? d.color : "transparent",
                borderColor: active === code ? d.color : "var(--color-border)",
                color: active === code ? "var(--cream)" : "var(--foreground)",
              }}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="mt-2 text-xs text-muted-foreground">{data.full}</div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.genes.map((g, i) => (
            <li
              key={g.symbol}
              className="animate-fade-up rounded-md border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <a
                href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${g.symbol}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl text-primary">{g.symbol}</span>
                  <span className="font-mono text-xs text-[color:var(--rust)]">
                    φ {g.shap.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${g.shap * 100}%`, background: data.color }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{g.note}</p>
                <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  GeneCards ↗
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
