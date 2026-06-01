// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      allowedHosts: ["gene-classifier.onrender.com"],
    },
    preview: {
      allowedHosts: ["gene-classifier.onrender.com"],
    },
  },
});
