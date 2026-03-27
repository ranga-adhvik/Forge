// ============================================
// LIFE OS — Tradeoff Engine
// ============================================

export class TradeoffEngine {
  /**
   * Analyze agent results for tradeoffs and conflicts.
   * @param {Array<{agent: BaseAgent, result: object}>} agentResults
   * @returns {{ conflicts: object[], sacrifices: string[] }}
   */
  analyze(agentResults) {
    const conflicts = this.findConflicts(agentResults);
    const sacrifices = this.identifySacrifices(conflicts);

    return { conflicts, sacrifices };
  }

  findConflicts(agentResults) {
    const conflicts = [];
    const tensionMap = {
      'productivity-health': {
        dimension: 'Work vs Rest',
        description: 'Pushing for output conflicts with your body\'s need for recovery',
        icon: '⚡ vs ❤️',
      },
      'health-productivity': {
        dimension: 'Rest vs Work',
        description: 'Resting fully may delay critical deliverables',
        icon: '❤️ vs ⚡',
      },
      'finance-learning': {
        dimension: 'Saving vs Education Investment',
        description: 'Paying for education conflicts with saving goals',
        icon: '💰 vs 📚',
      },
      'learning-finance': {
        dimension: 'Investment vs Savings',
        description: 'Investing in growth conflicts with financial prudence',
        icon: '📚 vs 💰',
      },
      'productivity-planner': {
        dimension: 'Speed vs Structure',
        description: 'Moving fast may sacrifice planning and long-term thinking',
        icon: '⚡ vs 🧩',
      },
      'planner-health': {
        dimension: 'Structure vs Flexibility',
        description: 'Rigid scheduling may not accommodate health needs',
        icon: '🧩 vs ❤️',
      },
    };

    // Check each pair of agents for tension
    for (let i = 0; i < agentResults.length; i++) {
      for (let j = i + 1; j < agentResults.length; j++) {
        const a = agentResults[i];
        const b = agentResults[j];

        if (a.agent.key === 'decision' || a.agent.key === 'memory') continue;
        if (b.agent.key === 'decision' || b.agent.key === 'memory') continue;

        const pairKey = `${a.agent.key}-${b.agent.key}`;
        const reversePairKey = `${b.agent.key}-${a.agent.key}`;

        const tension = tensionMap[pairKey] || tensionMap[reversePairKey];

        if (tension && (a.result.priority === 'high' || b.result.priority === 'high')) {
          conflicts.push({
            ...tension,
            agentA: { name: a.agent.name, emoji: a.agent.emoji, key: a.agent.key, opinion: a.result.opinion },
            agentB: { name: b.agent.name, emoji: b.agent.emoji, key: b.agent.key, opinion: b.result.opinion },
          });
        }
      }
    }

    return conflicts;
  }

  identifySacrifices(conflicts) {
    const sacrifices = [];

    conflicts.forEach(conflict => {
      switch (conflict.dimension) {
        case 'Work vs Rest':
        case 'Rest vs Work':
          sacrifices.push('Short-term productivity may decrease to protect long-term health');
          sacrifices.push('Some deadlines may need to be adjusted or scope reduced');
          break;
        case 'Saving vs Education Investment':
        case 'Investment vs Savings':
          sacrifices.push('Monthly savings target may be temporarily reduced');
          sacrifices.push('The free alternative may require more time investment');
          break;
        case 'Speed vs Structure':
          sacrifices.push('Moving slower now to build a sustainable long-term system');
          break;
        case 'Structure vs Flexibility':
          sacrifices.push('Some scheduled tasks may need to be moved to accommodate recovery');
          break;
      }
    });

    // Remove duplicates
    return [...new Set(sacrifices)];
  }
}
