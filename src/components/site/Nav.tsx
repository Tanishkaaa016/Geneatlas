const links = [
  { href: "#biology", label: "Biology" },
  { href: "#dataset", label: "Dataset" },
  { href: "#methodology", label: "Methodology" },
  { href: "#results", label: "Results" },
  { href: "#biomarkers", label: "Biomarkers" },
  { href: "#pathways", label: "Pathways" },
  { href: "#survival", label: "Survival" },
  { href: "#classifier", label: "Classifier" },
];


export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <a href="#top" className="flex items-center gap-2 font-display text-xl text-primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4c4 4 12 12 16 16M4 20c4-4 12-12 16-16" />
            <path d="M6 6h12M6 12h12M6 18h12" strokeWidth="0.6" />
          </svg>
          GeneAtlas
        </a>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="https://github.com/Tanishkaaa016/Geneatlas"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
