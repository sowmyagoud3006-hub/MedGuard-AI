import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'teal' | 'indigo' | 'rose' | 'none';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'none',
  hoverEffect = true,
  onClick,
}: GlassCardProps) {
  const glowClasses = {
    teal: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] dark:hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]',
    indigo: 'hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]',
    rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.25)] dark:hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.4)]',
    none: '',
  };

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 dark:hover:border-cyan-400/30'
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        glass-panel-light dark:glass-panel-dark 
        rounded-2xl p-6 relative overflow-hidden 
        ${hoverClass} 
        ${glowClasses[glowColor]} 
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
    >
      {/* Background radial soft light overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-transparent pointer-events-none opacity-20" />
      {children}
    </div>
  );
}
