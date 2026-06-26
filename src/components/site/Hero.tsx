import {
  Github,
  FileText,
  Database,
  BrainCircuit,
} from "lucide-react";

import { Helix } from "./Helix";

const subtypes = [
  { code: "BRCA", name: "Breast Invasive Carcinoma", n: 300 },
  { code: "KIRC", name: "Kidney Renal Clear Cell", n: 146 },
  { code: "COAD", name: "Colon Adenocarcinoma", n: 78 },
  { code: "LUAD", name: "Lung Adenocarcinoma", n: 141 },
  { code: "PRAD", name: "Prostate Adenocarcinoma", n: 136 },
];

const stats = [
  { v: "881", l: "TCGA Samples" },
  { v: "20,531", l: "Gene Features" },
  { v: "96.8%", l: "Test Accuracy" },
  { v: "0.98", l: "Macro ROC-AUC" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="grain absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12 md:py-28">

        {/* Left Column */}
        <div className="md:col-span-7">

          <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-foreground/40" />
            Biomedical AI · TCGA Pan-Cancer · SRMIST
          </div>

          <h1 className="font-display text-5xl leading-[1.02] text-primary md:text-7xl lg:text-8xl">
            Reading <em className="italic text-[color:var(--rust)]">cancer</em>
            <br />
            in the <em className="italic">genome.</em>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            GeneAtlas is an explainable AI platform for pan-cancer
            classification from bulk RNA-seq expression. By combining an
            attention-based neural network with SHAP explainability, it
            identifies clinically relevant biomarkers while providing
            transparent, interpretable predictions across multiple TCGA cancer
            subtypes.
          </p>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/Tanishkaaa016/Geneatlas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-accent"
            >
              <Github size={16} />
              GitHub
            </a>

            <a
              href="#references"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-accent"
            >
              <FileText size={16} />
              Research
            </a>

            <a
              href="#dataset"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-accent"
            >
              <Database size={16} />
              TCGA Dataset
            </a>

            <a
              href="#methodology"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:bg-accent"
            >
              <BrainCircuit size={16} />
              AI Model
            </a>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/demo"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Launch GeneAtlas AI →
            </a>

            <a
              href="#methodology"
              className="rounded-full border border-primary/30 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              How it works
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </dt>

                <dd className="mt-1 font-display text-3xl text-primary">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>

        </div>

        {/* Right Column */}
        <div className="relative md:col-span-5">
          <div className="relative mx-auto aspect-[1/2] max-h-[560px] w-full max-w-[280px]">
            <Helix />
          </div>

          <ul className="mt-6 space-y-2">
            {subtypes.map((s, i) => (
              <li
                key={s.code}
                className="flex items-center justify-between border-b border-border/60 py-2 text-sm animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-mono text-xs tracking-wider text-[color:var(--rust)]">
                  {s.code}
                </span>

                <span className="flex-1 px-3 text-foreground">
                  {s.name}
                </span>

                <span className="font-mono text-xs text-muted-foreground">
                  n={s.n}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}

