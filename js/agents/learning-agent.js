import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'learn', 'study', 'exam', 'test', 'course', 'read', 'understand',
  'remember', 'memory', 'concept', 'skill', 'practice'
];

export class LearningAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Learning Agent',
      emoji: '📚',
      key: 'learning',
      role: 'Knowledge & Growth',
      color: '#3b82f6',
    });

    this.roleDescription = 'Help the user learn efficiently.';
    this.customInstructions = '- Break topics into simple parts\n- Suggest study methods';
    this.outputFormat = `{
  "topic": "...",
  "plan": ["...", "..."],
  "resources": ["videos", "practice"],
  "priority": "high/medium/low"
}`;
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
