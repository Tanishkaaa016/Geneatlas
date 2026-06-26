import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: Demo,
});

function Demo() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">

      <div className="mx-auto max-w-7xl">

        <h1 className="font-display text-5xl">
          GeneAtlas AI
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Upload a bulk RNA-Seq gene expression sample and let the model
          classify the cancer subtype while explaining every prediction.
        </p>

      </div>

    </div>
  );
}
