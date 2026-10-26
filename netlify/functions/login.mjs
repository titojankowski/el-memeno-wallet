// Forwards a signed 6529 session-login. 6529 only lets its own site call this
// endpoint from a browser; every other endpoint allows any origin. The relay
// sees a signature and the returned access token, never the wallet's words.
// Nothing is logged.
export default async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  let b;
  try { b = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const body = {
    client_type: "native",
    client_address: String(b.client_address || ""),
    client_signature: String(b.client_signature || ""),
    server_signature: String(b.server_signature || ""),
  };
  const r = await fetch("https://api.6529.io/api/auth/session-login", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json", "user-agent": "Claude" },
    body: JSON.stringify(body),
  });
  return new Response(await r.text(), { status: r.status, headers: { "content-type": "application/json" } });
};
