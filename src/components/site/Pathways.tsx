import { SectionHead } from "./Dataset";

type Row = { pathway: string; source: "HALLMARK" | "KEGG" | "REACTOME"; nes: number; q: string };
type Subtype = { code: string; full: string; rows: Row[] };

const enrich: Subtype[] = [
  {
    code: "BRCA",
    full: "Breast Invasive Carcinoma",
    rows: [
      { pathway: "Estrogen response (early)", source: "HALLMARK", nes: 3.41, q: "<1e-10" },
      { pathway: "Estrogen response (late)", source: "HALLMARK", nes: 3.12, q: "<1e-10" },
      { pathway: "ERBB / HER2 signalling", source: "KEGG", nes: 2.48, q: "2.1e-7" },
      { pathway: "E2F targets (proliferation)", source: "HALLMARK", nes: 2.30, q: "5.4e-7" },
      { pathway: "DNA repair (homologous recomb.)", source: "REACTOME", nes: 1.88, q: "3.2e-5" },
    ],
  },
  {
    code: "KIRC",
    full: "Kidney Renal Clear Cell",
    rows: [
      { pathway: "Hypoxia (HIF1α / HIF2α targets)", source: "HALLMARK", nes: 3.62, q: "<1e-10" },
      { pathway: "Glycolysis (Warburg)", source: "HALLMARK", nes: 2.91, q: "<1e-9" },
      { pathway: "VEGF / angiogenesis", source: "KEGG", nes: 2.74, q: "1.4e-8" },
      { pathway: "Fatty-acid metabolism", source: "REACTOME", nes: 2.15, q: "8.7e-6" },
      { pathway: "PI3K-AKT-mTOR", source: "KEGG", nes: 1.92, q: "4.1e-5" },
    ],
  },
  {
    code: "LUAD",
    full: "Lung Adenocarcinoma",
    rows: [
      { pathway: "KRAS signalling (up)", source: "HALLMARK", nes: 3.18, q: "<1e-10" },
      { pathway: "Surfactant metabolism", source: "REACTOME", nes: 2.84, q: "<1e-9" },
      { pathway: "MAPK cascade", source: "KEGG", nes: 2.41, q: "6.5e-8" },
      { pathway: "EMT", source: "HALLMARK", nes: 2.05, q: "2.2e-6" },
      { pathway: "NRF2 / xenobiotic response", source: "REACTOME", nes: 1.79, q: "1.1e-4" },
    ],
  },
  {
    code: "PRAD",
    full: "Prostate Adenocarcinoma",
    rows: [
      { pathway: "Androgen response", source: "HALLMARK", nes: 3.78, q: "<1e-10" },
      { pathway: "Kallikrein cascade (KLK family)", source: "REACTOME", nes: 2.62, q: "<1e-8" },
      { pathway: "TMPRSS2-ERG transcriptional output", source: "REACTOME", nes: 2.34, q: "3.8e-7" },
      { pathway: "PTEN / PI3K loss signature", source: "KEGG", nes: 1.96, q: "1.7e-5" },
      { pathway: "Mitotic spindle", source: "HALLMARK", nes: 1.71, q: "2.4e-4" },
    ],
  },
  {
    code: "COAD",
    full: "Colon Adenocarcinoma",
    rows: [
      { pathway: "Wnt / β-catenin (APC loss)", source: "HALLMARK", nes: 3.51, q: "<1e-10" },
      { pathway: "Intestinal absorption / brush border", source: "REACTOME", nes: 2.79, q: "<1e-8" },
      { pathway: "MYC targets", source: "HALLMARK", nes: 2.46, q: "5.1e-8" },
      { pathway: "Mismatch repair (MSI subset)", source: "KEGG", nes: 2.08, q: "1.9e-6" },
      { pathway: "TGF-β signalling", source: "HALLMARK", nes: 1.84, q: "7.7e-5" },
    ],
  },
];

const maxNES = Math.max(...enrich.flatMap((s) => s.rows.map((r) => r.nes)));

export function Pathways() {
  return (
    <section id="pathways" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="05"
          kicker="Pathway enrichment"
          title="From single genes to biological programs."
        />
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Per-subtype SHAP attributions were aggregated to gene sets and tested
          with pre-ranked GSEA against MSigDB Hallmark, KEGG, and Reactome. The
          enriched programs recapitulate the canonical biology of each cancer —
          confirming the model learned mechanism, not shortcut.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {enrich.map((s) => (
            <div key={s.code} className="rounded-md border border-border bg-card p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-display text-xl text-primary">{s.code}</h3>
                <span className="text-xs text-muted-foreground">{s.full}</span>
              </div>
              <ul className="space-y-3">
                {s.rows.map((r) => (
                  <li key={r.pathway}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="truncate text-foreground">{r.pathway}</span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        NES {r.nes.toFixed(2)} · q {r.q}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(r.nes / maxNES) * 100}%`,
                            background: "var(--forest)",
                          }}
                        />
                      </div>
                      <span className="w-20 text-right font-mono text-[10px] uppercase tracking-wider text-[color:var(--rust)]">
                        {r.source}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs text-muted-foreground">
          Methodology: SHAP gene attributions ranked per subtype, fed to{" "}
          <span className="font-mono">fgsea</span> (10K permutations) against
          MSigDB v7.5. NES = normalized enrichment score; q = BH-adjusted FDR.
          Only programs with |NES| &gt; 1.5 and q &lt; 1e-3 shown.
        </p>
      </div>
    </section>
  );
}
