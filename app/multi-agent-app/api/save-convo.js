export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'GET') return res.status(200).json({ ok: true, info: 'save-convo endpoint. Use POST to save conversations.' })
    if (req.method === 'OPTIONS') return res.status(204).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed', method: req.method })

    try {
        const { prompt, answer } = req.body || {}
        const SUPABASE_URL = process.env.SUPABASE_URL
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(500).json({ error: 'Supabase not configured' })

        const response = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                Prefer: 'return=representation',
            },
            body: JSON.stringify([{ prompt, answer }]),
        })

        const data = await response.json()
        res.status(response.status).json(data)
    } catch (err) {
        res.status(500).json({ error: String(err) })
    }
}
