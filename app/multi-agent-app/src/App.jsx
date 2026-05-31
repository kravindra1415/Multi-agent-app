import { useState } from 'react'
import { useAgentPipeline } from './hooks/useAgentPipeline'

const statusIcon = (s) => s === 'running' ? '⟳' : s === 'done' ? '✓' : '○'
const statusColor = (s) => s === 'running' ? '#BA7517' : s === 'done' ? '#3B6D11' : '#888'

export default function App() {
  const [input, setInput] = useState('')
  const [temperature, setTemperature] = useState(0.0)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ma_history') || '[]') } catch { return [] }
  })

  const { run, agentStates, finalAnswer, loading } = useAgentPipeline()

  async function handleRun(overridePrompt) {
    const prompt = overridePrompt || input
    const answer = await run(prompt, { temperature })
    const entry = { prompt, answer, at: Date.now() }
    const next = [entry, ...history].slice(0, 50)
    setHistory(next)
    try { localStorage.setItem('ma_history', JSON.stringify(next)) } catch { }

    // send to server to persist (Supabase function)
    try {
      fetch('/api/save-convo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, answer }),
      })
    } catch (err) {
      // ignore persist errors for now
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>Multi-agent assistant</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleRun()}
          placeholder="Ask anything..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 15 }}
        />
        <button
          onClick={() => handleRun()}
          disabled={loading || !input.trim()}
          style={{ padding: '8px 16px', borderRadius: 8, border: '0.5px solid #ccc', cursor: 'pointer', fontSize: 14 }}
        >
          {loading ? 'Running…' : 'Send'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>Temperature: {temperature}</label>
        <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} />
      </div>

      {agentStates.length > 0 && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {agentStates.map(a => (
            <div key={a.agent} style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20, border: '0.5px solid #ddd', color: statusColor(a.status) }}>
              {statusIcon(a.status)} {a.agent}
            </div>
          ))}
        </div>
      )}

      {finalAnswer && (
        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '1rem 1.25rem', lineHeight: 1.7, fontSize: 15, whiteSpace: 'pre-wrap' }}>
          {finalAnswer}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Conversation History</h3>
        {history.length === 0 && <div style={{ color: '#666' }}>No previous conversations</div>}
        {history.map((h, i) => (
          <div key={i} style={{ padding: 10, border: '0.5px solid #eee', borderRadius: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: '#333', marginBottom: 6 }}>{h.prompt}</div>
            <div style={{ fontSize: 13, color: '#555', whiteSpace: 'pre-wrap' }}>{h.answer}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
              <button style={{ fontSize: 12 }} onClick={() => { setInput(h.prompt); }}>Edit</button>
              <button style={{ fontSize: 12 }} onClick={() => handleRun(h.prompt)}>Run</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )


}