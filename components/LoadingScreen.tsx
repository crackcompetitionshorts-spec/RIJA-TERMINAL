
import React, { useEffect, useState } from 'react';
import { RijaAvatar } from './RijaAvatar';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; 
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const pct = Math.min((currentStep / steps) * 100, 100);
      setProgress(pct);
      if (currentStep >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      
      <div className="mb-12 scale-150">
         <RijaAvatar size="lg" state="thinking" />
      </div>

      <div className="w-64 h-1.5 bg-gray-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-rh-green rounded-full transition-all duration-75 ease-out shadow-[0_0_15px_#00C805]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="mt-4 text-xs font-bold text-gray-500 tracking-widest uppercase animate-pulse">
          Initializing Neural Core
      </p>

    </div>
  );
};
