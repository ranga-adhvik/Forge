import { BaseAgent } from './base-agent.js';
import { LLMService } from '../engine/llm-service.js';

export class DecisionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Decision Agent',
      emoji: '⚖️',
      key: 'decision',
      role: 'Tradeoff Resolution',
      color: '#06b6d4',
    });

    this.roleDescription = 'Help the user make better decisions by weighing multiple perspectives.';
    this.customInstructions = '- List pros and cons\n- Suggest best option with reason\n- Consider the context of other agents opinions if provided.';
    this.outputFormat = `{
  "options": ["A", "B"],
  "pros_cons": {
    "A": ["+", "-"],
    "B": ["+", "-"]
  },
  "recommended": "...",
  "priority": "high/medium/low",
  "autonomousAction": "..."
}`;
  }

  /**
   * Used by DecisionFlow orchestrator to resolve conflicts between agents.
   */
  async resolve(agentResults, input, context) {
    // Stringify the other agents' outputs so the Decision Agent can read them
    const summarizedResults = agentResults.map(r => ({
      agentName: r.agent.name,
      agentOpinion: r.result.data
    }));

    const fbStr = context.feedbackHistory && context.feedbackHistory.length > 0 ? `\nUser Feedback constraints: ${context.feedbackHistory.join(' | ')}` : '';
    const specialContext = `Past Decisions: ${context.history?.join(' | ') || 'None'}${fbStr}\n\nHere are the opinions from other agents:\n${JSON.stringify(summarizedResults, null, 2)}`;

    const prompt = this.generatePrompt(input, specialContext);

    try {
      const resultObj = await LLMService.generate(prompt);
      
      return {
        // Keeping finalDecision and reasoning top-level to stay somewhat compatible
        finalDecision: resultObj.recommended || "No clear recommendation.",
        reasoning: JSON.stringify(resultObj.pros_cons || {}) || "N/A",
        autonomousAction: resultObj.autonomousAction || "Awaiting user confirmation to proceed.",
        data: resultObj // Raw payload for renderer
      };
    } catch (e) {
      console.error("[DecisionAgent] LLM Error:", e);
      return {
        finalDecision: "System experienced an error while deciding.",
        reasoning: e.message,
        autonomousAction: "None",
        data: { error: e.message }
      };
    }
  }

  checkRelevance() {
    return true; // Always runs at end of pipeline
  }
}
