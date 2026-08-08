// script.js
export default async function handler(req, res) {
    // Only allow secure POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Accesses the encrypted key saved in your Vercel dashboard
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing on the server.' });
    }

    const { prompt } = req.body;

    try {
        // Safe backend fetch directly to Google Gemini API
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
}
