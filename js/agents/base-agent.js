// ============================================
// LIFE OS — Base Agent Class
// ============================================

export class BaseAgent {
  constructor({ name, emoji, key, role, color }) {
    this.name = name;
    this.emoji = emoji;
    this.key = key;
    this.role = role;
    this.color = color;
    this.active = false;
  }

  /**
   * Analyze user input and return an opinion.
   * Subclasses MUST override this method.
   * @param {string} input - User's raw input text
   * @param {object} context - Memory context from MemoryStore
   * @returns {{ opinion: string, suggestedAction: string, reasoning: string, priority: 'high'|'medium'|'low' }}
   */
  analyze(input, context) {
    throw new Error(`Agent ${this.name} must implement analyze()`);
  }

  /**
   * Check if this agent is relevant to the input.
   * Uses keyword matching. Subclasses should override for better matching.
   * @param {string} input 
   * @param {string[]} keywords
   * @returns {boolean}
   */
  isRelevant(input, keywords = []) {
    const lower = input.toLowerCase();
    return keywords.some(k => lower.includes(k));
  }

  /**
   * Get agent metadata for UI rendering.
   */
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
