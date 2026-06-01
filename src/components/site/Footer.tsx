export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-baseline justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <div>
          © 2025 GeneAtlas · Tanishka · SRMIST · Built with PyTorch, SHAP, TanStack Start.
        </div>
        <div className="font-mono">
          v0.2 · model proxied from gene-classifier.onrender.com
        </div>
      </div>
    </footer>
  );
}
