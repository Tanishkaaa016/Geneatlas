import { useState } from "react";
import { SectionHead } from "./Dataset";
import biomarkerData from "@/data/biomarkers.json";
import type { BiomarkerAtlas } from "@/lib/types";

const atlas = biomarkerData as BiomarkerAtlas;

const colors: Record<string, string> = {
  BRCA: "oklch(0.28 0.05 155)",
  KIRC: "oklch(0.45 0.08 150)",
  LUAD: "oklch(0.58 0.14 40)",
  PRAD: "oklch(0.42 0.06 280)",
  COAD: "oklch(0.52 0.10 55)",
};

export function Biomarkers() {
  const codes = Object.keys(atlas);
  const [active, setActive] = useState(codes[0] ?? "BRCA");
  const data = atlas[active];
  const maxShap = Math.max(...data.genes.map((gene) => gene.shap), 1);

  return (
    <section id="biomarkers" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead num="04" kicker="Biomarkers" title="Which genes define each subtype?" />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Top discriminating genes per cancer type, exported from the training cohort using
          class-specific mean expression ranking. Live predictions use per-sample SHAP attributions.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {codes.map((code) => (
            <button
              key={code}
              onClick={() => setActive(code)}
              className="rounded-full border px-4 py-1.5 text-sm font-mono transition"
              style={{
                background: active === code ? colors[code] : "transparent",
                borderColor: active === code ? colors[code] : "var(--color-border)",
                color: active === code ? "var(--cream)" : "var(--foreground)",
              }}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="mt-2 text-xs text-muted-foreground">{data.full}</div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.genes.map((gene, index) => (
            <li
              key={gene.symbol}
              className="animate-fade-up rounded-md border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <a
                href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.symbol}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl text-primary">{gene.symbol}</span>
                  <span className="font-mono text-xs text-[color:var(--rust)]">
                    {gene.shap.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(gene.shap / maxShap) * 100}%`,
                      background: colors[active],
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {gene.note ?? "Discriminating gene for this subtype"}
                </p>
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
