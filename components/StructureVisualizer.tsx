
import React, { useMemo } from 'react';
import { CalculatedLevels, Zone } from '../types';

interface StructureVisualizerProps {
  levels: CalculatedLevels;
}

export const StructureVisualizer: React.FC<StructureVisualizerProps> = ({ levels }) => {
  const { pivot1, pivot2, allZonesSorted } = levels;

  // Calculate range for scaling
  const maxPrice = useMemo(() => {
    const maxZone = Math.max(...allZonesSorted.map(z => z.level), pivot1, pivot2);
    return maxZone * 1.002; // +0.2% padding
  }, [allZonesSorted, pivot1, pivot2]);

  const minPrice = useMemo(() => {
    const minZone = Math.min(...allZonesSorted.map(z => z.level), pivot1, pivot2);
    return minZone * 0.998; // -0.2% padding
  }, [allZonesSorted, pivot1, pivot2]);

  const range = maxPrice - minPrice;

  // Helper to get % position from top
  const getPosition = (price: number) => {
    return ((maxPrice - price) / range) * 100;
  };

  return (
    <div className="bg-bauhaus-bg border-4 border-bauhaus-fg shadow-hard p-4 h-[600px] relative overflow-hidden flex flex-col">
      
      <div className="flex-1 relative border-l-2 border-r-2 border-bauhaus-fg/20 mx-4 mt-4">
        {/* Background Grid Lines */}
        {[0, 25, 50, 75, 100].map(p => (
            <div key={p} className="absolute w-full border-t border-bauhaus-fg/5" style={{ top: `${p}%` }}></div>
        ))}

        {/* Pivot 1: Institutional Anchor */}
        <div 
            className="absolute w-full border-t-4 border-dashed border-bauhaus-blue z-10 group"
            style={{ top: `${getPosition(pivot1)}%` }}
        >
            <div className="absolute right-0 -top-7 bg-bauhaus-blue text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Inst. Anchor
            </div>
             <div className="absolute left-0 -top-3 text-bauhaus-blue font-mono text-xs font-bold bg-bauhaus-bg px-1">
                {pivot1.toFixed(0)}
            </div>
        </div>

        {/* Pivot 2: Operator Trigger */}
        <div 
            className="absolute w-full border-t-4 border-dashed border-bauhaus-yellow z-10 group"
            style={{ top: `${getPosition(pivot2)}%` }}
        >
            <div className="absolute right-0 -top-7 bg-bauhaus-yellow text-bauhaus-fg text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Operator Trigger
            </div>
            <div className="absolute left-0 -top-3 text-bauhaus-yellow font-mono text-xs font-bold bg-bauhaus-bg px-1">
                {pivot2.toFixed(0)}
            </div>
        </div>

        {/* Render Zones */}
        {allZonesSorted.map((zone, i) => {
            const top = getPosition(zone.level);
            const isSupply = zone.type === 'supply';
            
            // Prevent rendering outside bounds visually
            if (top < 0 || top > 100) return null;

            return (
                <div 
                    key={i}
                    className={`absolute w-[80%] left-[10%] h-1 md:h-2 transition-all hover:w-[100%] hover:left-0 z-0 hover:z-20 cursor-help group ${
                        isSupply ? 'bg-bauhaus-red' : 'bg-bauhaus-blue'
                    }`}
                    style={{ 
                        top: `${top}%`,
                        backgroundColor: zone.color || (isSupply ? '#D02020' : '#1040C0')
                    }}
                >
                    {/* Tooltip Label */}
                    <div className={`
                        absolute ${isSupply ? 'bottom-2' : 'top-2'} left-1/2 -translate-x-1/2 
                        bg-bauhaus-fg text-white text-[10px] uppercase font-bold px-2 py-1 
                        whitespace-nowrap shadow-hard-sm opacity-0 group-hover:opacity-100 
                        pointer-events-none transition-opacity z-50
                    `}>
                        {zone.label} : {zone.level.toFixed(2)}
                    </div>
                </div>
            );
        })}

        {/* Current Context Gradient (Fake Price Action Feel) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bauhaus-fg/5 pointer-events-none"></div>

      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-bold uppercase text-gray-400">
          <span>{minPrice.toFixed(0)}</span>
          <span>RANGE VISUALIZER</span>
          <span>{maxPrice.toFixed(0)}</span>
      </div>
    </div>
  );
};
