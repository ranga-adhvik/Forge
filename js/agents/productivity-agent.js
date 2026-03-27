import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'focus', 'distracted', 'procrastinating', 'lazy', 'tired', 'efficient',
  'productivity', 'workflow', 'pomodoro', 'block', 'wasting time', 'social media'
];

export class ProductivityAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Productivity Agent',
      emoji: '⚡',
      key: 'productivity',
      role: 'Efficiency & Focus',
      color: '#f59e0b',
    });

    this.roleDescription = 'Help the user stay focused and efficient.';
    this.customInstructions = '- Suggest focus techniques\n- Remove distractions\n- Improve efficiency';
    this.outputFormat = `{
  "problem": "...",
  "solution": "...",
  "techniques": ["Pomodoro", "Time blocking"],
  "priority": "high/medium/low"
}`;
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
