// ============================================
// LIFE OS — Health Agent ❤️
// ============================================

import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'tired', 'sleep', 'rest', 'health', 'exercise', 'gym', 'run', 'walk',
  'stress', 'anxiety', 'mental', 'burnout', 'exhaust', 'sick', 'headache',
  'eat', 'diet', 'nutrition', 'water', 'hydrat', 'break', 'relax',
  'overwhelm', 'depressed', 'sad', 'happy', 'energy', 'fatigue', 'pain',
  'weight', 'meditat', 'yoga', 'stretch', 'posture', 'eye strain',
  'screen time', 'caffeine', 'alcohol', 'smoke'
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
  }

  analyze(input, context) {
    const lower = input.toLowerCase();
    const hasFatigue = /tired|exhaust|fatigue|no energy|drain|sleepy|burn/.test(lower);
    const hasSleep = /sleep|insomnia|late night|wake up|nap|rest/.test(lower);
    const hasStress = /stress|anxiety|overwhelm|panic|worry|nervous|tense/.test(lower);
    const hasMentalHealth = /depress|sad|lonely|lost|hopeless|empty|unmotivat/.test(lower);
    const hasExercise = /exercise|gym|workout|run|walk|fit|active|sport/.test(lower);
    const hasWorkConflict = /work|study|exam|deadline|project|assignment/.test(lower);

    let opinion, suggestedAction, reasoning;
    let priority = 'medium';

    if (hasFatigue && hasWorkConflict) {
      priority = 'high';
      opinion = '⚠️ CONFLICT WITH PRODUCTIVITY: Your body is sending clear signals that it needs recovery. Pushing through fatigue doesn\'t produce quality work — it produces mistakes and extends recovery time.';
      suggestedAction = 'Take a 20-minute power nap (set an alarm!) or do a 10-minute walk outside. Then return to work with a reduced scope — focus only on the absolute minimum needed. Tonight, prioritize 7+ hours of sleep.';
      reasoning = 'Cognitive performance drops 25% after just one night of poor sleep. A short recovery now will yield better output than 3 hours of exhausted work.';
    } else if (hasFatigue) {
      priority = 'high';
      opinion = 'Fatigue is your body\'s non-negotiable signal. Ignoring it leads to compounding performance debt that takes days to recover from.';
      suggestedAction = 'Immediate: get sunlight and hydrate (dehydration mimics fatigue). Short-term: take a 20-min nap. Long-term: audit your sleep schedule — are you getting 7-9 hours consistently?';
      reasoning = 'Most chronic fatigue comes from sleep debt, dehydration, or lack of movement. Addressing these basics often eliminates the problem entirely.';
    } else if (hasStress) {
      priority = 'high';
      opinion = 'Chronic stress literally rewires your brain for anxiety. This needs immediate intervention, not "pushing through."';
      suggestedAction = 'Right now: try box breathing (4 sec inhale, 4 sec hold, 4 sec exhale, 4 sec hold) for 5 rounds. Today: take a 30-minute nature walk. This week: identify your top 3 stressors and eliminate or reduce one.';
      reasoning = 'Box breathing activates the parasympathetic nervous system. Nature exposure reduces cortisol by 12%. Both are evidence-based stress interventions.';
    } else if (hasMentalHealth) {
      priority = 'high';
      opinion = 'What you\'re feeling is valid. Mental health isn\'t something to "power through" — it requires the same care as a physical injury.';
      suggestedAction = 'Don\'t isolate — reach out to someone you trust today. Start with one small act of self-care (walk, shower, sunlight). If these feelings persist, consider speaking to a mental health professional.';
      reasoning = 'Social connection and basic self-care are the foundation of mental health recovery. Small actions create upward spirals.';
    } else if (hasSleep) {
      priority = 'medium';
      opinion = 'Sleep is the single highest-leverage health activity. Every other optimization (diet, exercise, focus) depends on quality sleep.';
      suggestedAction = 'Set a non-negotiable bedtime. 1 hour before: no screens (or use Night Shift). 30 min before: dim lights and read or journal. Keep your room cool (65-68°F/18-20°C) and dark.';
      reasoning = 'Sleep hygiene habits compound over time. The "no screens before bed" rule alone can improve sleep quality by 30%.';
    } else if (hasExercise) {
      priority = 'medium';
      opinion = 'Exercise is the most powerful and underutilized intervention for both physical and mental health. Even 20 minutes makes a measurable difference.';
      suggestedAction = 'Start with what you enjoy — walking counts. Aim for 150 minutes/week of moderate activity. If motivation is low, stack it with something fun (music, podcasts, social exercise).';
      reasoning = 'Exercise releases BDNF (brain-derived neurotrophic factor), which improves memory, focus, and mood. It\'s literally the best "productivity hack."';
    } else {
      opinion = 'Health should be treated as infrastructure, not a nice-to-have. When your body works well, everything else gets easier.';
      suggestedAction = 'Quick health audit: Did you sleep 7+ hours? Drink enough water? Move your body today? Eat real food? Address whichever is missing first.';
      reasoning = 'The four pillars of health (sleep, hydration, movement, nutrition) handle 80% of how you feel. Start there before optimizing anything else.';
    }

    return { opinion, suggestedAction, reasoning, priority };
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
