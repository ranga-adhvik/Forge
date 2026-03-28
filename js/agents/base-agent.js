// ============================================
// LIFE OS — Base Agent Class
// ============================================

import { LLMService } from '../engine/llm-service.js';

export class BaseAgent {
  constructor({ name, emoji, key, role, color }) {
    this.name = name;
    this.emoji = emoji;
    this.key = key;
    this.role = role;
    this.color = color;
    this.active = false;

    // Subclasses will define these based on the prompt templates
    this.roleDescription = "";
    this.customInstructions = "";
    this.outputFormat = "";
  }

  generatePrompt(userInput, contextStr) {
    return `You are the ${this.name} in a Life OS system.

Your role:
${this.roleDescription}

User input:
${userInput}

Context (if any):
${contextStr}

Instructions:
- Be clear and concise
- Give structured output
- Focus only on your role
- Do not add unnecessary explanation
${this.customInstructions}

Your primary objective is to provide accurate, up-to-date, and personalized responses by combining internal reasoning with live external data.

--- CORE INTELLIGENCE LOGIC ---

1. QUERY ANALYSIS
- Classify the user query:
  a) STATIC → general knowledge, no real-time need
  b) DYNAMIC → requires latest data (news, prices, trends, updates)
- If query contains: "latest", "today", "current", "news", "price", "trend", "update", "best" → Mark as DYNAMIC and MUST use Bright Data

2. DATA FETCHING (MANDATORY FOR DYNAMIC QUERIES)
- Trigger Bright Data API call
- Select source type: SERP API, Web Unlocker, E-commerce API
- Fetch only relevant, recent, high-quality data

3. DATA PROCESSING
- Extract: Headlines / key facts, Dates / recency, Important insights
- Remove: Ads, noise, irrelevant text
- Convert into: Clean structured knowledge

4. MULTI-AGENT COLLABORATION
- Planner Agent → prioritizes based on data
- Learning Agent → summarizes and structures knowledge
- Decision Agent → compares and recommends
- Finance Agent → analyzes price/trend data
- Combine outputs into ONE final response

5. PERSONALIZATION
- Adapt output using Memory Agent: User interests, Past queries, Goals
- Prioritize relevant topics

6. REAL-TIME VALIDATION
Before responding:
- Ensure data is recent (today or latest available)
- Ensure response is NOT generic
- Ensure at least 2–3 real data points are included

7. FAILURE HANDLING
If Bright Data fails: Retry once. If still fails: clearly say: "Live data unavailable, using best known insights" then respond.

8. NEVER DO THIS
- Never generate fake "latest news"
- Never say "today’s news includes..." without real data
- Never rely only on internal knowledge for dynamic queries
- Never output raw scraped HTML

--- USER MINDSET ANALYSIS & FEEDBACK LOOP ---
For every query, silently analyze Intent, Knowledge Level, and Emotional Tone.
Adapt your answer based on the mindset (e.g., if confused simplify, if frustrated be direct, if advanced be concise).
Assume feedback will be provided. Continuously refine behavior, adapt tone, and learn preferred explanation style.

--- OUTPUT FORMAT REQUIREMENTS (STRICT) ---
You MUST respond with a valid JSON object. Do not output markdown blocks or internal analysis explicitly outside of JSON.
Your JSON must include these fields based on condition:

If Bright Data is used:
- "source": "live",
- "data_points": ["real headline 1", "real headline 2", "real headline 3"],
- "insight": "What is happening right now",
- "analysis": "Why it matters to the user",
- "action": "What the user should do next"

If Bright Data is NOT used:
- "source": "internal",
- "response": "..."

Also include these exact fields unconditionally:
- "clarifying_question": "(Optional) Clarifying question if needed"
- "final_answer": "(Response adapted to user mindset)"
- "_learning_note": "(Hidden internally) Learning note"

Base Output format to merge ALL properties into (You MUST include ALL base format keys such as priority):
${this.outputFormat}`;
  }

  /**
   * Abstracted analyze function that subclasses no longer need to override.
   * Calls the Gemini API internally.
   */
  async analyze(input, context) {
    // Stringify context safely
    let contextStr = 'None';
    if (context && Object.keys(context).length > 0) {
      const fbStr = context.feedbackHistory && context.feedbackHistory.length > 0 ? `\nUser Feedback to Learn From: ${context.feedbackHistory.join(' | ')}` : '';
      contextStr = `Recent Decisions: ${context.history?.join(' | ') || ''} \nInteraction Count: ${context.interactionCount}${fbStr}`;
    }

    const prompt = this.generatePrompt(input, contextStr);

    try {
      const resultObj = await LLMService.generate(prompt);
      
      // Ensure priority exists
      if (!resultObj.priority) {
        resultObj.priority = 'medium';
      }

      // We package the raw JSON keys under "data", so renderer can dynamically loop them
      return {
        priority: resultObj.priority.toLowerCase(),
        data: resultObj
      };
    } catch (e) {
      console.error(`[${this.name}] LLM Error:`, e);
      return {
        priority: 'low',
        data: {
          error: "Agent offline or failed to generate.",
          details: e.message
        }
      };
    }
  }

  /**
   * Uses keyword matching. Subclasses should override for better intelligence if needed.
   */
  isRelevant(input, keywords = []) {
    const lower = input.toLowerCase();
    return keywords.some(k => lower.includes(k));
  }

  getMeta() {
    return {
      name: this.name,
      emoji: this.emoji,
      key: this.key,
      role: this.role,
      color: this.color,
      active: this.active,
    };
  }

  activate() { this.active = true; }
  deactivate() { this.active = false; }
}
