
import { SessionData, CalculatedLevels, Zone, NeuralRule } from '../types';
import { ZONE_PERCENTAGES } from '../constants';

const ZONE_LABELS: Record<number, string> = {
  0.2611: "OPERATOR TRAP",
  0.50:   "INSTITUTIONAL WALL",
  0.7389: "BANK LEVEL",
  1.00:   "VOLATILITY CAP"
};

export const calculateLevels = (data: SessionData, rules: NeuralRule[] = []): CalculatedLevels => {
  const { session1, session2, dataSource, excelZones } = data;

  // Pivot Calculation: (H + L + C) / 3
  const pivot1 = (session1.high + session1.low + session1.close) / 3;
  const pivot2 = (session2.high + session2.low + session2.close) / 3;
  const pivotAvg = (pivot1 + pivot2) / 2;

  // Structural Bias
  let bias: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  if (pivot2 > pivot1) bias = 'BUY';
  else if (pivot2 < pivot1) bias = 'SELL';

  // Lists to hold all zones
  const demandZones: Zone[] = [];
  const supplyZones: Zone[] = [];
  const neuralZones: Zone[] = [];

  // --- STANDARD ZONES ---
  ZONE_PERCENTAGES.forEach((pct) => {
    const label = ZONE_LABELS[pct] || "CRITICAL STRUCTURE";
    
    supplyZones.push({
      level: pivot2 * (1 + pct / 100),
      type: 'supply',
      percentage: pct,
      label: label // Descriptive label instead of just percentage
    });
    demandZones.push({
      level: pivot2 * (1 - pct / 100),
      type: 'demand',
      percentage: pct,
      label: label
    });
  });

  // --- NEURAL RULES (Manual/AI Logic) ---
  rules.forEach(rule => {
    if (!rule.isActive) return;

    let baseValue = pivot2;
    if (rule.base === 'pivot1') baseValue = pivot1;
    if (rule.base === 'average') baseValue = pivotAvg;

    let adjustment = 0;
    if (rule.unit === 'points') {
      adjustment = rule.value;
    } else {
      // Percentage
      adjustment = baseValue * (rule.value / 100);
    }

    let level = 0;
    if (rule.direction === 'add') {
      level = baseValue + adjustment;
    } else {
      level = baseValue - adjustment;
    }

    const zone: Zone = {
      level,
      type: 'neural',
      percentage: rule.unit === 'points' ? 0 : rule.value, 
      label: rule.name,
      ruleId: rule.id,
      color: rule.color
    };

    neuralZones.push(zone);

    if (level > pivot2) {
      supplyZones.push({ ...zone, type: 'supply', label: `[AI] ${rule.name}` });
    } else {
      demandZones.push({ ...zone, type: 'demand', label: `[AI] ${rule.name}` });
    }
  });

  // --- EXCEL ZONES (External Data) ---
  if (dataSource === 'excel' && excelZones && excelZones.length > 0) {
      excelZones.forEach(z => {
          // Add to Neural Zones list for AI awareness
          neuralZones.push(z);

          // Classify for UI lists based on level vs Pivot2
          if (z.level > pivot2) {
              supplyZones.push({ ...z, type: 'supply', label: `[XLS] ${z.label}` });
          } else {
              demandZones.push({ ...z, type: 'demand', label: `[XLS] ${z.label}` });
          }
      });
  }

  // Sort lists for display
  const sortDesc = (a: Zone, b: Zone) => b.level - a.level;
  
  supplyZones.sort(sortDesc);
  demandZones.sort(sortDesc);

  // Master List
  const allZonesSorted = [...supplyZones, ...demandZones].sort(sortDesc);

  return {
    pivot1,
    pivot2,
    bias,
    demandZones,
    supplyZones,
    neuralZones,
    allZonesSorted,
    lastUpdated: new Date().toLocaleTimeString(),
  };
};
