import React from 'react';

// Define a unique ID for the pattern
const PATTERN_ID = 'circuit-background-pattern';

export const ThemeAwareCircuitBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      // Increased overall opacity
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.12]"
    >
      <svg className="absolute inset-0 h-full w-full" >
        <defs>
          {/* Combined relevant parts from circuit-pattern.svg into one pattern */}
          <pattern
            id={PATTERN_ID}
            width="75" // Using size from original #circuit pattern
            height="75"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-1 -1)"
          >
            {/* Base grid lines - slightly reduced opacity */}
            <path d='M0 50h100M50 0v100' fill='none' stroke='var(--color-accent)' strokeWidth='0.75' strokeOpacity='.3'/>

            {/* Repeating Dots */}
            <circle cx='10' cy='10' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='30' cy='30' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='50' cy='50' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='70' cy='70' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='90' cy='90' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='10' cy='90' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='90' cy='10' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='30' cy='70' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>
            <circle cx='70' cy='30' r='1.5' fill='var(--color-accent)' fillOpacity='0.3'/>

            {/* Center/Edge Circles */}
            <circle cx='50' cy='50' r='4' fill='var(--color-accent)' fillOpacity='0.2'/>
            <circle cx='0' cy='50' r='2.5' fill='var(--color-accent)' fillOpacity='0.2'/>
            <circle cx='100' cy='50' r='2.5' fill='var(--color-accent)' fillOpacity='0.2'/>
            <circle cx='50' cy='0' r='2.5' fill='var(--color-accent)' fillOpacity='0.2'/>
            <circle cx='50' cy='100' r='2.5' fill='var(--color-accent)' fillOpacity='0.2'/>

            {/* --- Randomness Elements --- */}
            {/* Short diagonal lines */}
            <path d='M 15 5 L 25 15' fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='01'/>
            <path d='M 75 85 L 85 95' fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='0.2'/>
            <path d='M 5 65 L 15 75' fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='0.2'/>
            <path d='M 95 35 L 85 25' fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='0.2'/>

            {/* Small squares (stroke only) */}
            <rect x="40" y="60" width="5" height="5" fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='0.2' />
            <rect x="80" y="20" width="7" height="7" fill='none' stroke='var(--color-accent)' strokeWidth='0.5' strokeOpacity='0.2' />

          </pattern>
        </defs>

        {/* Apply the pattern */}
        <rect width="100%" height="100%" fill={`url(#${PATTERN_ID})`} />
      </svg>
    </div>
  );
};

export default ThemeAwareCircuitBackground; 