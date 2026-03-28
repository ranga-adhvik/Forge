// ============================================
// LIFE OS — UI Renderer
// ============================================

export class Renderer {
  constructor() {
    this.outputContainer = document.getElementById('output-container');
    this.processingEl = document.getElementById('processing-state');
    this.emptyStateEl = document.getElementById('empty-state');
    this.outputSection = document.getElementById('output-section');
  }

  showEmptyState() {
    if (this.emptyStateEl) this.emptyStateEl.style.display = 'flex';
    if (this.outputContainer) this.outputContainer.style.display = 'none';
    if (this.processingEl) this.processingEl.style.display = 'none';
  }

  showProcessing(agentMetas) {
    if (this.emptyStateEl) this.emptyStateEl.style.display = 'none';
    if (this.outputContainer) this.outputContainer.style.display = 'none';
    if (this.processingEl) {
      this.processingEl.style.display = 'flex';
      const dotsContainer = this.processingEl.querySelector('.processing__agents');
      if (dotsContainer) {
        dotsContainer.innerHTML = agentMetas
          .map(a => `<div class="processing__agent-dot" style="background: ${a.color};" title="${a.name}"></div>`)
          .join('');
      }
    }
  }

  updateProcessingText(text) {
    const el = this.processingEl?.querySelector('.processing__text');
    if (el) el.textContent = text;
  }

  updateAgentStatus(agentKey, status) {
    const el = document.querySelector(`.agent-roster__item[data-agent="${agentKey}"] .agent-roster__status`);
    if (el) {
      el.className = 'agent-roster__status ' + status;
    }
  }

  renderOutput(output) {
    if (this.processingEl) this.processingEl.style.display = 'none';
    if (this.emptyStateEl) this.emptyStateEl.style.display = 'none';
    if (this.outputContainer) this.outputContainer.style.display = 'flex';

    this.outputContainer.innerHTML = '';

    // 1. Intent section
    this.outputContainer.appendChild(this.createSectionHeader('Intent Identified'));
    this.outputContainer.appendChild(this.createIntentCard(output.intent));

    // 2. Context section
    if (output.context.interactionCount > 0) {
      this.outputContainer.appendChild(this.createSectionHeader('Context Used'));
      this.outputContainer.appendChild(this.createContextCard(output));
    }

    // 3. Agent Opinions
    this.outputContainer.appendChild(this.createSectionHeader(`Agent Opinions (${output.agentResults.length} agents)`));
    this.outputContainer.appendChild(this.createOpinionsGrid(output.agentResults));

    // 4. Tradeoff Analysis
    if (output.tradeoffs.conflicts.length > 0) {
      this.outputContainer.appendChild(this.createSectionHeader('Tradeoff Analysis'));
      this.outputContainer.appendChild(this.createTradeoffCard(output.tradeoffs));
    }

    // 5. Final Decision
    this.outputContainer.appendChild(this.createSectionHeader('Final Decision'));
    this.outputContainer.appendChild(this.createDecisionCard(output.decision));

    // 6. Autonomous Action
    this.outputContainer.appendChild(this.createSectionHeader('Autonomous Action'));
    this.outputContainer.appendChild(this.createActionCard(output.decision.autonomousAction));

    // Animate entrance
    this.outputContainer.classList.add('anim-stagger');

    // Scroll to output
    this.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset agent roster statuses
    document.querySelectorAll('.agent-roster__status').forEach(el => {
      el.className = 'agent-roster__status';
    });

    // Set active agents in roster
    output.activatedAgents.forEach(a => {
      this.updateAgentStatus(a.key, 'active');
    });
  }

  createSectionHeader(title) {
    const div = document.createElement('div');
    div.className = 'section-header';
    div.innerHTML = `
      <span class="section-header__line"></span>
      <span class="section-header__title">${title}</span>
      <span class="section-header__line"></span>
    `;
    return div;
  }

  createIntentCard(intent) {
    const div = document.createElement('div');
    div.className = 'intent-card glass';
    div.id = 'intent-output';
    div.innerHTML = `
      <div class="intent-card__content">
        <div class="intent-card__icon">🎯</div>
        <div class="intent-card__text">
          <h4>${intent.primaryIntent.label}</h4>
          <p>${intent.summary}</p>
        </div>
      </div>
    `;
    return div;
  }

  createContextCard(output) {
    const div = document.createElement('div');
    div.className = 'context-card glass';
    div.id = 'context-output';

    const tags = [];
    tags.push(`<span class="badge badge--blue">Interactions: ${output.context.interactionCount}</span>`);
    if (output.context.hasRecurringPatterns) {
      tags.push(`<span class="badge badge--violet">Recurring Patterns Detected</span>`);
    }
    if (output.memoryResult) {
      const memResult = output.memoryResult.result;
      if (memResult.priority === 'medium') {
        tags.push(`<span class="badge badge--pink">Memory Context Active</span>`);
      }
    }

    div.innerHTML = `
      <div class="intent-card__content">
        <div class="intent-card__icon">🧠</div>
        <div class="intent-card__text">
          <h4>Memory Context</h4>
          <div class="context-tags">${tags.join('')}</div>
        </div>
      </div>
    `;
    return div;
  }

  createOpinionsGrid(agentResults) {
    const grid = document.createElement('div');
    grid.className = 'opinions-grid anim-stagger';
    grid.id = 'opinions-output';

    agentResults.forEach(result => {
      const card = document.createElement('div');
      card.className = 'agent-card glass';
      card.setAttribute('data-agent', result.agent.key);
      card.id = `agent-card-${result.agent.key}`;

      const priorityClass = `agent-card__priority--${result.priority}`;
      card.innerHTML = `
        <div class="agent-card__header">
          <div class="agent-card__emoji">${result.agent.emoji}</div>
          <div class="agent-card__title">
            <div class="agent-card__name">${result.agent.name}</div>
            <div class="agent-card__role">${result.agent.role}</div>
          </div>
          <span class="agent-card__priority ${priorityClass}">${result.priority.toUpperCase()}</span>
        </div>
        <div class="agent-card__body">
          ${this.generateDynamicAgentSections(result.data)}
        </div>
      `;

      grid.appendChild(card);
    });

    return grid;
  }

  generateDynamicAgentSections(data) {
    if (!data) return '<p class="agent-card__section-text">No data.</p>';
    
    let html = '';
    
    for (const [key, value] of Object.entries(data)) {
      if (key === 'priority' || key === 'error') continue;
      
      const label = key.replace(/_/g, ' ');
      
      // If it's an action or solution, make it pop
      if (key === 'action' || key === 'solution' || key === 'advice' || key === 'recommended') {
        html += `
          <div class="agent-card__action">
            <strong style="text-transform: uppercase; font-size: 0.7em; display:block; margin-bottom:4px; opacity:0.7;">${label}</strong>
            ${typeof value === 'object' ? JSON.stringify(value) : value}
          </div>
        `;
      } else {
        html += `
          <div class="agent-card__section">
            <span class="agent-card__section-label">${label}</span>
            <div class="agent-card__section-text">
              ${Array.isArray(value) ? '<ul>' + value.map(i => '<li>' + i + '</li>').join('') + '</ul>' : 
                 (typeof value === 'object' ? JSON.stringify(value) : '<p>' + value + '</p>')}
            </div>
          </div>
        `;
      }
    }
    
    if (data.error) {
      html += `
        <div class="agent-card__section">
           <span class="agent-card__section-label" style="color:#ef4444">Error</span>
           <p class="agent-card__section-text" style="color:#ef4444">${data.error}</p>
        </div>
      `;
    }

    return html;
  }

  createTradeoffCard(tradeoffs) {
    const div = document.createElement('div');
    div.className = 'tradeoff-card glass';
    div.id = 'tradeoff-output';

    let conflictsHtml = '';
    tradeoffs.conflicts.forEach(c => {
      conflictsHtml += `
        <div class="tradeoff-item">
          <div class="tradeoff-item__agent">
            <span>${c.agentA.emoji} ${c.agentA.name}</span>
          </div>
          <span class="tradeoff-item__vs">VS</span>
          <div class="tradeoff-item__agent">
            <span>${c.agentB.emoji} ${c.agentB.name}</span>
          </div>
        </div>
        <div style="padding: 0 16px; margin-top: -8px; margin-bottom: 8px;">
          <p style="font-size: 13px; color: var(--text-tertiary); font-style: italic;">${c.description}</p>
        </div>
      `;
    });

    let sacrificesHtml = '';
    if (tradeoffs.sacrifices.length > 0) {
      sacrificesHtml = `
        <div style="margin-top: 16px; padding: 12px 16px; background: rgba(244, 63, 94, 0.05); border-radius: 8px; border: 1px solid rgba(244, 63, 94, 0.1);">
          <span class="agent-card__section-label" style="color: var(--accent-rose);">What's Being Sacrificed</span>
          <ul style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
            ${tradeoffs.sacrifices.map(s => `<li style="font-size: 13px; color: var(--text-secondary); padding-left: 16px; position: relative;"><span style="position: absolute; left: 0;">→</span>${s}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    div.innerHTML = `
      <div class="tradeoff-list">${conflictsHtml}</div>
      ${sacrificesHtml}
    `;

    return div;
  }

  createDecisionCard(decision) {
    const div = document.createElement('div');
    div.className = 'decision-card glass active';
    div.id = 'decision-output';

    let reasoningText = decision.reasoning;
    try {
      const parsed = JSON.parse(decision.reasoning);
      if (typeof parsed === 'object' && parsed !== null) {
        reasoningText = Object.values(parsed)
          .flat()
          .map(str => typeof str === 'string' ? str.replace(/^[+-]\s*/, '') : str)
          .join('. ') + '.';
        reasoningText = reasoningText.replace(/\.\./g, '.');
      }
    } catch(e) {}

    let finalDec = decision.finalDecision || '';
    if (typeof finalDec === 'string') {
      finalDec = finalDec.replace(/\bOption [AB]\b/g, '').replace(/\b[AB]\b/g, '').replace(/[:\-]/g, '').trim();
    }
    if (!finalDec) {
      finalDec = 'Recommended path selected based on analysis.';
    }

    div.innerHTML = `
      <div class="decision-card__header">
        <span style="font-size: 1.5rem;">⚖️</span>
        <h3 class="gradient-text">Final Decision</h3>
      </div>
      <p style="font-size: 15px; line-height: 1.7; color: var(--text-primary);">${finalDec}</p>
      <div style="margin-top: 16px; padding: 12px 16px; background: var(--bg-glass); border-radius: 8px;">
        <span class="agent-card__section-label">Reasoning</span>
        <p style="margin-top: 6px; font-size: 13px; line-height: 1.6; color: var(--text-secondary);">${reasoningText}</p>
      </div>
    `;

    return div;
  }

  createActionCard(action) {
    const div = document.createElement('div');
    div.className = 'glass';
    div.id = 'action-output';
    div.innerHTML = `
      <div class="decision-card__action">
        <div class="decision-card__action-label">🚀 System Action</div>
        <div class="decision-card__action-text">${action}</div>
      </div>
    `;
    div.style.padding = 'var(--space-lg)';
    return div;
  }
}
