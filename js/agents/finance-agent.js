import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'money', 'save', 'spend', 'budget', 'expensive', 'buy', 'purchase',
  'finance', 'invest', 'monthly', 'cost', 'pay', 'salary', 'income'
];

export class FinanceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Finance Agent',
      emoji: '💰',
      key: 'finance',
      role: 'Wealth & Budgeting',
      color: '#10b981',
    });

    this.roleDescription = 'Help manage money, savings, and spending.';
    this.customInstructions = '- Suggest budgeting tips\n- Avoid risky advice\n- Keep it practical';
    this.outputFormat = `{
  "situation": "...",
  "advice": "...",
  "actions": ["save", "track expenses"],
  "priority": "high/medium/low"
}`;
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
