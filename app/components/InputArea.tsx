'use client';

import React from 'react';

interface InputAreaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: 'text' | 'email' | 'textarea';
  rows?: number;
}

/**
 * Input area component for text input - supports both input and textarea
 */
export const InputArea: React.FC<InputAreaProps> = ({
  placeholder = 'Type your answer here...',
  value,
  onChange,
  className = '',
  type = 'textarea',
  rows = 3,
}) => {
  const baseClasses = 'w-full bg-black/30 border border-white/10 rounded-lg p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all backdrop-blur-sm';

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} resize-none ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
    />
  );
};
