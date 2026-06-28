import { createFileRoute } from "@tanstack/react-router";
import UploadCard from "@/components/site/UploadCard";

export const Route = createFileRoute("/demo")({
  component: Demo,
});

function Demo() {
  return (
    <div className="min-h-screen bg-background py-16">

      <div className="mx-auto max-w-5xl px-6">

        <h1 className="font-display text-5xl">
          GeneAtlas AI
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Upload a bulk RNA-seq sample and let GeneAtlas identify
          the cancer subtype using explainable AI.
        </p>

        <div className="mt-12">

          <UploadCard />

        </div>

      </div>

    </div>
  );
}
