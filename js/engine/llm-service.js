// ============================================
// LIFE OS — LLM API Proxy Service (Secure)
// ============================================

export class LLMService {
  /**
   * Main function to call Express Backend to proxy via Featherless AI
   * @param {string} prompt 
   * @param {number} retries - Exponential backoff retry counter
   * @returns {Promise<any>} Parsed JSON Object
   */
  static async generate(prompt, retries = 3) {
    // Reroute fetch from hardcoded external featherless.ai directly to local Express backend.
    const url = '/api/llm';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const status = response.status;
        const msg = errData.error || response.statusText;

        // Handle rate limiting & timeouts with Backoff Retry Mechanism
        if ((status === 429 || status >= 500) && retries > 0) {
          console.warn(`[LLMService] Rate Limit/Error (${status}). Retrying in 2 seconds... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.generate(prompt, retries - 1);
        }

        throw new Error(`API Error (${status}): ${msg}`);
      }

      const data = await response.json();

      // Navigate OpenAI style responses gracefully
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No responses received from LLM Model.");
      }

      const text = data.choices[0].message.content;

      try {
        return JSON.parse(text);
      } catch (e) {
        // Fallback JSON strict parsing if model hallucinated code blocks or text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error("Failed to parse LLM Response as valid JSON.");
      }

    } catch (e) {
      console.error("LLM Generation critical failure:", e);
      throw e;
    }
  }
}
