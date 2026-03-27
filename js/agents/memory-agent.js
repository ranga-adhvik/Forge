import { BaseAgent } from './base-agent.js';
import { LLMService } from '../engine/llm-service.js';

export class MemoryAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Memory Agent',
      emoji: '🧠',
      key: 'memory',
      role: 'Context & Recall',
      color: '#ec4899',
    });

    this.roleDescription = 'Store and recall important user information.';
    this.customInstructions = '- Extract key info\n- Keep it short and useful';
    this.outputFormat = `{
  "key_points": ["...", "..."],
  "tags": ["health", "goals"],
  "importance": "high/medium/low"
}`;
  }

  /**
   * Memory Agent always runs. It processes the input to extract key points.
   */
  async analyze(input, context) {
    const prompt = this.generatePrompt(input, JSON.stringify(context.history || []));
    
    try {
      const resultObj = await LLMService.generate(prompt);
      
      // We map 'importance' to 'priority' so standard UI logic works 
      return {
        priority: resultObj.importance?.toLowerCase() || 'low',
        data: resultObj
      };
    } catch (e) {
      console.error("[MemoryAgent] LLM Error:", e);
      return { priority: 'low', data: { error: e.message } };
    }
  }

  checkRelevance() {
    return true; // Memory agent always runs to store Context
  }
}
