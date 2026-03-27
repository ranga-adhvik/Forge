// ============================================
// LIFE OS — Learning Agent 📚
// ============================================

import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'learn', 'study', 'course', 'book', 'read', 'skill', 'knowledge',
  'understand', 'concept', 'tutorial', 'practice', 'exam', 'test',
  'certif', 'education', 'school', 'college', 'university', 'class',
  'homework', 'assignment', 'research', 'topic', 'subject', 'teach',
  'master', 'beginner', 'advanced', 'coding', 'programming', 'math',
  'science', 'language', 'writing', 'creative'
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
  }

  analyze(input, context) {
    const lower = input.toLowerCase();
    const hasExam = /exam|test|quiz|assessment|final|midterm/.test(lower);
    const hasNewSkill = /learn|new skill|pick up|start|beginner|basics/.test(lower);
    const hasCourse = /course|tutorial|program|bootcamp|certif/.test(lower);
    const hasStruggle = /understand|confused|hard|difficult|stuck|don't get/.test(lower);
    const hasFatigue = /tired|exhaust|burnout|drain|can't focus/.test(lower);

    let opinion, suggestedAction, reasoning;
    let priority = 'medium';

    if (hasExam && hasFatigue) {
      priority = 'high';
      opinion = '⚠️ CONFLICT WITH HEALTH AGENT: Cramming while exhausted has diminishing returns. Your brain consolidates memories during sleep — studying without rest is like pouring water into a bucket with holes.';
      suggestedAction = 'Strategic study: focus ONLY on high-probability exam topics (past papers, professor hints). Use active recall (close book, test yourself). Study for 30-min max, then take a 15-min rest. Sleep at least 6 hours before the exam.';
      reasoning = 'Active recall in short bursts is 4x more effective than re-reading. Sleep is critical for memory consolidation — an extra hour of sleep beats an extra hour of study.';
    } else if (hasExam) {
      priority = 'high';
      opinion = 'Exam prep should be strategic, not just hard work. The Pareto principle applies: 20% of the material covers 80% of the exam.';
      suggestedAction = 'Review past exams to identify patterns. Focus on key concepts, formulas, and frequently tested topics. Use the Feynman Technique: explain each concept as if teaching a 10-year-old. If you can\'t explain it simply, you don\'t understand it well enough.';
      reasoning = 'Pattern recognition from past exams is the highest-leverage study strategy. Combined with active recall, it maximizes score per hour of study.';
    } else if (hasNewSkill) {
      priority = 'medium';
      opinion = 'Learning a new skill follows an S-curve: slow start, rapid progress, then plateau. The beginning is the hardest — don\'t quit during the "valley of despair."';
      suggestedAction = 'Use the "20-Hour Rule": focused, deliberate practice for 20 hours to get past the frustration barrier. Break the skill into sub-skills, practice the most important ones first, and remove barriers to practice.';
      reasoning = 'Josh Kaufman\'s research shows you can get reasonably good at any skill in 20 hours of deliberate practice. The key is structured, focused practice — not passive consumption.';
    } else if (hasCourse) {
      priority = 'medium';
      opinion = 'Courses provide structure, but completion rates are under 15%. The value of a course is in the doing, not the watching.';
      suggestedAction = 'Before starting: set a clear learning goal (what specific thing will you be able to DO after this course?). During: take notes, build projects, teach others. Set a deadline for completion.';
      reasoning = 'Goal-oriented learning is 3x more effective than exploratory learning. Having a concrete "build this project" goal ensures you retain and apply knowledge.';
    } else if (hasStruggle) {
      priority = 'high';
      opinion = 'Struggling with a concept means you\'re at the edge of your knowledge — this is exactly where growth happens. Don\'t avoid the discomfort.';
      suggestedAction = 'Apply the Feynman Technique: (1) Write the concept in simple words. (2) Identify where you get stuck. (3) Go back to the source and fill the gap. (4) Simplify and use analogies. If still stuck after 30 min, ask someone or find a different explanation.';
      reasoning = 'Confusion is a prerequisite for learning. The Feynman Technique systematically reveals knowledge gaps and forces deep understanding.';
    } else {
      opinion = 'Continuous learning is the highest-ROI investment you can make. But learning without application creates an illusion of progress.';
      suggestedAction = 'Apply the "Learn → Build → Teach" framework. For every concept you learn, build something with it and explain it to someone. This triples retention compared to passive reading.';
      reasoning = 'The learning pyramid shows: reading retains 10%, practice retains 75%, teaching retains 90%. Be a practitioner, not just a consumer.';
    }

    return { opinion, suggestedAction, reasoning, priority };
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
