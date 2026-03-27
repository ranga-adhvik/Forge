// ============================================
// LIFE OS — Main Application Controller
// ============================================

import { PlannerAgent } from './agents/planner-agent.js';
import { ProductivityAgent } from './agents/productivity-agent.js';
import { HealthAgent } from './agents/health-agent.js';
import { FinanceAgent } from './agents/finance-agent.js';
import { LearningAgent } from './agents/learning-agent.js';
import { DecisionAgent } from './agents/decision-agent.js';
import { MemoryAgent } from './agents/memory-agent.js';
import { DecisionFlow } from './engine/decision-flow.js';
import { MemoryStore } from './memory/memory-store.js';
import { Renderer } from './ui/renderer.js';
import { Toast } from './ui/toast.js';
import { ParticleSystem } from './ui/particles.js';

class LifeOS {
  constructor() {
    // Initialize memory
    this.memoryStore = new MemoryStore();

    // Initialize agents
    this.agents = {
      planner: new PlannerAgent(),
      productivity: new ProductivityAgent(),
      health: new HealthAgent(),
      finance: new FinanceAgent(),
      learning: new LearningAgent(),
      decision: new DecisionAgent(),
      memory: new MemoryAgent(this.memoryStore),
    };

    // Initialize engine
    this.decisionFlow = new DecisionFlow(this.agents, this.memoryStore);

    // Initialize UI
    this.renderer = new Renderer();
    this.toast = new Toast();
    this.particles = new ParticleSystem();

    // State
    this.isProcessing = false;

    // Bind DOM
    this.textarea = document.getElementById('user-input');
    this.submitBtn = document.getElementById('submit-btn');
    this.sidebarToggle = document.getElementById('sidebar-toggle');
    this.sidebar = document.getElementById('sidebar');
    this.clearMemoryBtn = document.getElementById('clear-memory');

    this.init();
  }

  init() {
    // Show empty state
    this.renderer.showEmptyState();

    // Update memory stats
    this.updateMemoryStats();

    // Bind events
    this.submitBtn.addEventListener('click', () => this.handleSubmit());

    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    // Sidebar toggle (mobile)
    if (this.sidebarToggle) {
      this.sidebarToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('open');
      });
    }

    // Clear memory
    if (this.clearMemoryBtn) {
      this.clearMemoryBtn.addEventListener('click', () => {
        this.memoryStore.clear();
        this.updateMemoryStats();
        this.toast.show('Memory cleared', 'success');
      });
    }

    // Example prompts
    document.querySelectorAll('.example-prompt').forEach(el => {
      el.addEventListener('click', () => {
        this.textarea.value = el.textContent;
        this.textarea.focus();
      });
    });

    // Update greeting based on time
    this.updateGreeting();

    // Toast welcome
    const stats = this.memoryStore.getStats();
    if (stats.interactions === 0) {
      this.toast.show('Welcome to Life OS — your personal intelligence layer', 'agent', 5000);
    } else {
      this.toast.show(`Welcome back — ${stats.interactions} interactions remembered`, 'agent', 3000);
    }
  }

  async handleSubmit() {
    const input = this.textarea.value.trim();
    if (!input || this.isProcessing) return;

    this.isProcessing = true;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<span class="spinner-sm"></span> Processing...';

    // Get all agent metas for the processing animation
    const allMetas = Object.values(this.agents).map(a => a.getMeta());

    // Show processing state
    this.renderer.showProcessing(allMetas);

    try {
      const output = await this.decisionFlow.process(input, (step, detail) => {
        this.handleStep(step, detail);
      });

      // Render output
      this.renderer.renderOutput(output);

      // Update memory stats
      this.updateMemoryStats();

      // Clear input
      this.textarea.value = '';

      // Toast
      this.toast.show(`Analysis complete — ${output.agentResults.length} agents contributed`, 'success');

    } catch (error) {
      console.error('Life OS Error:', error);
      this.toast.show('An error occurred during analysis', 'error');
      this.renderer.showEmptyState();
    }

    this.isProcessing = false;
    this.submitBtn.disabled = false;
    this.submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      Analyze
    `;
  }

  handleStep(step, detail) {
    switch (step) {
      case 'parsing':
        this.renderer.updateProcessingText('🎯 Identifying intent...');
        break;
      case 'routing':
        this.renderer.updateProcessingText('🔀 Activating relevant agents...');
        break;
      case 'analyzing':
        this.renderer.updateProcessingText('🧠 Agents analyzing your input...');
        break;
      case 'agent-thinking':
        const agent = this.agents[detail];
        if (agent) {
          this.renderer.updateProcessingText(`${agent.emoji} ${agent.name} is thinking...`);
          this.renderer.updateAgentStatus(detail, 'thinking');
        }
        break;
      case 'tradeoffs':
        this.renderer.updateProcessingText('⚔️ Analyzing tradeoffs...');
        break;
      case 'deciding':
        this.renderer.updateProcessingText('⚖️ Making final decision...');
        break;
      case 'complete':
        this.renderer.updateProcessingText('✅ Analysis complete');
        break;
    }
  }

  updateMemoryStats() {
    const stats = this.memoryStore.getStats();

    const interactionsEl = document.getElementById('stat-interactions');
    const decisionsEl = document.getElementById('stat-decisions');
    const memorySizeEl = document.getElementById('stat-memory-size');
    const headerInteractions = document.getElementById('header-interactions');

    if (interactionsEl) interactionsEl.textContent = stats.interactions;
    if (decisionsEl) decisionsEl.textContent = stats.decisions;
    if (memorySizeEl) memorySizeEl.textContent = this.formatBytes(stats.memorySize);
    if (headerInteractions) headerInteractions.textContent = stats.interactions;
  }

  updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting-text');
    const subtextEl = document.getElementById('greeting-subtext');

    if (!greetingEl) return;

    let greeting, subtext;
    if (hour < 6) {
      greeting = 'Late Night Session';
      subtext = 'Remember — rest is productive too';
    } else if (hour < 12) {
      greeting = 'Good Morning';
      subtext = 'Your peak cognitive hours — use them wisely';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
      subtext = 'Stay focused — the day is still young';
    } else if (hour < 21) {
      greeting = 'Good Evening';
      subtext = 'Time to wind down and plan for tomorrow';
    } else {
      greeting = 'Good Night';
      subtext = 'Consider wrapping up — sleep is your superpower';
    }

    greetingEl.textContent = greeting;
    if (subtextEl) subtextEl.textContent = subtext;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  window.lifeOS = new LifeOS();
});
