// api/upgrader.js - WORKING UPGRADER PROXY (DEC 2025)
const UPGRADER_API = 'https://api.upgrader.com/affiliate/creator/get-stats';
const API_KEY = '2ad23c0d-685d-4be5-95a1-8a007db08153'; // Your real key from the log

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: true, msg: 'Method Not Allowed' });
  }

  // CORS: Allow your site only
  const origin = req.headers.origin;
  if (origin === 'https://yosoykush.fun') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    return res.status(403).json({ error: true, msg: 'Origin not allowed' });
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract dates from body (your frontend sends them)
  const { from, to } = req.body || {};
  const payload = {
    apikey: API_KEY,
  };
  if (from) payload.from = from; // Already YYYY-MM-DD
  if (to) payload.to = to;

  try {
    const apiResponse = await fetch(UPGRADER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YosoyKush-Leaderboard/1.0'
      },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok || data.error) {
      console.error('Upgrader API failed:', data);
      return res.status(apiResponse.status || 500).json({
        error: true,
        msg: data.msg || 'Upgrader API error',
        retryable: data.retryable || false
      });
    }

    // Success: Return clean data
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(502).json({ error: true, msg: 'Proxy failed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
    external: true  // Allow external fetches
  }
};
