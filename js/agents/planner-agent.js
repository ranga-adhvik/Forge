// ============================================
// LIFE OS — Planner Agent 🧩
// ============================================

import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'plan', 'schedule', 'organize', 'routine', 'week', 'day', 'month',
  'calendar', 'deadline', 'task', 'todo', 'list', 'priority', 'goals',
  'structure', 'habit', 'morning', 'evening', 'time management',
  'agenda', 'timeline', 'project', 'milestone', 'quarterly', 'daily',
  'weekly', 'monthly', 'tomorrow', 'today', 'next week'
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
  }

  analyze(input, context) {
    const lower = input.toLowerCase();
    const hasDeadline = /deadline|due|exam|submit|presentation/.test(lower);
    const hasGoal = /goal|target|achieve|accomplish|milestone/.test(lower);
    const hasRoutine = /routine|habit|daily|morning|evening|schedule/.test(lower);
    const hasOverwhelm = /overwhelm|too much|busy|stressed|juggling/.test(lower);

    let opinion, suggestedAction, reasoning;
    let priority = 'medium';

    if (hasDeadline) {
      priority = 'high';
      opinion = 'There are time-sensitive commitments here. Without a structured breakdown, you risk last-minute cramming or missing deadlines entirely.';
      suggestedAction = 'Create a reverse-scheduled timeline: start from the deadline and work backward, allocating specific time blocks for each sub-task. Include buffer time for unexpected delays.';
      reasoning = 'Deadlines create urgency. A reverse-schedule ensures every day has clear deliverables rather than vague "work on it" plans.';
    } else if (hasOverwhelm) {
      priority = 'high';
      opinion = 'The feeling of overwhelm usually comes from lack of structure, not lack of time. The problem is visibility — you can\'t see what matters most.';
      suggestedAction = 'Do an immediate brain dump: write down every single task. Then categorize by urgency (must-do today, this week, eventually). Pick your top 3 for today and ignore the rest until tomorrow.';
      reasoning = 'Cognitive overload reduces effectiveness. Externalize your tasks, then ruthlessly prioritize. The "Top 3" method prevents paralysis.';
    } else if (hasRoutine) {
      priority = 'medium';
      opinion = 'Routines are the backbone of consistent progress. The best routines are ones that require zero decision-making — they should be automatic.';
      suggestedAction = 'Design a time-blocked routine with fixed anchors (wake up, meals, sleep) and flexible work blocks. Start small — a 3-day streak builds momentum.';
      reasoning = 'Habits reduce cognitive load. By attaching new behaviors to existing anchors, you increase the odds of consistency.';
    } else if (hasGoal) {
      priority = 'medium';
      opinion = 'Goals without a plan are just wishes. You need to convert this into actionable milestones with measurable checkpoints.';
      suggestedAction = 'Break this goal into 4-week sprints. Each sprint should have a clear deliverable. Track progress weekly and adjust the plan based on what\'s working.';
      reasoning = 'Long-term goals fail when there\'s no short-term structure. Sprint-based planning keeps motivation high with regular wins.';
    } else {
      opinion = 'Every input benefits from some level of structure. Even if this seems casual, having a clear next step prevents drift.';
      suggestedAction = 'Define the single most important next action you could take right now. Write it down with a specific time block.';
      reasoning = 'Clarity of the next step is the #1 predictor of action. Vague plans lead to procrastination.';
    }

    // Add context-aware personalization
    if (context.interactionCount > 5) {
      opinion += ' Based on your pattern, you tend to do better with structured approaches.';
    }

    return { opinion, suggestedAction, reasoning, priority };
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
