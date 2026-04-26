export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'https://nomad-nest-goa--akudhuvi.replit.app';
    
    const response = await fetch(`${backendUrl}/api/ai/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Backend proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from backend',
      message: error.message 
    });
  }
}
