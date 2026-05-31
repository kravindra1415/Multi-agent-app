import { useState } from 'react'
import { runPipeline } from '../agents/orchestrator'

export function useAgentPipeline() {
    const [agentStates, setAgentStates] = useState([])
    const [finalAnswer, setFinalAnswer] = useState(null)
    const [loading, setLoading] = useState(false)

    async function run(prompt, options = {}) {
        setLoading(true)
        setFinalAnswer(null)
        setAgentStates([])

        const answer = await runPipeline(prompt, (update) => {
            setAgentStates(prev => {
                const existing = prev.findIndex(a => a.agent === update.agent)
                if (existing >= 0) {
                    const copy = [...prev]
                    copy[existing] = update
                    return copy
                }
                return [...prev, update]
            })
        }, options)

        setFinalAnswer(answer)
        setLoading(false)
    }

    return { run, agentStates, finalAnswer, loading }
}