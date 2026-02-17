
import React from 'react';
import { RijaAvatar } from './RijaAvatar';
import { Shield, BrainCircuit, BarChart3, ArrowUpRight, Star, StarHalf, Quote, CandlestickChart, Zap, Layers, Microscope, LineChart } from 'lucide-react';
import { GlowingEffectDemo } from './GlowingEffectDemo';

interface LandingPageProps {
  onEnter: () => void;
}

const testimonials = [
  { name: "Aarav Patel", role: "Nifty Option Buyer", rating: 5, text: "The volatility cap levels are insane. Caught the exact reversal at 21,500 today." },
  { name: "Aditi Sharma", role: "Quant Strategist", rating: 4.5, text: "Finally a terminal that respects logic over emotions. The neural zones are frighteningly accurate." },
  { name: "Rohan Kumar", role: "Scalper", rating: 5, text: "Fastest execution data I've seen. RIJA's bias helps me stay out of choppy markets." },
  { name: "Vihaan Gupta", role: "Swing Trader", rating: 4, text: "Clean interface. No clutter. Just pure price action structure." },
  { name: "Isha Malhotra", role: "F&O Analyst", rating: 5, text: "I stopped drawing my own support lines. RIJA's institutional anchors are better." },
  { name: "Kabir Singh", role: "Intraday Trader", rating: 4.5, text: "The operator trap warnings saved my capital twice this week. Worth every rupee." },
  { name: "Ananya Reddy", role: "BankNifty Trader", rating: 5, text: "It feels like having a hedge fund manager whispering in your ear. Exceptional." },
  { name: "Arjun Nair", role: "Technical Analyst", rating: 4, text: "Solid logic. The deterministic levels don't repaint, which is rare these days." }
];

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} size={14} className="fill-rh-green text-rh-green" />);
  }
  if (hasHalf) {
    stars.push(<StarHalf key="half" size={14} className="fill-rh-green text-rh-green" />);
  }
  const empty = 5 - Math.ceil(rating);
  for (let i = 0; i < empty; i++) {
    stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-800 fill-gray-800" />);
  }
  return <div className="flex gap-1">{stars}</div>;
};

// 3D Tool Card Component
const ToolCard = ({ icon: Icon, title, desc, transformClass }: { icon: any, title: string, desc: string, transformClass: string }) => (
  <div 
    className={`group transition-all duration-500 ease-out hover:z-50 md:hover:scale-110 md:hover:!transform-none ${transformClass}`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className="bg-rh-surface border border-rh-border/50 p-6 md:p-8 rounded-3xl w-full md:w-80 h-auto md:h-96 flex flex-col justify-between shadow-soft group-hover:shadow-[0_0_40px_rgba(0,200,5,0.15)] group-hover:border-rh-green/50 transition-all bg-opacity-95 backdrop-blur-sm">
       <div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-2xl flex items-center justify-center mb-6 border border-rh-border group-hover:border-rh-green text-rh-green transition-colors">
              <Icon size={24} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">{desc}</p>
       </div>
       <div className="w-full h-1 bg-black rounded-full overflow-hidden mt-6">
          <div className="h-full bg-rh-green w-1/4 group-hover:w-full transition-all duration-700 ease-in-out"></div>
       </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-rh-green selection:text-black">
      
      {/* Styles for Animations & 3D */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
        .perspective-container {
           perspective: 1200px;
        }
        .card-left {
           transform: rotateY(15deg) translateZ(-40px);
        }
        .card-right {
           transform: rotateY(-15deg) translateZ(-40px);
        }
        /* Mobile reset */
        @media (max-width: 768px) {
            .card-left, .card-right { transform: none; margin-bottom: 24px; }
            .perspective-container { perspective: none; }
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-4 py-6 md:px-12 md:py-8 max-w-7xl mx-auto z-50 relative">
         <div className="font-bold text-xl md:text-2xl tracking-tighter flex items-center gap-2">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-rh-green rounded-full shadow-[0_0_10px_#00C805]"></span>
            RIJA
         </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-40 flex flex-col items-center justify-center px-4 md:px-6">
        
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-rh-green/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

        <div className="z-10 flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 md:space-y-10">
           
           <div className="scale-125 md:scale-150 mb-4 md:mb-6">
               <RijaAvatar size="lg" state="thinking" />
           </div>

           <h1 className="text-5xl md:text-9xl font-bold tracking-tighter leading-none">
             Trading <br/>
             <span className="text-rh-green drop-shadow-[0_0_30px_rgba(0,200,5,0.3)]">Solved.</span>
           </h1>

           <p className="text-lg md:text-2xl font-medium max-w-2xl text-gray-400 leading-relaxed px-4">
             The only NIFTY analysis platform powered by <span className="text-white">deterministic structure</span> and <span className="text-white">private neural reasoning</span>.
           </p>

           <div className="pt-6 md:pt-8">
              <button 
                onClick={onEnter}
                className="group bg-rh-green text-black px-8 py-4 md:px-12 md:py-5 text-lg md:text-xl font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_20px_rgba(0,200,5,0.4)]"
              >
                 Launch Terminal <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* --- APP PREVIEW STYLE --- */}
      <section className="bg-rh-surface border-t border-rh-surfaceHighlight py-20 md:py-32 rounded-t-[3rem] md:rounded-t-[4rem] -mt-10 md:-mt-20 relative z-20">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                 <div className="bg-black border border-rh-border/50 p-8 md:p-10 rounded-3xl hover:border-rh-green/50 transition-colors duration-500 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-rh-green/10 text-rh-green rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                        <BarChart3 size={24} className="md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Deterministic Levels</h3>
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg">No repainting. Pure math based on institutional pivots and volatility caps. Precise to the tick.</p>
                 </div>
                 <div className="bg-black border border-rh-border/50 p-8 md:p-10 rounded-3xl hover:border-rh-green/50 transition-colors duration-500 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                        <BrainCircuit size={24} className="md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Neural Core</h3>
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg">A private AI companion that learns your trading logic. It doesn't just calculate; it thinks.</p>
                 </div>
                 <div className="bg-black border border-rh-border/50 p-8 md:p-10 rounded-3xl hover:border-rh-green/50 transition-colors duration-500 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-rh-red/10 text-rh-red rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                        <Shield size={24} className="md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Secure Environment</h3>
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg">Local execution. No data selling. A walled garden built for the serious institutional operator.</p>
                 </div>
             </div>
         </div>
      </section>

      {/* --- 3D TOOLS ECOSYSTEM --- */}
      <section className="py-20 md:py-32 bg-black relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(30,33,36,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,33,36,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center mb-16 md:mb-24">
                  <span className="text-rh-green font-bold tracking-[0.2em] uppercase text-xs mb-4 md:mb-6 block">The Ecosystem</span>
                  <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 md:mb-8">
                      Institutional <span className="text-white">Arsenal</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                      Beyond simple charts. RIJA provides a complete suite of quantitative instruments designed for the modern operator.
                  </p>
              </div>

              {/* 3D Container - Stacks on mobile */}
              <div className="perspective-container flex justify-center items-center py-4 md:py-10">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 w-full md:w-auto">
                      
                      <ToolCard 
                          icon={CandlestickChart} 
                          title="Volatility Architect" 
                          desc="Dynamic range calculation based on implied volatility nodes. Predicts expansion before it happens."
                          transformClass="card-left"
                      />

                      <ToolCard 
                          icon={Zap} 
                          title="Delta Spotter" 
                          desc="Real-time detection of aggressive market orders absorbing passive liquidity at key levels."
                          transformClass="z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black" 
                      />

                      <ToolCard 
                          icon={Layers} 
                          title="Structure Map" 
                          desc="Multi-timeframe fractals automatically plotted to show the true supply and demand stack."
                          transformClass="card-right"
                      />

                  </div>
              </div>
          </div>
      </section>

      {/* --- NEW: GLOWING GRID SYSTEM MODULES --- */}
      <section className="py-16 md:py-24 bg-black px-4 md:px-6">
         <div className="max-w-7xl mx-auto">
             <div className="text-left mb-10 md:mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">System <span className="text-rh-green">Modules</span></h2>
                 <p className="text-gray-400 max-w-xl text-base md:text-lg">
                   Each component of the architecture is isolated and optimized for maximum throughput.
                 </p>
             </div>
             <GlowingEffectDemo />
         </div>
      </section>

      {/* --- NEW: STOCK RESEARCH BANNER --- */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-black">
          <div className="max-w-6xl mx-auto">
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-rh-border/50 group bg-rh-surface">
                  
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rh-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"></div>
                  
                  {/* Content Container */}
                  <div className="relative z-10 p-8 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
                      
                      <div className="text-center md:text-left max-w-xl order-2 md:order-1">
                          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6 md:mb-8 border border-white/10 shadow-lg">
                              <Microscope size={14} className="text-rh-green" />
                              Coming Q3 2024
                          </div>
                          <h3 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tighter text-white">
                              Equity <span className="text-rh-green">Deep-Dive</span>
                          </h3>
                          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                              Fundamental analysis meets neural screening. Research stocks with the same rigorous precision as our Nifty architecture.
                          </p>
                      </div>

                      {/* Animated Graphic */}
                      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center flex-shrink-0 order-1 md:order-2">
                           {/* Orbit Rings */}
                           <div className="absolute inset-0 border border-rh-border/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                           <div className="absolute inset-8 border border-rh-border/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                           <div className="absolute inset-16 border border-rh-green/20 rounded-full animate-[spin_20s_linear_infinite]"></div>

                           {/* Center Icon */}
                           <div className="absolute inset-0 flex items-center justify-center">
                               <LineChart size={60} className="md:w-[80px] md:h-[80px] text-rh-green drop-shadow-[0_0_25px_rgba(0,200,5,0.6)]" />
                           </div>

                           {/* Floating Stock Tags */}
                           <div className="absolute bottom-4 right-0 md:bottom-12 bg-black/80 backdrop-blur border border-rh-border px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                               <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600 flex items-center justify-center text-[8px] md:text-[10px] font-bold">RIL</div>
                                  <div>
                                    <span className="block text-xs font-bold text-white">RELIANCE</span>
                                    <span className="block text-rh-green text-xs font-mono">+1.45%</span>
                                  </div>
                               </div>
                           </div>
                           <div className="absolute top-4 left-0 md:top-12 bg-black/80 backdrop-blur border border-rh-border px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-xl animate-bounce delay-700 duration-[4000ms]">
                               <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center text-[8px] md:text-[10px] font-bold">HDFC</div>
                                  <div>
                                    <span className="block text-xs font-bold text-white">HDFCBANK</span>
                                    <span className="block text-rh-red text-xs font-mono">-0.32%</span>
                                  </div>
                               </div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- TESTIMONIALS SECTION (3D SLIDE) --- */}
      <section className="py-16 md:py-24 bg-black overflow-hidden perspective-container relative border-t border-rh-surfaceHighlight">
         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
         
         <div className="text-center mb-10 md:mb-16 relative z-0">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Verified <span className="text-rh-green">Traders</span></h2>
         </div>

         {/* Row 1: Forward */}
         <div className="flex w-[300%] md:w-[200%] animate-marquee hover:[animation-play-state:paused] mb-6 md:mb-8">
             {[...testimonials, ...testimonials].map((t, i) => (
                 <div key={i} className="w-[300px] md:w-[450px] flex-shrink-0 px-3 md:px-4">
                     <div className="bg-rh-surface border border-rh-border/50 p-6 md:p-8 rounded-3xl h-full transform hover:scale-[1.02] hover:bg-rh-surfaceHighlight transition-all duration-300 shadow-soft">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h4 className="font-bold text-base md:text-lg text-white">{t.name}</h4>
                                 <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{t.role}</p>
                             </div>
                             <Quote size={16} className="text-rh-green opacity-50 md:w-5 md:h-5" />
                         </div>
                         <RatingStars rating={t.rating} />
                         <p className="mt-4 text-gray-400 leading-relaxed text-xs md:text-sm">"{t.text}"</p>
                     </div>
                 </div>
             ))}
         </div>

         {/* Row 2: Reverse */}
         <div className="flex w-[300%] md:w-[200%] animate-marquee-reverse hover:[animation-play-state:paused]">
             {[...testimonials.reverse(), ...testimonials].map((t, i) => (
                 <div key={i} className="w-[300px] md:w-[450px] flex-shrink-0 px-3 md:px-4">
                     <div className="bg-rh-surface border border-rh-border/50 p-6 md:p-8 rounded-3xl h-full transform hover:scale-[1.02] hover:bg-rh-surfaceHighlight transition-all duration-300 shadow-soft">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h4 className="font-bold text-base md:text-lg text-white">{t.name}</h4>
                                 <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{t.role}</p>
                             </div>
                             <Quote size={16} className="text-rh-green opacity-50 md:w-5 md:h-5" />
                         </div>
                         <RatingStars rating={t.rating} />
                         <p className="mt-4 text-gray-400 leading-relaxed text-xs md:text-sm">"{t.text}"</p>
                     </div>
                 </div>
             ))}
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-20 md:py-32 bg-black flex flex-col items-center justify-center text-center px-4 md:px-6 border-t border-rh-surfaceHighlight">
          <h2 className="text-3xl md:text-6xl font-bold mb-8 md:mb-10 tracking-tighter">
              Stop guessing. <br/>Start <span className="text-rh-green">structuring.</span>
          </h2>
          <button 
                onClick={onEnter}
                className="group bg-white text-black px-10 py-4 md:px-14 md:py-5 text-lg md:text-xl font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3"
          >
              Enter System <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
      </section>
    </div>
  );
};
