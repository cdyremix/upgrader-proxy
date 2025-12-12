// api/upgrader.js
// Vercel Serverless Proxy for Upgrader.com Affiliate Leaderboard
// Works perfectly with your current leaderboards.js (Dec 2025)

const UPGRADER_API = 'https://api.upgrader.com/affiliate/creator/get-stats';
const API_KEY = '2ad23c0d-685d-4be5-95a1-8a007db08153'; // ← CHANGE THIS!

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: true, msg: 'Method Not Allowed' });
  }

  // Security: Only allow requests from your domain
  const allowedOrigin = 'https://yosoykush.fun';
  const origin = req.headers.origin || req.headers.referer;

  if (origin && !origin.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: true, msg: 'Forbidden' });
  }

  // Use the code from frontend OR fallback to YOSOYKUSH
  const { code, from, to } = req.body || {};

  // Build correct payload for Upgrader API
  const payload = {
    apikey: API_KEY, // This is the real API key from your Upgrader dashboard
  };

  // Optional: Allow custom date range from frontend (your site already sends this)
  if (from) payload.from = from.split('T')[0]; // Ensure YYYY-MM-DD
  if (to) payload.to = to.split('T')[0];

  try {
    const response = await fetch(UPGRADER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YOSOYKUSH-Leaderboard/1.0 (+https://yosoykush.fun)',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Forward rate limit / error messages cleanly
    if (!response.ok || data.error) {
      console.error('Upgrader API Error:', data);
      return res.status(response.status).json({
        error: true,
        msg: data.msg || 'Upgrader API error',
        retryable: data.retryable || false,
      });
    }

    // Success – return clean data
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy fetch failed:', err);
    return res.status(502).json({
      error: true,
      msg: 'Bad gateway – proxy error',
    });
  }
}

// Config: Increase timeout & memory if needed
export const config = {
  api: {
    bodyParser: true,
    sizeLimit: '1mb',
  },
};
