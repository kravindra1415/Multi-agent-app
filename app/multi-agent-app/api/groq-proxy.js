export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(204).end()
    }
    // read raw body for diagnostics (works even if body parser didn't run)
    let raw = ''
    try {
        raw = await new Promise((resolve) => {
            let data = ''
            req.on && req.on('data', (c) => (data += c))
            req.on && req.on('end', () => resolve(data))
            // if no streaming (some runtimes), fall back quickly
            setTimeout(() => resolve(data), 5)
        })
    } catch (e) {
        raw = ''
    }

    let parsedBody = null
    try { parsedBody = raw ? JSON.parse(raw) : req.body } catch (e) { parsedBody = null }

    if (req.method === 'GET') {
        return res.status(200).json({ ok: true, info: 'groq-proxy endpoint. Use POST to forward requests to Groq.', method: req.method, headers: req.headers, rawSample: raw ? raw.slice(0, 1000) : null, parsed: parsedBody })
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed', method: req.method, rawLength: raw.length })

    try {
        const bodyToSend = parsedBody || req.body || (raw ? JSON.parse(raw) : {})
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify(bodyToSend),
        })

        const text = await response.text()
        // try parse JSON, otherwise forward as text
        try {
            const data = JSON.parse(text)
            res.status(response.status).json(data)
        } catch (e) {
            res.status(response.status).send(text)
        }
    } catch (err) {
        res.status(500).json({ error: String(err) })
    }
}
