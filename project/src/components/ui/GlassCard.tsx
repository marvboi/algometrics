import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  onClick 
}: GlassCardProps) {
  const baseClasses = 'glass-card transition-all duration-300';
  const hoverClasses = hover ? 'hover:bg-glass-medium hover:scale-105 cursor-pointer' : '';
  const glowClasses = glow ? 'animate-pulse-neon' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
}