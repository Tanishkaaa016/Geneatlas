import { SectionHead } from "./Dataset";

const hallmarks = [
  { h: "Sustained proliferation", g: "MYC, CCND1, MKI67, E2F1", note: "Cell-cycle entry independent of mitogenic cues." },
  { h: "Evading growth suppressors", g: "TP53, RB1, CDKN2A", note: "Loss of checkpoint enforcement at G1/S." },
  { h: "Replicative immortality", g: "TERT, TERC", note: "Telomerase reactivation bypasses Hayflick limit." },
  { h: "Activating invasion / metastasis", g: "SNAI1, ZEB1, VIM, MMP9", note: "EMT program; basement-membrane breach." },
  { h: "Inducing angiogenesis", g: "VEGFA, ANGPT2, HIF1A", note: "Neovascular sprouting under hypoxia." },
  { h: "Resisting cell death", g: "BCL2, MCL1, BIRC5", note: "Mitochondrial apoptosis blockade." },
  { h: "Deregulated metabolism", g: "HK2, LDHA, PKM, SLC2A1", note: "Warburg-style aerobic glycolysis." },
  { h: "Immune evasion", g: "CD274 (PD-L1), IDO1, FOXP3", note: "Checkpoint engagement, Treg recruitment." },
];

const subtypes = [
  {
    code: "BRCA",
    name: "Breast Invasive Carcinoma",
    incidence: "2.3M new cases / yr (global)",
    survival: "5-yr OS ≈ 90% (localized)",
    drivers: "ER/PR/HER2 status · PIK3CA · TP53 · BRCA1/2",
    care: "Endocrine therapy · anti-HER2 (trastuzumab) · CDK4/6 inhibitors",
    bio: "Hormone-driven luminal program (ESR1, FOXA1, GATA3) vs. basal-like TP53-mutant tumours with proliferative signature.",
  },
  {
    code: "KIRC",
    name: "Kidney Renal Clear Cell",
    incidence: "430K new cases / yr",
    survival: "5-yr OS ≈ 75% (localized) · 14% (metastatic)",
    drivers: "VHL loss (>90%) · PBRM1 · BAP1 · SETD2",
    care: "VEGFR-TKIs (sunitinib, cabozantinib) · anti-PD-1 + anti-CTLA-4",
    bio: "VHL inactivation stabilizes HIF1α/HIF2α → constitutive hypoxia response (CA9, VEGFA, GLUT1) even in normoxia.",
  },
  {
    code: "LUAD",
    name: "Lung Adenocarcinoma",
    incidence: "1.6M deaths / yr (all lung)",
    survival: "5-yr OS ≈ 65% (stage I) · <10% (stage IV)",
    drivers: "KRAS (~30%) · EGFR (~15%) · ALK / ROS1 fusions · STK11 · KEAP1",
    care: "EGFR-TKIs (osimertinib) · ALK inhibitors · KRAS G12C (sotorasib) · IO",
    bio: "Alveolar lineage (NKX2-1/TTF1, SFTPC). KRAS/STK11 co-mutation defines immune-cold subset resistant to checkpoint blockade.",
  },
  {
    code: "PRAD",
    name: "Prostate Adenocarcinoma",
    incidence: "1.4M new cases / yr",
    survival: "5-yr OS ≈ 99% (localized) · 32% (metastatic)",
    drivers: "TMPRSS2-ERG fusion (~50%) · AR amplification · PTEN loss · SPOP",
    care: "Androgen-deprivation therapy · AR antagonists (enzalutamide) · PARPi (BRCA-mut)",
    bio: "Androgen-receptor signalling is the master regulator; KLK3 (PSA) is the canonical AR-output biomarker.",
  },
  {
    code: "COAD",
    name: "Colon Adenocarcinoma",
    incidence: "1.9M new cases / yr",
    survival: "5-yr OS ≈ 91% (localized) · 14% (metastatic)",
    drivers: "APC (>80%) · KRAS · TP53 · MSI / MLH1-silenced subset",
    care: "FOLFOX / FOLFIRI · anti-EGFR (cetuximab, RAS-wt only) · IO for MSI-high",
    bio: "Vogelstein adenoma-carcinoma sequence: APC → KRAS → TP53. MSI-high CMS1 tumours are hypermutated and IO-responsive.",
  },
];

export function Biology() {
  return (
    <section id="biology" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="00"
          kicker="Cancer biology"
          title="Why the transcriptome carries a subtype fingerprint."
        />
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Cancer is fundamentally a disease of dysregulated gene expression. Driver
          mutations rewire transcriptional programs, and the resulting mRNA
          abundance pattern — the transcriptome — encodes both tissue of origin and
          oncogenic state. Bulk RNA-Seq captures this signal at ~20K-gene
          resolution, and supervised learning can recover subtype identity with
          near-pathology-grade accuracy.
        </p>

        {/* Hallmarks grid */}
        <div className="mt-12">
          <h3 className="font-display text-2xl text-primary">
            Hallmarks of cancer — and the genes that read them out
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Hanahan &amp; Weinberg's eight functional capabilities, each detectable
            as a coordinated shift in transcript abundance.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {hallmarks.map((h) => (
              <div key={h.h} className="bg-card p-5">
                <div className="font-display text-lg leading-tight text-primary">
                  {h.h}
                </div>
                <div className="mt-2 font-mono text-[11px] text-[color:var(--rust)]">
                  {h.g}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{h.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical context per subtype */}
        <div className="mt-16">
          <h3 className="font-display text-2xl text-primary">
            Clinical &amp; molecular profile of each subtype
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            What the model is actually distinguishing — beyond a label.
          </p>
          <div className="mt-6 space-y-4">
            {subtypes.map((s) => (
              <article
                key={s.code}
                className="grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-6 md:grid-cols-12"
              >
                <div className="md:col-span-3">
                  <div className="font-mono text-xs text-[color:var(--rust)]">
                    {s.code}
                  </div>
                  <div className="mt-1 font-display text-xl text-primary">
                    {s.name}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {s.incidence}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.survival}
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-3 text-sm md:col-span-9 md:grid-cols-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Key drivers
                    </dt>
                    <dd className="mt-1 font-mono text-xs">{s.drivers}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Standard of care
                    </dt>
                    <dd className="mt-1 text-xs">{s.care}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Transcriptomic signature
                    </dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{s.bio}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        {/* Why ML works on RNA */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              t: "Lineage-resolved",
              d: "Tissue-specific transcription factors (NKX2-1, CDX2, AR, GATA3) act as near-binary identity switches — recoverable even from low-depth bulk profiles.",
            },
            {
              t: "Driver-coupled",
              d: "Oncogenic mutations propagate into downstream expression programs (e.g. VHL loss → HIF targets), so the readout indirectly reports on the mutational state.",
            },
            {
              t: "High-dimensional but low-rank",
              d: "Of 20K measured genes, the subtype-relevant variance concentrates in <200 PCs — exactly the regime where regularized neural nets outperform classical baselines.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-md border border-border bg-card p-5">
              <h4 className="font-display text-lg text-primary">{c.t}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
