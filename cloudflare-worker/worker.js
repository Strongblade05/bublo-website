// BUBLO global meme download counter — Cloudflare Worker + KV
// Bind a KV namespace named COUNTS in Worker settings.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
});
const validId = (id) => typeof id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && id.length <= 100;
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") {
      const keys = await env.COUNTS.list({ prefix: "meme:" });
      const counts = {};
      for (const key of keys.keys) {
        const value = await env.COUNTS.get(key.name);
        counts[key.name.slice(5)] = Number(value || 0);
      }
      return json(counts);
    }
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    let body; try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
    const id = body?.memeId; if (!validId(id)) return json({ error: "Invalid meme ID" }, 400);
    const key = `meme:${id}`;
    // KV is eventually consistent; this lightweight counter is intended for modest community traffic.
    const current = Number(await env.COUNTS.get(key) || 0);
    const next = current + 1;
    await env.COUNTS.put(key, String(next));
    const keys = await env.COUNTS.list({ prefix: "meme:" });
    const counts = {};
    for (const item of keys.keys) counts[item.name.slice(5)] = Number(await env.COUNTS.get(item.name) || 0);
    return json({ ok: true, counts });
  },
};
