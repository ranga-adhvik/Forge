// ============================================
// LIFE OS — Memory Store (LocalStorage)
// ============================================

const STORAGE_KEY = 'lifeos_memory';

export class MemoryStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('MemoryStore: Failed to load from localStorage', e);
    }

    return this.getDefaults();
  }

  getDefaults() {
    return {
      interactionCount: 0,
      history: [],
      pastDecisions: [],
      feedbackHistory: [],
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      preferences: {},
      goals: [],
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('MemoryStore: Failed to save to localStorage', e);
    }
  }

  getContext() {
    return {
      ...this.data,
      daysSinceFirstUse: this.getDaysSince(this.data.firstSeen),
    };
  }

  addInteraction(input) {
    this.data.interactionCount++;
    this.data.history.push(input);
    this.data.lastSeen = new Date().toISOString();

    // Keep only last 50 interactions
    if (this.data.history.length > 50) {
      this.data.history = this.data.history.slice(-50);
    }

    this.save();
  }

  addDecision(decision) {
    this.data.pastDecisions.push(decision);

    // Keep only last 30 decisions
    if (this.data.pastDecisions.length > 30) {
      this.data.pastDecisions = this.data.pastDecisions.slice(-30);
    }

    this.save();
  }

  addFeedback(feedback) {
    if (!this.data.feedbackHistory) this.data.feedbackHistory = [];
    this.data.feedbackHistory.push(feedback);
    if (this.data.feedbackHistory.length > 20) {
      this.data.feedbackHistory = this.data.feedbackHistory.slice(-20);
    }
    this.save();
  }

  addGoal(goal) {
    this.data.goals.push({
      text: goal,
      created: new Date().toISOString(),
      completed: false,
    });
    this.save();
  }

  setPreference(key, value) {
    this.data.preferences[key] = value;
    this.save();
  }

  getStats() {
    return {
      interactions: this.data.interactionCount,
      decisions: this.data.pastDecisions.length,
      goals: this.data.goals.length,
      daysSinceFirstUse: this.getDaysSince(this.data.firstSeen),
      memorySize: new Blob([JSON.stringify(this.data)]).size,
    };
  }

  getDaysSince(dateStr) {
    const then = new Date(dateStr);
    const now = new Date();
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
  }

  clear() {
    this.data = this.getDefaults();
    this.save();
  }
}
