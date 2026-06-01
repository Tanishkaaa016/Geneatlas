import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://gene-classifier.onrender.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/classify")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () => {
        try {
          const r = await fetch(`${UPSTREAM}/api/demo`, { method: "GET" });
          const text = await r.text();
          return new Response(text, {
            status: r.status,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Upstream unreachable", detail: String(e) }),
            { status: 502, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          // Try /api/predict first, fall back to /api/demo
          let r = await fetch(`${UPSTREAM}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body || "{}",
          });
          if (r.status === 404 || r.status === 405) {
            r = await fetch(`${UPSTREAM}/api/demo`, { method: "GET" });
          }
          const text = await r.text();
          return new Response(text, {
            status: r.status,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Upstream unreachable", detail: String(e) }),
            { status: 502, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },
    },
  },
});
