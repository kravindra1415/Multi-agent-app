export async function runValidatorAgent(draft, options = {}) {
    const body = {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
            { role: 'system', content: 'You are a validator agent. Review the draft for accuracy and clarity. Fix anything unclear or incorrect. Return only the improved final answer.' },
            { role: 'user', content: draft }
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