import { runResearchAgent } from './researchAgent'
import { runWriterAgent } from './writerAgent'
import { runValidatorAgent } from './validatorAgent'

export async function runPipeline(userPrompt, onUpdate, options = {}) {
    onUpdate({ agent: 'Research', status: 'running' })
    const research = await runResearchAgent(userPrompt, options)
    onUpdate({ agent: 'Research', status: 'done', output: research })

    onUpdate({ agent: 'Writer', status: 'running' })
    const draft = await runWriterAgent(userPrompt, research, options)
    onUpdate({ agent: 'Writer', status: 'done', output: draft })

    onUpdate({ agent: 'Validator', status: 'running' })
    const final = await runValidatorAgent(draft, options)
    onUpdate({ agent: 'Validator', status: 'done', output: final })

    return final
}