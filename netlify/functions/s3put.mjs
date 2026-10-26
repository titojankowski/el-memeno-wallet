// Relays one multipart part to a 6529 presigned S3 URL, for browsers the
// bucket's CORS rules refuse. Sees only meme bytes and a one-time URL, no keys.
export default async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const target = new URL(req.url).searchParams.get("url") || "";
  let u;
  try { u = new URL(target); } catch { return new Response("bad url", { status: 400 }); }
  if (u.protocol !== "https:" || !u.hostname.endsWith(".amazonaws.com") || !u.searchParams.has("X-Amz-Signature")) {
    return new Response("not a presigned S3 url", { status: 400 });
  }
  const r = await fetch(u, {
    method: "PUT",
    headers: { "content-type": req.headers.get("content-type") || "application/octet-stream" },
    body: await req.arrayBuffer(),
  });
  if (!r.ok) return new Response(`S3 ${r.status}`, { status: 502 });
  return Response.json({ etag: (r.headers.get("etag") || "").replaceAll('"', "") });
};
