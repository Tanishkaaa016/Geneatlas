import { SectionHead } from "./Dataset";
import pathwayData from "@/data/pathways.json";
import type { PathwaySubtype } from "@/lib/types";

const enrich = pathwayData as PathwaySubtype[];
const maxNES = Math.max(...enrich.flatMap((subtype) => subtype.rows.map((row) => row.nes)), 1);

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
          Subtype biomarkers were tested against curated MSigDB Hallmark gene sets using
          hypergeometric enrichment. Pathways with gene overlap from the exported biomarker panel
          are shown below.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {enrich.map((subtype) => (
            <div key={subtype.code} className="rounded-md border border-border bg-card p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-display text-xl text-primary">{subtype.code}</h3>
                <span className="text-xs text-muted-foreground">{subtype.full}</span>
              </div>

              {subtype.rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No significant Hallmark overlap at current threshold — expand biomarker panel or
                  re-run enrichment after SHAP aggregation.
                </p>
              ) : (
                <ul className="space-y-3">
                  {subtype.rows.map((row) => (
                    <li key={row.pathway}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate text-foreground">{row.pathway}</span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          NES {row.nes.toFixed(2)} · q {row.q}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(row.nes / maxNES) * 100}%`,
                              background: "var(--forest)",
                            }}
                          />
                        </div>
                        <span className="w-20 text-right font-mono text-[10px] uppercase tracking-wider text-[color:var(--rust)]">
                          {row.source}
                        </span>
                      </div>
                      {row.overlap_genes && row.overlap_genes.length > 0 && (
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                          overlap: {row.overlap_genes.join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
