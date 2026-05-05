import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, withText = true, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-4xl'
  };

  return (
    <div className={cn("flex items-center gap-2.5 group", className)}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-center rounded-[0.4em] bg-gradient-to-br from-[#4F46E5] to-[#9333EA] shadow-[0_0_20px_rgba(79,70,229,0.4)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]",
          iconSizes[size]
        )}
      >
        {/* Subtle grid/circuit background overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Tech/AI Neural Node Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[60%] h-[60%] text-white relative z-10"
        >
          {/* Connecting Lines */}
          <path d="M12 5V19M5 12H19M7.05025 7.05025L16.9497 16.9497M16.9497 7.05025L7.05025 16.9497" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60" />

          {/* Nodes */}
          <circle cx="12" cy="12" r="3.5" fill="currentColor" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </motion.div>

      {withText && (
        <span className={cn("font-bold tracking-tight text-white select-none", textSizes[size])}>
          Context<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#9333EA] font-black drop-shadow-sm">AI</span>
        </span>
      )}
    </div>
  );
}
