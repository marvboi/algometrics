import React from 'react';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  rows?: number;
}

export function SkeletonLoader({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  rows = 1 
}: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`${width} ${height} skeleton shimmer rounded-md`}
        />
      ))}
    </div>
  );
}