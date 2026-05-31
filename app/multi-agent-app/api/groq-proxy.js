export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(204).end()
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    try {
        const body = req.body
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()
        // forward status and body
        res.status(response.status).json(data)
    } catch (err) {
        res.status(500).json({ error: String(err) })
    }
}
