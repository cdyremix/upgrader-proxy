// api/proxy.js - UPGRADER AFFILIATE LEADERBOARD PROXY (Dec 12, 2025)
const UPGRADER_API = 'https://api.upgrader.com/affiliate/creator/get-stats';
const API_KEY = '2ad23c0d-685d-4be5-95a1-8a007db08153'; // Your key

export default async function handler(req, res) {
  // CORS Preflight (fixes your OPTIONS error)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, msg: 'POST only' });
  }

  // Extract dates from body (your JS sends {from, to})
  const { from, to } = req.body || {};
  const payload = { apikey: API_KEY };
  if (from) payload.from = from;  // YYYY-MM-DD
  if (to) payload.to = to;

  // Forward to real Upgrader API
  try {
    const apiRes = await fetch(UPGRADER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      },
      body: JSON.stringify(payload)
    });

    let data = await apiRes.json();

    // Enhance data: Convert wagers from cents to dollars (for your leaderboard)
    if (!data.error && data.data?.summarizedBets) {
      data.data.summarizedBets = data.data.summarizedBets.map(item => ({
        ...item,
        wager: (parseFloat(item.wager) || 0) / 100  // Cents → dollars
      }));
    }

    // CORS for success/error
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'no-store, max-age=0');  // Fresh data every time

    if (!apiRes.ok || data.error) {
      return res.status(apiRes.status || 500).json(data);  // Forward errors (e.g., rate limit)
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy Error:', err);
    return res.status(500).json({ error: true, msg: 'Proxy failed - check rate limit' });
  }
}

// Vercel config (auto-handles body parsing)
export const config = {
  api: {
    bodyParser: true
  }
};
