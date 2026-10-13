import { getStore } from "@netlify/blobs";

// Stores the whole tracker state as one JSON blob, protected by the APP_PIN env var.
export default async (req) => {
  const pin = process.env.APP_PIN;
  if (!pin) return new Response("APP_PIN not configured", { status: 500 });
  if (req.headers.get("x-pin") !== pin) return new Response("Unauthorized", { status: 401 });

  const store = getStore("mygoals");
  if (req.method === "GET") {
    const data = await store.get("state", { type: "json" });
    return Response.json(data || {});
  }
  if (req.method === "PUT") {
    const body = await req.json();
    await store.setJSON("state", body);
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/state" };
