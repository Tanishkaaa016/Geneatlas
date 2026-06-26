import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(selected: File) {
    const valid =
      selected.name.endsWith(".csv") ||
      selected.name.endsWith(".tsv");

    if (!valid) {
      alert("Upload a CSV or TSV file.");
      return;
    }

    setFile(selected);
  }

  return (
    <div className="rounded-3xl border bg-card p-8 shadow-sm">

      <h2 className="text-2xl font-semibold">
        Upload RNA-Seq Sample
      </h2>

      <p className="mt-2 text-muted-foreground">
        Upload a bulk RNA-Seq gene expression file to classify
        cancer subtype.
      </p>

      <div
        className={`mt-8 rounded-2xl border-2 border-dashed p-12 text-center transition

        ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border"
        }
        `}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <UploadCloud
          className="mx-auto mb-4 text-primary"
          size={60}
        />

        <p className="text-lg font-medium">
          Drag & Drop CSV / TSV
        </p>

        <p className="mt-2 text-muted-foreground">
          or click to browse
        </p>

        <input
          hidden
          ref={inputRef}
          type="file"
          accept=".csv,.tsv"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {file && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border bg-muted/40 p-4">

          <FileText className="text-primary" />

          <div className="flex-1">

            <p className="font-medium">
              {file.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>

          </div>

          <CheckCircle2 className="text-green-500" />

        </div>
      )}

      <div className="mt-6 flex gap-6 text-sm text-muted-foreground">

        <span>✓ CSV</span>

        <span>✓ TSV</span>

        <span>Max 50 MB</span>

      </div>

    </div>
  );
}
