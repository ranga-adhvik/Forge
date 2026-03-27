// ============================================
// LIFE OS — Finance Agent 💰
// ============================================

import { BaseAgent } from './base-agent.js';

const KEYWORDS = [
  'money', 'spend', 'buy', 'purchase', 'cost', 'price', 'budget',
  'save', 'invest', 'expense', 'income', 'salary', 'afford', 'cheap',
  'expensive', 'debt', 'loan', 'credit', 'subscription', 'pay',
  'financial', 'rent', 'bill', 'course', 'tool', 'software', 'app',
  'worth', 'value', 'free', 'premium', 'upgrade'
];

export class FinanceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Finance Agent',
      emoji: '💰',
      key: 'finance',
      role: 'Budget & Savings',
      color: '#10b981',
    });
  }

  analyze(input, context) {
    const lower = input.toLowerCase();
    const hasPurchase = /buy|purchase|get|subscribe|sign up|enroll|upgrade/.test(lower);
    const hasCourse = /course|class|program|bootcamp|certification|tutorial|learn/.test(lower);
    const hasSaving = /save|budget|cut|reduce|minimize|frugal/.test(lower);
    const hasInvest = /invest|stock|crypto|fund|return|compound|portfolio/.test(lower);
    const hasDebt = /debt|loan|owe|credit|payment|installment/.test(lower);
    const hasExpensive = /expensive|costly|afford|price|worth it/.test(lower);

    let opinion, suggestedAction, reasoning;
    let priority = 'medium';

    if (hasPurchase && hasCourse) {
      priority = 'medium';
      opinion = '⚠️ POTENTIAL CONFLICT WITH LEARNING AGENT: Before paying for a course, verify that free alternatives don\'t cover the same material. 90% of knowledge is available free online.';
      suggestedAction = 'Research free alternatives first (YouTube, MIT OpenCourseWare, freeCodeCamp, Khan Academy). If the paid course offers unique value (mentorship, certification, structure), do a cost-per-hour analysis to check if it\'s worth it.';
      reasoning = 'The information in most paid courses exists freely elsewhere. You\'re paying for curation and structure — which is valuable, but only if you\'ll actually complete it. Check your course completion history first.';
    } else if (hasPurchase) {
      priority = 'medium';
      opinion = 'Apply the 48-hour rule: if it\'s not urgent, wait 48 hours before purchasing. Most impulse buys lose their appeal.';
      suggestedAction = 'Before buying, answer: (1) Do I need this or want this? (2) What\'s the cost-per-use? (3) Can I find it cheaper or free? (4) Will this matter in 30 days?';
      reasoning = 'The 48-hour rule eliminates ~70% of impulse purchases. Cost-per-use analysis reveals the true value of a purchase.';
    } else if (hasDebt) {
      priority = 'high';
      opinion = 'Debt is a financial emergency that compounds against you. Every day with high-interest debt is a day you\'re losing money.';
      suggestedAction = 'Use the Avalanche method: list all debts, order by interest rate (highest first), pay minimum on all except the highest. Throw every extra dollar at the highest-interest debt.';
      reasoning = 'The Avalanche method minimizes total interest paid. It\'s mathematically optimal, even if the Snowball method feels more motivating.';
    } else if (hasSaving) {
      priority = 'medium';
      opinion = 'Saving isn\'t about deprivation — it\'s about intention. Automate your savings so it happens before you have a chance to spend.';
      suggestedAction = 'Set up automatic transfers: move 20% of income to savings on payday (before spending). Track expenses for 1 week to identify "money leaks" (subscriptions, impulse buys, convenience purchases).';
      reasoning = 'Automation removes willpower from the equation. Most people find 15-25% of their spending is on things they don\'t even notice.';
    } else if (hasInvest) {
      priority = 'medium';
      opinion = 'Investing is the most powerful wealth-building tool, but only if you\'re consistent. Time in market beats timing the market.';
      suggestedAction = 'Start with index funds (S&P 500 / total market) — they outperform 90% of active managers. Invest a fixed amount monthly regardless of market conditions.';
      reasoning = 'Dollar-cost averaging reduces risk and removes emotion from investing. Start early and let compound interest do the heavy lifting.';
    } else if (hasExpensive) {
      priority = 'low';
      opinion = 'The cheapest option isn\'t always the best value. Think in terms of cost-per-use and long-term ROI.';
      suggestedAction = 'Calculate the total cost of ownership, not just the purchase price. A quality item used daily for years is cheaper per-use than a cheap item replaced multiple times.';
      reasoning = 'The "buy cheap, buy twice" principle applies to most durable goods. For consumables and trendy items, go cheap.';
    } else {
      opinion = 'Financial health comes from awareness. Most people don\'t know where their money actually goes.';
      suggestedAction = 'Do a 5-minute financial check-in: review your last 10 transactions. Are they aligned with your priorities? Cancel any subscriptions you haven\'t used in 30 days.';
      reasoning = 'Regular financial awareness prevents drift. Most financial problems start small and compound over time.';
    }

    return { opinion, suggestedAction, reasoning, priority };
  }

  checkRelevance(input) {
    return this.isRelevant(input, KEYWORDS);
  }
}
