'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ThreeDotLoaderProps {
  className?: string;
  dotColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-12', dot: 'w-1.5 h-1.5', gap: 'gap-1' },
  md: { container: 'w-16', dot: 'w-2 h-2', gap: 'gap-1.5' },
  lg: { container: 'w-20', dot: 'w-2.5 h-2.5', gap: 'gap-2' },
};

export const ThreeDotLoader: React.FC<ThreeDotLoaderProps> = ({
  className,
  dotColor = 'currentColor',
  size = 'md',
}) => {
  const sizes = sizeMap[size];

  return (
    <div className={cn('flex items-center justify-center', sizes.gap, className)}>
      <svg
        className={cn(sizes.container, 'h-full')}
        viewBox="0 0 48 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="3" fill={dotColor}>
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
        <circle cx="24" cy="6" r="3" fill={dotColor}>
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </circle>
        <circle cx="42" cy="6" r="3" fill={dotColor}>
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </circle>
      </svg>
    </div>
  );
};

