// ============================================
// LIFE OS — Intent Parser
// ============================================

const INTENT_CATEGORIES = {
  health_crisis: {
    label: 'Health & Well-being Crisis',
    keywords: /\b(tired|exhausted|burnout|can't sleep|insomnia|sick|headache|depressed|anxiety|panic|breakdown)\b/i,
    weight: 3,
    agents: ['health', 'planner'],
  },
  exam_pressure: {
    label: 'Exam & Academic Pressure',
    keywords: /\b(exam|test|final|midterm|quiz|assignment due|homework|submit|deadline|pass|fail)\b/i,
    weight: 3,
    agents: ['learning', 'productivity', 'planner', 'health'],
  },
  productivity_block: {
    label: 'Productivity & Focus Issue',
    keywords: /\b(procrastinat|can't focus|distract|unmotivat|lazy|stuck|unproductive|wasting time|behind)\b/i,
    weight: 2,
    agents: ['productivity', 'health', 'planner'],
  },
  financial_decision: {
    label: 'Financial Decision',
    keywords: /\b(buy|purchase|spend|invest|save|budget|money|afford|expensive|cost|subscribe|course fee)\b/i,
    weight: 2,
    agents: ['finance', 'learning'],
  },
  learning_goal: {
    label: 'Learning & Skill Development',
    keywords: /\b(learn|study|course|skill|tutorial|practice|understand|concept|master|bootcamp|certification)\b/i,
    weight: 2,
    agents: ['learning', 'productivity', 'finance'],
  },
  planning_need: {
    label: 'Planning & Organization',
    keywords: /\b(plan|schedule|organize|routine|habit|goal|week|tomorrow|structure|prioritize|time management)\b/i,
    weight: 2,
    agents: ['planner', 'productivity'],
  },
  life_balance: {
    label: 'Life Balance & Decision',
    keywords: /\b(balance|should i|decision|choose|option|tradeoff|worth|risk|opportunity|career|life)\b/i,
    weight: 1,
    agents: ['planner', 'health', 'productivity', 'finance', 'learning'],
  },
  general: {
    label: 'General Query',
    keywords: null,
    weight: 0,
    agents: ['planner', 'productivity'],
  },
};

export class IntentParser {
  /**
   * Parse user input and identify intent categories.
   * @param {string} input 
   * @returns {{ intents: object[], primaryIntent: object, summary: string }}
   */
  parse(input) {
    const matchedIntents = [];

    for (const [key, category] of Object.entries(INTENT_CATEGORIES)) {
      if (key === 'general') continue;
      if (category.keywords && category.keywords.test(input)) {
        matchedIntents.push({
          key,
          ...category,
          matchScore: this.scoreMatch(input, category),
        });
      }
    }

    // Sort by weight * match score
    matchedIntents.sort((a, b) => (b.weight * b.matchScore) - (a.weight * a.matchScore));

    // If no matches, use general
    if (matchedIntents.length === 0) {
      matchedIntents.push({
        key: 'general',
        ...INTENT_CATEGORIES.general,
        matchScore: 1,
      });
    }

    const primaryIntent = matchedIntents[0];
    const summary = this.generateSummary(input, primaryIntent, matchedIntents);

    return {
      intents: matchedIntents,
      primaryIntent,
      summary,
    };
  }

  scoreMatch(input, category) {
    if (!category.keywords) return 0;
    const matches = input.match(category.keywords);
    return matches ? matches.length : 0;
  }

  generateSummary(input, primary, all) {
    const truncated = input.length > 80 ? input.substring(0, 80) + '...' : input;
    
    if (all.length > 1) {
      return `"${truncated}" — Detected as ${primary.label} with ${all.length - 1} related concern(s): ${all.slice(1).map(i => i.label).join(', ')}.`;
    }
    return `"${truncated}" — Detected as ${primary.label}.`;
  }
}
