'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
}

/**
 * Reusable Button component with multiple variants and hover animations.
 * 
 * @example
 * ```tsx
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" onClick={handleClick}>Secondary</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium tracking-widest uppercase transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:bg-cyan-700 disabled:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl disabled:bg-slate-800',
    outline: 'border-2 border-cyan-500 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 bg-transparent hover:bg-cyan-500/10',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  };

  const sizeStyles = 'px-6 py-3 text-sm rounded';
  
  const hoverScale = 'hover:scale-105 active:scale-100';

  const { type: buttonType, ...restProps } = props;

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles,
        hoverScale,
        className
      )}
      disabled={disabled || isLoading}
      type={buttonType || 'button'}
      {...restProps}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

