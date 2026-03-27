// ============================================
// LIFE OS — Base Agent Class
// ============================================

import { LLMService } from '../engine/llm-service.js';

export class BaseAgent {
  constructor({ name, emoji, key, role, color }) {
    this.name = name;
    this.emoji = emoji;
    this.key = key;
    this.role = role;
    this.color = color;
    this.active = false;

    // Subclasses will define these based on the prompt templates
    this.roleDescription = "";
    this.customInstructions = "";
    this.outputFormat = "";
  }

  generatePrompt(userInput, contextStr) {
    return `You are the ${this.name} in a Life OS system.

Your role:
${this.roleDescription}

User input:
${userInput}

Context (if any):
${contextStr}

Instructions:
- Be clear and concise
- Give structured output
- Focus only on your role
- Do not add unnecessary explanation
${this.customInstructions}

Output format:
${this.outputFormat}`;
  }

  /**
   * Abstracted analyze function that subclasses no longer need to override.
   * Calls the Gemini API internally.
   */
  async analyze(input, context) {
    // Stringify context safely
    let contextStr = 'None';
    if (context && Object.keys(context).length > 0) {
      contextStr = `Recent Decisions: ${context.history?.join(' | ') || ''} \nInteraction Count: ${context.interactionCount}`;
    }

    const prompt = this.generatePrompt(input, contextStr);

    try {
      const resultObj = await LLMService.generate(prompt);
      
      // Ensure priority exists
      if (!resultObj.priority) {
        resultObj.priority = 'medium';
      }

      // We package the raw JSON keys under "data", so renderer can dynamically loop them
      return {
        priority: resultObj.priority.toLowerCase(),
        data: resultObj
      };
    } catch (e) {
      console.error(`[${this.name}] LLM Error:`, e);
      return {
        priority: 'low',
        data: {
          error: "Agent offline or failed to generate.",
          details: e.message
        }
      };
    }
  }

  /**
   * Uses keyword matching. Subclasses should override for better intelligence if needed.
   */
  isRelevant(input, keywords = []) {
    const lower = input.toLowerCase();
    return keywords.some(k => lower.includes(k));
  }

  getMeta() {
    return {
      name: this.name,
      emoji: this.emoji,
      key: this.key,
      role: this.role,
      color: this.color,
      active: this.active,
    };
  }

  activate() { this.active = true; }
  deactivate() { this.active = false; }
}
