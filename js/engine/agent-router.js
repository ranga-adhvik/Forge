// ============================================
// LIFE OS — Agent Router
// ============================================

export class AgentRouter {
  constructor(agents) {
    this.agents = agents; // Map of key -> agent instance
  }

  /**
   * Select which agents to activate based on parsed intents.
   * @param {{ intents: object[], primaryIntent: object }} parsedIntent
   * @param {string} input - Raw user input
   * @returns {BaseAgent[]} - Array of activated agents (excluding decision & memory, which are always active)
   */
  route(parsedIntent, input) {
    const agentKeys = new Set();

    // Collect agent keys from all matched intents
    parsedIntent.intents.forEach(intent => {
      intent.agents.forEach(key => agentKeys.add(key));
    });

    // Also check each agent's own relevance detection
    for (const [key, agent] of Object.entries(this.agents)) {
      if (key === 'decision' || key === 'memory') continue;
      if (agent.checkRelevance && agent.checkRelevance(input)) {
        agentKeys.add(key);
      }
    }

    // Always include decision and memory
    agentKeys.add('decision');
    agentKeys.add('memory');

    // Activate selected agents
    const activated = [];
    for (const key of agentKeys) {
      const agent = this.agents[key];
      if (agent) {
        agent.activate();
        activated.push(agent);
      }
    }

    // Deactivate non-selected agents
    for (const [key, agent] of Object.entries(this.agents)) {
      if (!agentKeys.has(key)) {
        agent.deactivate();
      }
    }

    return activated;
  }
}
