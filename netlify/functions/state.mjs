import { getStore } from "@netlify/blobs";

// Stores the whole tracker state as one JSON blob, protected by a PIN.
// This file runs only on Netlify's server, so visitors can't see the PIN.
// To change it, edit PIN below and push.
const PIN = "021013";

export default async (req) => {
  if ((req.headers.get("x-pin") || "").trim() !== PIN) return new Response("Unauthorized", { status: 401 });

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
