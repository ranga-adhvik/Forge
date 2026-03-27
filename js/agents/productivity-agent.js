// ============================================
// LIFE OS — Productivity Agent ⚡
// ============================================

import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'work', 'productive', 'focus', 'distract', 'procrastinat', 'efficient',
  'output', 'performance', 'deep work', 'flow', 'pomodoro', 'task',
  'accomplish', 'deliver', 'hustle', 'grind', 'motivation', 'discipline',
  'lazy', 'stuck', 'behind', 'slow', 'faster', 'more done', 'complete',
  'finish', 'progress', 'momentum', 'concentration', 'block'
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
  }

  analyze(input, context) {
    const lower = input.toLowerCase();
    const hasProcrastination = /procrastinat|lazy|unmotivat|can't start|putting off|avoid/.test(lower);
    const hasDistraction = /distract|focus|concentrat|phone|social media|wander/.test(lower);
    const hasWorkload = /too much|overwhelm|workload|behind|deadline|exam/.test(lower);
    const hasFatigue = /tired|exhaust|burn|fatigue|drain|no energy|sleepy/.test(lower);
    const hasStudy = /study|learn|exam|test|read|course|homework|assignment/.test(lower);

    let opinion, suggestedAction, reasoning;
    let priority = 'medium';

    if (hasProcrastination) {
      priority = 'high';
      opinion = 'Procrastination is not a time management problem — it\'s an emotion management problem. You\'re avoiding the discomfort of starting, not the task itself.';
      suggestedAction = 'Use the "2-Minute Start" rule: commit to working on the task for just 2 minutes. Once you start, momentum takes over. Pair this with removing all friction (close tabs, put phone in another room).';
      reasoning = 'Research shows that starting is the hardest part. The 2-minute commitment lowers the activation energy dramatically.';
    } else if (hasDistraction) {
      priority = 'high';
      opinion = 'Your environment is working against you. Every distraction costs 23 minutes of refocus time. This is a systemic issue, not a willpower issue.';
      suggestedAction = 'Create a "focus fortress": Enable Do Not Disturb, use a website blocker (e.g., Cold Turkey), close all unnecessary tabs, and work in 45-minute deep work blocks with 10-minute breaks.';
      reasoning = 'Relying on willpower to avoid distractions is a losing strategy. Environmental design is 10x more effective than self-control.';
    } else if (hasWorkload && hasFatigue) {
      priority = 'high';
      opinion = 'You\'re in a dangerous zone — high workload with low energy. Pushing harder will lead to diminishing returns and potential burnout.';
      suggestedAction = 'Triage immediately: identify the 20% of tasks that produce 80% of results. Do ONLY those. For the rest, delegate, defer, or drop. Work in short bursts (25 min on, 10 min rest).';
      reasoning = 'When energy is low, efficiency drops exponentially. Pareto-prioritization ensures your limited energy goes to maximum-impact tasks.';
    } else if (hasWorkload) {
      priority = 'high';
      opinion = 'Heavy workload requires ruthless prioritization, not longer hours. Working more without prioritizing just creates busywork.';
      suggestedAction = 'Use the Eisenhower Matrix: separate tasks into Urgent+Important (do now), Important+Not Urgent (schedule), Urgent+Not Important (delegate), Neither (eliminate). Focus only on quadrant 1 and 2.';
      reasoning = 'Most people spend time on urgent-but-unimportant tasks. The Eisenhower Matrix forces you to distinguish between truly important work and reactive busywork.';
    } else if (hasStudy) {
      priority = 'medium';
      opinion = 'Passive studying (re-reading, highlighting) creates an illusion of learning. Active recall and spaced repetition are 3x more effective.';
      suggestedAction = 'Switch to active study methods: use the Feynman Technique (explain concepts simply), do practice problems, and use spaced repetition (Anki). Study in 50-minute blocks.';
      reasoning = 'Cognitive science is clear: active retrieval builds stronger neural pathways than passive review. Quality of study time > quantity.';
    } else {
      opinion = 'To maximize output, focus on high-leverage activities. Ask yourself: "What\'s the ONE thing that, if done, makes everything else easier?"';
      suggestedAction = 'Identify your Most Important Task (MIT) for the day and complete it before anything else. Protect your peak energy hours (usually morning) for this task.';
      reasoning = 'The "ONE Thing" principle ensures that even on chaotic days, you\'ve moved the needle on what matters most.';
    }

    return { opinion, suggestedAction, reasoning, priority };
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
