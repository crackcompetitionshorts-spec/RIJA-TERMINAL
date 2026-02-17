
import { SessionData, NeuralRule, LogicRule } from '../types';
import { DEFAULT_SESSION_DATA, DEFAULT_AI_INSTRUCTION } from '../constants';

const KEYS = {
  DATA: 'RIJA_TERMINAL_DATA_V1',
  BRAIN: 'RIJA_AI_BRAIN_V2', // Updated to V2 to force new super-intelligent persona
  CORTEX: 'RIJA_CORTEX_RULES_V1',
  LOGIC: 'RIJA_LOGIC_RULES_V1'
};

export const storageService = {
  saveData: (data: SessionData) => {
    try {
      localStorage.setItem(KEYS.DATA, JSON.stringify(data));
    } catch (e) {
      console.error("Memory Core Write Error", e);
    }
  },

  loadData: (): SessionData => {
    try {
      const stored = localStorage.getItem(KEYS.DATA);
      if (!stored) return DEFAULT_SESSION_DATA;
      
      const parsed = JSON.parse(stored);
      // CRITICAL: Merge with default to ensure new fields (like googleSheetId) exist even if old data is loaded
      return { ...DEFAULT_SESSION_DATA, ...parsed };
    } catch (e) {
      return DEFAULT_SESSION_DATA;
    }
  },

  saveBrain: (instructions: string) => {
    try {
      localStorage.setItem(KEYS.BRAIN, instructions);
    } catch (e) {
      console.error("Neural Pathway Write Error", e);
    }
  },

  loadBrain: (): string => {
    try {
      const stored = localStorage.getItem(KEYS.BRAIN);
      return stored || DEFAULT_AI_INSTRUCTION;
    } catch (e) {
      return DEFAULT_AI_INSTRUCTION;
    }
  },

  saveRules: (rules: NeuralRule[]) => {
    try {
      localStorage.setItem(KEYS.CORTEX, JSON.stringify(rules));
    } catch (e) {
      console.error("Cortex Sync Error", e);
    }
  },

  loadRules: (): NeuralRule[] => {
    try {
      const stored = localStorage.getItem(KEYS.CORTEX);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveLogic: (rules: LogicRule[]) => {
    try {
      localStorage.setItem(KEYS.LOGIC, JSON.stringify(rules));
    } catch (e) {
      console.error("Logic Sync Error", e);
    }
  },

  loadLogic: (): LogicRule[] => {
    try {
      const stored = localStorage.getItem(KEYS.LOGIC);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }
};
