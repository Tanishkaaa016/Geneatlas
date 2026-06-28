import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM =
  import.meta.env.VITE_GENEATLAS_API_URL ?? "https://gene-classifier.onrender.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function proxyResponse(response: Response) {
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export const Route = createFileRoute("/api/classify")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),

      GET: async () => {
        try {
          const response = await fetch(`${UPSTREAM}/api/demo`, { method: "GET" });
          return proxyResponse(response);
        } catch (error) {
          return new Response(
            JSON.stringify({ success: false, error: "Upstream unreachable", detail: String(error) }),
            { status: 502, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const contentType = request.headers.get("content-type") ?? "";

          if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const response = await fetch(`${UPSTREAM}/api/predict`, {
              method: "POST",
              body: formData,
            });
            return proxyResponse(response);
          }

          const body = await request.text();
          const response = await fetch(`${UPSTREAM}/api/predict/json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body || JSON.stringify({ mode: "demo" }),
          });
          return proxyResponse(response);
        } catch (error) {
          return new Response(
            JSON.stringify({ success: false, error: "Upstream unreachable", detail: String(error) }),
            { status: 502, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },
    },
  },
});
