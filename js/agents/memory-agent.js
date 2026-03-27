// ============================================
// LIFE OS — Memory Agent 🧠
// ============================================

import { BaseAgent } from './base-agent.js';

export class MemoryAgent extends BaseAgent {
  constructor(memoryStore) {
    super({
      name: 'Memory Agent',
      emoji: '🧠',
      key: 'memory',
      role: 'Context & Personalization',
      color: '#ec4899',
    });
    this.store = memoryStore;
  }

  analyze(input, context) {
    const patterns = this.detectPatterns(input, context);
    const pastContext = this.retrieveRelevantContext(input, context);

    let opinion, suggestedAction, reasoning;
    let priority = 'low';

    if (patterns.recurring) {
      priority = 'medium';
      opinion = `I've noticed a recurring pattern: you've mentioned "${patterns.recurringTopic}" in ${patterns.count} of your last interactions. This suggests it's a persistent concern that may need a systemic solution, not a one-off fix.`;
      suggestedAction = `Since this is a recurring theme, let's address the root cause rather than the symptom. Consider building a lasting system or habit around this area.`;
      reasoning = `Recurring inputs indicate unresolved issues. Systemic solutions (habits, routines, systems) are more durable than repeated advice.`;
    } else if (pastContext.length > 0) {
      priority = 'low';
      opinion = `Based on your history, I see related context from past interactions: ${pastContext.join('; ')}. This helps me personalize recommendations.`;
      suggestedAction = `I'm using your past context to improve recommendations from other agents. No action needed from you.`;
      reasoning = `Personalization based on past behavior improves recommendation relevance.`;
    } else {
      opinion = `I'm learning your preferences and patterns. The more you interact with Life OS, the more personalized and accurate the recommendations become.`;
      suggestedAction = `Continue using Life OS — I'll track your patterns and provide increasingly personalized advice.`;
      reasoning = `First few interactions build the foundation of your personal context graph.`;
    }

    // Store this interaction
    this.storeInteraction(input, context);

    return { opinion, suggestedAction, reasoning, priority };
  }

  detectPatterns(input, context) {
    const lower = input.toLowerCase();
    const history = context.history || [];
    const topicCounts = {};

    const topics = ['tired', 'study', 'work', 'money', 'stress', 'plan', 'focus', 'health', 'exercise', 'learn', 'exam', 'sleep', 'procrastinate'];

    // Count topic occurrences in history
    topics.forEach(topic => {
      let count = 0;
      history.forEach(h => {
        if (h.toLowerCase().includes(topic)) count++;
      });
      if (lower.includes(topic)) count++;
      if (count >= 2) {
        topicCounts[topic] = count;
      }
    });

    const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      recurring: !!topTopic,
      recurringTopic: topTopic ? topTopic[0] : null,
      count: topTopic ? topTopic[1] : 0,
    };
  }

  retrieveRelevantContext(input, context) {
    const lower = input.toLowerCase();
    const pastDecisions = context.pastDecisions || [];
    const relevant = [];

    pastDecisions.slice(-5).forEach(decision => {
      // Simple relevance check — share keywords
      const words = lower.split(/\s+/);
      const match = words.some(w => w.length > 3 && decision.toLowerCase().includes(w));
      if (match) {
        relevant.push(decision);
      }
    });

    return relevant.slice(0, 3);
  }

  storeInteraction(input, context) {
    if (this.store) {
      this.store.addInteraction(input);
    }
  }

  checkRelevance() {
    return true; // Memory is always running
  }
}
