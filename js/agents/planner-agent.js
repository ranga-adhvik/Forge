import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'plan', 'schedule', 'organize', 'routine', 'week', 'day', 'month',
  'calendar', 'deadline', 'task', 'todo', 'list', 'priority', 'goals',
  'structure', 'timeline', 'project', 'milestone', 'tomorrow', 'today'
];

export class PlannerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Planner Agent',
      emoji: '🧩',
      key: 'planner',
      role: 'Planning & Scheduling',
      color: '#8b5cf6',
    });

    this.roleDescription = 'Break user goals into clear, actionable steps and timelines.';
    this.customInstructions = '- Convert goals into step-by-step plan\n- Add timeline if possible\n- Keep it realistic';
    this.outputFormat = `{
  "goal": "...",
  "steps": ["step 1", "step 2"],
  "timeline": "...",
  "priority": "high/medium/low"
}`;
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
