export async function runResearchAgent(prompt, options = {}) {
    const body = {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
            { role: 'system', content: 'You are a research agent. Given a topic, return key facts and context in bullet points. Be concise.' },
            { role: 'user', content: prompt }
        ],
    }
    if (typeof options.temperature === 'number') body.temperature = options.temperature

    const res = await fetch('/api/groq-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
}