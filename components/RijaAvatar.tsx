
import React from 'react';

interface RijaAvatarProps {
  size?: 'sm' | 'lg';
  state?: 'idle' | 'thinking';
  className?: string;
}

export const RijaAvatar: React.FC<RijaAvatarProps> = ({ size = 'lg', state = 'idle', className = '' }) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-32 h-32';
  
  // Orb Logic
  const pulseClass = state === 'thinking' ? 'animate-orb-pulse' : 'animate-orb-breathe';
  const glowColor = state === 'thinking' ? 'shadow-[0_0_40px_rgba(0,200,5,0.8)]' : 'shadow-[0_0_20px_rgba(0,200,5,0.4)]';

  return (
    <div className={`relative ${sizeClass} flex items-center justify-center ${className} pointer-events-none select-none`}>
      
      {/* Outer Glow Ring - Clockwise 360 */}
      <div className="absolute inset-0 rounded-full border-2 border-rh-green/30 border-t-rh-green border-r-transparent animate-spin-slow"></div>
      
      {/* Inner Detail Ring - Counter-Clockwise 360 */}
      <div className="absolute inset-2 rounded-full border border-rh-green/20 border-b-rh-green border-l-transparent animate-spin-reverse"></div>

      {/* Main Orb */}
      <div className={`relative w-[65%] h-[65%] rounded-full bg-black ${glowColor} transition-all duration-700 overflow-hidden`}>
         {/* Internal liquid/gradient effect */}
         <div className={`absolute inset-0 bg-gradient-to-tr from-rh-green via-black to-black opacity-80 ${pulseClass}`}></div>
         
         {/* Shine */}
         <div className="absolute top-2 right-4 w-1/4 h-1/4 bg-white opacity-20 blur-sm rounded-full"></div>
      </div>

      <style>{`
        .animate-orb-breathe {
            animation: breathe 4s ease-in-out infinite;
        }
        .animate-orb-pulse {
            animation: pulse-fast 1s ease-in-out infinite;
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        .animate-spin-reverse {
            animation: spin-reverse 12s linear infinite;
        }

        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes pulse-fast {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
