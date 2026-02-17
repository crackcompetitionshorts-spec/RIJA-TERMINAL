
export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SessionData {
  session1: OHLC; // 9:15 - 12:30
  session2: OHLC; // 12:30 - 15:30
  dataSource: 'manual' | 'excel' | 'google_sheet'; // Toggle for data source
  excelZones: Zone[]; // Parsed zones from Excel
  googleSheetId: string; // The ID extracted from the Google Sheet URL
}

export interface Zone {
  level: number;
  type: 'demand' | 'supply' | 'neural';
  percentage: number; // The deviation from pivot
  label?: string; // Custom name for neural zones
  ruleId?: string; // specific link to the brain rule
  color?: string;
}

export interface NeuralRule {
  id: string;
  name: string; // e.g., "Golden Pocket"
  base: 'pivot1' | 'pivot2' | 'average'; // Expanded to support Average
  value: number; // The numerical offset
  unit: 'percent' | 'points'; // Support for absolute points
  direction: 'add' | 'subtract'; // add = above, subtract = below
  color: string;
  isActive: boolean;
}

export interface LogicRule {
  id: string;
  content: string; // Plain text rule/principle
  isActive: boolean;
}

export interface CalculatedLevels {
  pivot1: number;
  pivot2: number;
  bias: 'BUY' | 'SELL' | 'NEUTRAL';
  demandZones: Zone[];
  supplyZones: Zone[];
  neuralZones: Zone[]; // Zones derived specifically from admin rules
  allZonesSorted: Zone[]; // Master list for UI rendering
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
