import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'sleep', 'exhausted', 'tired', 'sick', 'health', 'fitness', 'workout',
  'burnout', 'stress', 'mental', 'anxiety', 'food', 'diet', 'water'
];

export class HealthAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Health Agent',
      emoji: '❤️',
      key: 'health',
      role: 'Physical & Mental Well-being',
      color: '#f43f5e',
    });

    this.roleDescription = 'Provide simple health, fitness, and wellness advice.';
    this.customInstructions = '- Keep advice safe and general\n- Suggest habits, not medical diagnosis';
    this.outputFormat = `{
  "issue": "...",
  "advice": "...",
  "habits": ["...", "..."],
  "priority": "high/medium/low"
}`;
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
