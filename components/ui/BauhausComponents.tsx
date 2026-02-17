
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export const BauhausButton: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "font-sans font-bold rounded-full transition-all active:scale-95 px-6 py-2.5 md:px-8 md:py-3 text-sm tracking-wide flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-rh-green text-black hover:bg-[#00E006] shadow-[0_0_15px_rgba(0,200,5,0.3)]", 
    secondary: "bg-rh-surface text-white hover:bg-rh-surfaceHighlight border border-rh-border",
    accent: "bg-white text-black hover:bg-gray-200", 
    danger: "bg-rh-red text-white hover:bg-orange-600 shadow-[0_0_15px_rgba(255,80,0,0.3)]"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const BauhausCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ 
  children, 
  className = '',
  title
}) => {
  return (
    <div className={`bg-rh-surface rounded-3xl border border-rh-border/50 shadow-soft p-6 md:p-8 ${className}`}>
      {title && (
        <h3 className="font-sans font-bold text-xl md:text-2xl tracking-tight mb-4 md:mb-6 text-white border-b border-rh-border pb-3 md:pb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export const BauhausInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ 
  label, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-sans font-medium text-[10px] md:text-xs text-rh-subtext uppercase tracking-wider pl-1">{label}</label>}
      <input 
        className={`bg-black border border-rh-border rounded-xl p-3 md:p-4 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-rh-green focus:border-rh-green transition-all placeholder:text-gray-700 ${className}`}
        {...props}
      />
    </div>
  );
};

export const BauhausTag: React.FC<{ label: string; color?: string }> = ({ label, color }) => {
  return (
    <span className={`bg-rh-surfaceHighlight text-white border border-rh-border px-4 py-1.5 font-bold text-xs rounded-full`}>
      {label}
    </span>
  );
}
