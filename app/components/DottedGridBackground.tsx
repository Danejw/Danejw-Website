// Reusable dotted grid overlay with SVG pattern, kept lightweight for perf.
'use client'

import React from 'react';
import clsx from 'clsx';

const dotPattern = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
     <circle cx="2" cy="2" r="1.4" fill="#07b2c4" fill-opacity="0.8" />
  </svg>`
);

type Props = {
  className?: string;
  opacity?: number;
};

export const DottedGridBackground: React.FC<Props> = ({ className, opacity = 0.9 }) => (
  <div
    aria-hidden
    className={clsx('pointer-events-none absolute inset-0', className)}
    style={{
      backgroundImage: `url("data:image/svg+xml,${dotPattern}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '12px 12px',
      opacity,
    }}
  />
);

