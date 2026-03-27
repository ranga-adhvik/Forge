// ============================================
// LIFE OS — Decision Agent ⚖️
// ============================================

import { BaseAgent } from './base-agent.js';

export class DecisionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Decision Agent',
      emoji: '⚖️',
      key: 'decision',
      role: 'Conflict Resolution',
      color: '#06b6d4',
    });
  }

  /**
   * The Decision Agent doesn't analyze input directly.
   * It resolves conflicts between other agents.
   * @param {object[]} agentResults - Array of { agent, result } from other agents
   * @param {string} input - Original user input
   * @param {object} context - Memory context
   * @returns {{ finalDecision: string, reasoning: string, autonomousAction: string }}
   */
  resolve(agentResults, input, context) {
    const conflicts = this.detectConflicts(agentResults);
    const priorities = this.rankPriorities(agentResults, context);

    let finalDecision, reasoning, autonomousAction;

    if (conflicts.length > 0) {
      const resolution = this.resolveConflict(conflicts, priorities, context);
      finalDecision = resolution.decision;
      reasoning = resolution.reasoning;
      autonomousAction = resolution.action;
    } else {
      // No conflict — synthesize the best advice
      const topAgent = priorities[0];
      finalDecision = `Based on analysis, the ${topAgent.agent.name}'s recommendation takes priority: ${topAgent.result.suggestedAction}`;
      reasoning = `No conflicts detected. The ${topAgent.agent.name} has the highest relevance and priority for your current situation.`;
      autonomousAction = this.generateAction(topAgent, input, context);
    }

    return { finalDecision, reasoning, autonomousAction };
  }

  detectConflicts(agentResults) {
    const conflicts = [];
    const conflictPairs = [
      { a: 'productivity', b: 'health', type: 'Work vs Rest' },
      { a: 'finance', b: 'learning', type: 'Save vs Invest in Education' },
      { a: 'productivity', b: 'learning', type: 'Execute vs Learn' },
      { a: 'planner', b: 'health', type: 'Structure vs Flexibility' },
    ];

    const resultMap = {};
    agentResults.forEach(({ agent, result }) => {
      resultMap[agent.key] = { agent, result };
    });

    conflictPairs.forEach(pair => {
      if (resultMap[pair.a] && resultMap[pair.b]) {
        const aResult = resultMap[pair.a].result;
        const bResult = resultMap[pair.b].result;

        // Detect conflict based on priority levels and known tension patterns
        const hasTension = (aResult.priority === 'high' && bResult.priority === 'high') ||
          (aResult.opinion && aResult.opinion.includes('CONFLICT'));
        
        if (hasTension) {
          conflicts.push({
            type: pair.type,
            agentA: resultMap[pair.a],
            agentB: resultMap[pair.b],
          });
        }
      }
    });

    return conflicts;
  }

  rankPriorities(agentResults, context) {
    const priorityWeights = { high: 3, medium: 2, low: 1 };

    return [...agentResults].sort((a, b) => {
      const weightA = priorityWeights[a.result.priority] || 1;
      const weightB = priorityWeights[b.result.priority] || 1;
      return weightB - weightA;
    });
  }

  resolveConflict(conflicts, priorities, context) {
    const mainConflict = conflicts[0];
    const { agentA, agentB, type } = mainConflict;

    // Decision rules based on conflict types
    const rules = {
      'Work vs Rest': () => {
        if (agentB.result.priority === 'high') {
          return {
            decision: `Balance both: Take a strategic rest break (20-min power nap or 15-min walk), then return to work with a focused, reduced-scope plan. Your health agent flagged critical fatigue that will undermine work quality if ignored.`,
            reasoning: `The Health Agent detected high-priority fatigue signals. Research shows that working through exhaustion produces 40% more errors and takes 50% longer. A short recovery period actually increases net output.`,
            action: `Creating an adjusted schedule: 20-min rest → 45-min focused work → 10-min break → repeat. Only the most critical tasks for today. Full rest tonight (7+ hours sleep).`,
          };
        }
        return {
          decision: `Prioritize the work with built-in recovery: use the Pomodoro technique (25 min work / 5 min rest) to maintain both productivity and health. Schedule a proper rest period after the critical work is done.`,
          reasoning: `Work is urgent but health isn't yet critical. The Pomodoro technique provides a middle ground — structured breaks prevent burnout while maintaining forward momentum.`,
          action: `Starting a Pomodoro schedule with health check-ins every 2 hours. Setting a hard stop time for the evening.`,
        };
      },
      'Save vs Invest in Education': () => {
        return {
          decision: `Research free alternatives first. If the paid option offers genuine unique value (mentorship, certification, structured accountability), treat it as an investment with an expected ROI — but set a budget cap. If free alternatives cover 80% of the content, start there.`,
          reasoning: `The Finance Agent rightly flags that most course content is available free. But the Learning Agent recognizes that structure and accountability have real value. The compromise: exhaust free resources first, then invest strategically.`,
          action: `Compiling a list of free resources for this topic. If they're insufficient after 1 week, we'll evaluate the paid option with a cost-benefit analysis.`,
        };
      },
      'Execute vs Learn': () => {
        return {
          decision: `Learn just enough to execute. Don't do a comprehensive study — learn the minimum viable knowledge to start building. You'll learn more by doing than by studying.`,
          reasoning: `Productivity and learning aren't actually opposed — they're sequential. The fastest learners are those who alternate between learning and building (the "Learn-Build" loop).`,
          action: `Setting up a "Learn-Build" cycle: 30-min study → 60-min application → identify gaps → repeat.`,
        };
      },
      'Structure vs Flexibility': () => {
        return {
          decision: `Create a flexible structure: plan your top 3 priorities but leave 30% of your day unscheduled for rest and spontaneity. Rigid schedules break under health pressure.`,
          reasoning: `The Planner Agent wants structure for consistency, but the Health Agent recognizes that over-scheduling causes stress. A "flexible framework" gives direction without rigidity.`,
          action: `Building a flexible daily template with fixed priorities but open buffer blocks.`,
        };
      },
    };

    const resolver = rules[type];
    if (resolver) {
      return resolver();
    }

    // Default resolution
    return {
      decision: `Both perspectives have merit. Prioritize the higher-priority agent's advice while incorporating safeguards from the other.`,
      reasoning: `When agents conflict, we weight the recommendation with higher urgency while ensuring the other agent's concerns aren't completely ignored.`,
      action: `Creating a balanced action plan that addresses both agents' core concerns.`,
    };
  }

  generateAction(topResult, input, context) {
    const { agent, result } = topResult;
    return `Implementing ${agent.name}'s recommendation: ${result.suggestedAction}. This will be tracked in your memory for follow-up.`;
  }

  // Decision agent is always relevant when there are multiple agents
  checkRelevance() {
    return true;
  }

  analyze(input, context) {
    return {
      opinion: 'I resolve conflicts between other agents. I\'ll provide the final decision after all agents weigh in.',
      suggestedAction: 'Waiting for other agents to complete analysis...',
      reasoning: 'The Decision Agent operates as a meta-agent that synthesizes outputs from all other active agents.',
      priority: 'medium',
    };
  }
}
