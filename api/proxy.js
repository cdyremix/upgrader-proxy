// api/proxy.js  ←  WORKING UPGRADER PROXY (December 2025)

const UPGRADER_API = "https://api.upgrader.com/affiliate/creator/get-stats";
const API_KEY = "2ad23c0d-685d-4be5-95a1-8a007db08153"; // ← your real key

export default async function POST(req) {
  const { from, to } = await req.json();

  const payload = { apikey: API_KEY };
  if (from) payload.from = from.split("T")[0];
  if (to) payload.to = to.split("T")[0];

  const res = await fetch(UPGRADER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 500,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://yosoykush.fun",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://yosoykush.fun",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
