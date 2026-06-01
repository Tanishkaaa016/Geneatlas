import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Biology } from "@/components/site/Biology";
import { Dataset } from "@/components/site/Dataset";
import { Methodology } from "@/components/site/Methodology";
import { Results } from "@/components/site/Results";
import { Biomarkers } from "@/components/site/Biomarkers";
import { Pathways } from "@/components/site/Pathways";
import { Classifier } from "@/components/site/Classifier";
import { References } from "@/components/site/References";
import { Footer } from "@/components/site/Footer";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeneAtlas — Cancer subtype classification from RNA-Seq" },
      {
        name: "description",
        content:
          "Attention-enhanced neural network that classifies 5 TCGA cancer subtypes from bulk RNA-Seq expression, with SHAP-based per-gene explanations.",
      },
      { property: "og:title", content: "GeneAtlas — Reading cancer in the genome" },
      {
        property: "og:description",
        content:
          "881 TCGA samples · 20K genes · ~97% test accuracy · interpretable biomarkers per subtype.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Biology />
        <Dataset />
        <Methodology />
        <Results />
        <Biomarkers />
        <Pathways />
        <Classifier />
        <References />

      </main>
      <Footer />
    </div>
  );
}
