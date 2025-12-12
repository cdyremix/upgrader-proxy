// api/proxy.js - YOUR WORKING UPGRADER PROXY (Dec 12, 2025)
const UPGRADER_API = 'https://api.upgrader.com/affiliate/creator/get-stats';
const API_KEY = '2ad23c0d-685d-4be5-95a1-8a007db08153';  // Your key

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, msg: 'Only POST allowed' });
  }

  const { from, to } = req.body || {};
  const payload = { apikey: API_KEY };
  if (from) payload.from = from;
  if (to) payload.to = to;

  try {
    const apiRes = await fetch(UPGRADER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await apiRes.json();

    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'no-store');

    if (!apiRes.ok || data.error) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: true, msg: 'Proxy error' });
  }
}
