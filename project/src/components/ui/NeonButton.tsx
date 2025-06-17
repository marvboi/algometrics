import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function NeonButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: NeonButtonProps) {
  const variants = {
    primary: 'border-neon-green text-neon-green hover:bg-neon-green hover:text-space-900',
    secondary: 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-space-900',
    danger: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      className={`
        border-2 ${variants[variant]} ${sizes[size]}
        rounded-cyber font-medium transition-all duration-300
        hover:shadow-lg hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { boxShadow: '0 0 20px currentColor' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}