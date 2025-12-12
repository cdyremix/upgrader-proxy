export default async (req, res) => {
  const response = await fetch('https://api.upgrader.com/affiliate/creator/get-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(200).json(data);
};
