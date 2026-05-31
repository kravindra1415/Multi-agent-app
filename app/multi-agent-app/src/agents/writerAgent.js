export async function runWriterAgent(prompt, research, options = {}) {
    const body = {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
            { role: 'system', content: 'You are a writer agent. Given a user question and research notes, write a clear, helpful answer in 2-3 paragraphs.' },
            {
                role: 'user',
                content: `Question: ${prompt}\n\nResearch notes:\n${research}`,
            }
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