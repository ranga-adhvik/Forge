// ============================================
// LIFE OS — Decision Flow Orchestrator
// ============================================

import { IntentParser } from './intent-parser.js';
import { AgentRouter } from './agent-router.js';
import { TradeoffEngine } from './tradeoff-engine.js';

export class DecisionFlow {
  constructor(agents, memoryStore) {
    this.agents = agents; // { key: agentInstance }
    this.intentParser = new IntentParser();
    this.agentRouter = new AgentRouter(agents);
    this.tradeoffEngine = new TradeoffEngine();
    this.memoryStore = memoryStore;
  }

  /**
   * Process user input through the full decision pipeline.
   * @param {string} input
   * @param {function} onStep - Callback for each step (for UI updates)
   * @returns {Promise<object>} Full decision output
   */
  async process(input, onStep = () => {}) {
    const context = this.memoryStore.getContext();

    // Step 1: Parse intent
    onStep('parsing', 'Identifying intent...');
    const parsedIntent = this.intentParser.parse(input);
    await this.delay(400);

    // Step 2: Route to agents
    onStep('routing', 'Activating agents...');
    const activatedAgents = this.agentRouter.route(parsedIntent, input);
    await this.delay(300);

    // Step 3: Collect agent opinions (simulated parallel)
    onStep('analyzing', 'Agents analyzing...');
    const agentResults = [];

    for (const agent of activatedAgents) {
      if (agent.key === 'decision') continue; // Decision agent runs last

      onStep('agent-thinking', agent.key);
      await this.delay(200 + Math.random() * 300);

      const result = agent.analyze(input, context);
      agentResults.push({ agent, result });
    }

    // Step 4: Tradeoff analysis
    onStep('tradeoffs', 'Analyzing tradeoffs...');
    const tradeoffs = this.tradeoffEngine.analyze(agentResults);
    await this.delay(400);

    // Step 5: Decision Agent resolves
    onStep('deciding', 'Making final decision...');
    const decisionAgent = this.agents.decision;
    const finalDecision = decisionAgent.resolve(agentResults, input, context);
    await this.delay(500);

    // Store decision in memory
    this.memoryStore.addDecision(finalDecision.finalDecision);

    // Build complete output
    const output = {
      input,
      timestamp: new Date().toISOString(),
      intent: parsedIntent,
      activatedAgents: activatedAgents.map(a => a.getMeta()),
      agentResults: agentResults.filter(r => r.agent.key !== 'memory').map(r => ({
        agent: r.agent.getMeta(),
        ...r.result,
      })),
      memoryResult: agentResults.find(r => r.agent.key === 'memory'),
      tradeoffs,
      decision: finalDecision,
      context: {
        interactionCount: context.interactionCount,
        hasRecurringPatterns: context.history && context.history.length > 3,
      },
    };

    onStep('complete', 'Done');
    return output;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
