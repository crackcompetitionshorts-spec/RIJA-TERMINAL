
import React, { useState, useMemo, useEffect } from 'react';
import { calculateLevels } from './services/calculationService';
import { storageService } from './services/storageService';
import { APP_NAME } from './constants';
import { SessionData, NeuralRule, LogicRule } from './types';
import { AdminPanel } from './components/AdminPanel';
import { ChatBot } from './components/ChatBot';
import { BauhausButton, BauhausCard, BauhausTag } from './components/ui/BauhausComponents';
import { RijaAvatar } from './components/RijaAvatar';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { BarChart, ArrowUp, ArrowDown, Activity, Lock, Brain, Home, Layers, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State: 'landing' -> 'loading' -> 'terminal'
  const [currentView, setCurrentView] = useState<'landing' | 'loading' | 'terminal'>('landing');

  // Initialize from Storage
  const [sessionData, setSessionData] = useState<SessionData>(storageService.loadData);
  const [neuralRules, setNeuralRules] = useState<NeuralRule[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);
  const [aiInstruction, setAiInstruction] = useState<string>(storageService.loadBrain);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initial load of rules
  useEffect(() => {
    setNeuralRules(storageService.loadRules());
    setLogicRules(storageService.loadLogic());
  }, []);

  // Recalculate whenever data or rules change
  const levels = useMemo(() => calculateLevels(sessionData, neuralRules), [sessionData, neuralRules]);

  const handleDataUpdate = (newData: SessionData) => {
    setSessionData(newData);
    storageService.saveData(newData);
    // Reload rules in case they were updated in admin panel
    setNeuralRules(storageService.loadRules());
    setLogicRules(storageService.loadLogic());
  };

  const handleInstructionUpdate = (newInstructions: string) => {
    setAiInstruction(newInstructions);
    storageService.saveBrain(newInstructions);
  };

  // --- TRANSITION HANDLER ---
  const handleEnterSystem = () => {
    setCurrentView('loading');
    // Wait 2.5 seconds for the smoother "Boot Sequence"
    setTimeout(() => {
      setCurrentView('terminal');
    }, 2500);
  };

  // --- RENDER: LANDING PAGE ---
  if (currentView === 'landing') {
    return <LandingPage onEnter={handleEnterSystem} />;
  }

  // --- RENDER: LOADING SCREEN ---
  if (currentView === 'loading') {
    return <LoadingScreen />;
  }

  // --- RENDER: MAIN TERMINAL ---
  return (
    <div className="min-h-screen pb-10 md:pb-20 bg-rh-black text-white font-sans selection:bg-rh-green selection:text-black">
      {/* Navbar - Dark Glass */}
      <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-rh-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('landing')}>
             <RijaAvatar size="sm" />
             <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                {APP_NAME}
             </h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rh-green rounded-full animate-pulse shadow-[0_0_10px_#00C805]"></div>
             <span className="text-[10px] md:text-xs font-bold text-rh-green uppercase tracking-widest">Market Live</span>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 space-y-8 md:space-y-12">
        
        {/* Header Section: Pivots & Bias */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Bias Card */}
          <div className="md:col-span-4">
             <div className="h-full rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-rh-border/50 shadow-soft relative overflow-hidden group">
                <div className="absolute inset-0 bg-rh-surface z-0"></div>
                {/* Dynamic Gradient Background based on bias */}
                <div className={`absolute inset-0 z-0 opacity-10 transition-opacity duration-500 ${levels.bias === 'BUY' ? 'bg-gradient-to-tr from-rh-green to-transparent' : levels.bias === 'SELL' ? 'bg-gradient-to-tr from-rh-red to-transparent' : 'bg-gradient-to-tr from-gray-700 to-transparent'}`}></div>

                <div className="relative z-10">
                  <h2 className="text-rh-subtext font-medium text-xs uppercase tracking-wider mb-2">Market Structure Bias</h2>
                  <div className="flex items-center gap-3 md:gap-4">
                    {levels.bias === 'BUY' ? <TrendingUp size={32} className="md:w-10 md:h-10 text-rh-green drop-shadow-[0_0_8px_rgba(0,200,5,0.8)]" /> : 
                     levels.bias === 'SELL' ? <TrendingUp size={32} className="md:w-10 md:h-10 text-rh-red rotate-180 drop-shadow-[0_0_8px_rgba(255,80,0,0.8)]" /> : 
                     <Activity size={32} className="md:w-10 md:h-10 text-gray-400" />}
                    <span className={`text-4xl md:text-5xl font-bold tracking-tighter ${levels.bias === 'BUY' ? 'text-rh-green' : levels.bias === 'SELL' ? 'text-rh-red' : 'text-white'}`}>
                      {levels.bias}
                    </span>
                  </div>
                </div>
                <div className="relative z-10 mt-6 md:mt-8 pt-4 border-t border-white/10">
                  <p className="text-xs md:text-sm font-medium text-gray-400">
                    {levels.bias === 'BUY' ? 'Longs Favored. Price > Structure.' : levels.bias === 'SELL' ? 'Shorts Favored. Price < Structure.' : 'Choppy. Wait for breakout.'}
                  </p>
                </div>
             </div>
          </div>

          {/* Pivots Card */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
             <BauhausCard title="Institutional Anchor">
               <div className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                 {levels.pivot1.toFixed(2)}
               </div>
               <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rh-green w-3/4 rounded-full opacity-50"></div>
               </div>
               <p className="mt-4 text-rh-subtext font-medium text-xs md:text-sm">Primary Structure Base. Validating heavy volume nodes.</p>
             </BauhausCard>
             <BauhausCard title="Operator Trigger">
               <div className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                 {levels.pivot2.toFixed(2)}
               </div>
               <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rh-green w-1/2 rounded-full opacity-50"></div>
               </div>
               <p className="mt-4 text-rh-subtext font-medium text-xs md:text-sm">Active Manipulation Point. Key liquidity sweep level.</p>
             </BauhausCard>
          </div>
        </section>

        {/* Zones Section */}
        <section>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Institutional Zones</h2>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rh-red shadow-[0_0_8px_rgba(255,80,0,0.6)]"></span>
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rh-green shadow-[0_0_8px_rgba(0,200,5,0.6)]"></span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                {/* Supply Stack */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="font-bold text-rh-subtext text-[10px] md:text-xs uppercase tracking-wider">Supply / Resistance</h3>
                    <BarChart className="text-rh-red w-4 h-4" />
                  </div>
                  {levels.supplyZones.map((zone, i) => (
                    <div 
                      key={i} 
                      className="bg-rh-surface border border-rh-border/50 rounded-2xl p-4 md:p-5 flex justify-between items-center hover:bg-rh-surfaceHighlight transition-all group cursor-default"
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-rh-red group-hover:shadow-[0_0_10px_rgba(255,80,0,0.8)] transition-shadow"></div>
                           <div className="flex flex-col">
                              <span className="font-mono font-bold text-lg md:text-xl text-white tracking-tight">{zone.level.toFixed(2)}</span>
                              <span className="text-[9px] md:text-[10px] font-bold text-rh-subtext uppercase tracking-widest group-hover:text-rh-red transition-colors">{zone.label || 'SUPPLY ZONE'}</span>
                           </div>
                        </div>
                        {zone.type === 'neural' && (
                           <Brain size={16} className="text-rh-green" />
                        )}
                    </div>
                  ))}
                </div>

                {/* Demand Stack */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="font-bold text-rh-subtext text-[10px] md:text-xs uppercase tracking-wider">Demand / Support</h3>
                    <BarChart className="text-rh-green w-4 h-4 rotate-180" />
                  </div>
                  {levels.demandZones.map((zone, i) => (
                    <div 
                      key={i} 
                      className="bg-rh-surface border border-rh-border/50 rounded-2xl p-4 md:p-5 flex justify-between items-center hover:bg-rh-surfaceHighlight transition-all group cursor-default"
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-rh-green group-hover:shadow-[0_0_10px_rgba(0,200,5,0.8)] transition-shadow"></div>
                           <div className="flex flex-col">
                              <span className="font-mono font-bold text-lg md:text-xl text-white tracking-tight">{zone.level.toFixed(2)}</span>
                              <span className="text-[9px] md:text-[10px] font-bold text-rh-subtext uppercase tracking-widest group-hover:text-rh-green transition-colors">{zone.label || 'DEMAND ZONE'}</span>
                           </div>
                        </div>
                        {zone.type === 'neural' && (
                           <Brain size={16} className="text-rh-green" />
                        )}
                    </div>
                  ))}
                </div>

              </div>
        </section>

        {/* AI SECTION */}
        <ChatBot 
          levels={levels} 
          systemInstruction={aiInstruction} 
          logicRules={logicRules}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Footer info */}
        <section className="text-center pt-8 md:pt-12 border-t border-rh-border/30">
          <p className="font-bold text-[9px] md:text-[10px] text-rh-subtext uppercase tracking-widest mb-2">RIJA TERMINAL V1.0 - QUANTITATIVE ARCHITECTURE</p>
          <p className="font-mono text-[9px] md:text-[10px] text-gray-600">Sync: {levels.lastUpdated}</p>
        </section>

      </main>

      {/* Modals & Overlays */}
      {isAdminOpen && (
        <AdminPanel 
          currentData={sessionData}
          aiInstructions={aiInstruction}
          onUpdateData={handleDataUpdate}
          onUpdateInstructions={handleInstructionUpdate}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
