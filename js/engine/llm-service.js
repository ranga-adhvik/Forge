// ============================================
// LIFE OS — LLM API Service (Featherless AI)
// ============================================

export class LLMService {
  static getApiKey() {
    return localStorage.getItem('lifeos_featherless_key') || 'rc_50fa9bf4a8110b557c50446f1a41ba0cbfa680980196a74b4efa92bdb536e856';
  }

  static setApiKey(key) {
    localStorage.setItem('lifeos_featherless_key', key);
  }

  /**
   * Main function to call Featherless AI API (OpenAI compatible)
   * @param {string} prompt 
   * @returns {Promise<any>} Parsed JSON Object
   */
  static async generate(prompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("Missing Featherless API Key. Please add it to your settings.");
    }

    const url = 'https://api.featherless.ai/v1/chat/completions';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct", // Open-source model supported by featherless
          messages: [
            { role: "system", content: "You are a helpful assistant that only responds in raw, valid JSON. Do not return code blocks or markdown backticks." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Featherless API Error (${response.status}): ${errData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No candidates returned from Featherless API");
      }

      const text = data.choices[0].message.content;
      
      try {
        return JSON.parse(text);
      } catch (e) {
        // Fallback robust json extraction if model ignored json_object formatting instruction
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw e;
      }

    } catch (e) {
      console.error("LLM Generation failed:", e);
      throw e;
    }
  }
}
