// Reusable dotted grid overlay with SVG pattern, kept lightweight for perf.
'use client'

import React, { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';

const dotPattern = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
     <circle cx="2" cy="2" r="1.4" fill="#07b2c4" fill-opacity="0.8" />
  </svg>`
);

type Props = {
  className?: string;
  opacity?: number;
  distortionIntensity?: number; // Controls the strength of the distortion (0-1)
  distortionRadius?: number; // Controls the radius of the distortion effect in pixels
};

export const DottedGridBackground: React.FC<Props> = ({ 
  className, 
  opacity = 1,
  distortionIntensity = 25, // Increased default for more noticeable effect
  distortionRadius = 200 // Increased default radius
}) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  // Calculate the distortion effect based on mouse position
  const getDistortionStyle = () => {
    if (!mousePosition || !containerRef.current) return {};

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate transform origin at mouse position (percentage)
    const originX = (mousePosition.x / rect.width) * 100;
    const originY = (mousePosition.y / rect.height) * 100;
    
    // Calculate mouse position relative to center for directional warping
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const maxDelta = Math.max(rect.width, rect.height) / 2;
    
    // Calculate distance from mouse to center for radial falloff
    const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // Calculate radial falloff factor based on distortionRadius
    // Effect is strongest at mouse position and fades out at distortionRadius
    const radialFalloff = Math.max(0, 1 - (distanceFromCenter / distortionRadius));
    
    // Normalize the intensity for dramatic effect
    const normalizedIntensity = (distortionIntensity / 100) * radialFalloff;
    
    // Create a very strong 3D warping effect
    // The grid should appear to "bend" and "stretch" dramatically toward the mouse
    const perspective = 400; // Lower perspective = more dramatic 3D effect
    
    // Very strong rotation effects - creates highly visible 3D tilt
    const rotateX = (deltaY / maxDelta) * normalizedIntensity * 35;
    const rotateY = -(deltaX / maxDelta) * normalizedIntensity * 35;
    
    // Strong scale effect - creates the "magnifying glass" or "lens" distortion
    // This makes the effect very noticeable
    const scale = 1 + normalizedIntensity * 1.2;
    
    // Strong skew for additional warping - creates the "stretching" effect
    const skewX = (deltaX / maxDelta) * normalizedIntensity * 12;
    const skewY = (deltaY / maxDelta) * normalizedIntensity * 12;
    
    // Combine all transforms for maximum visible distortion
    // The transform origin at mouse position ensures the warping is centered there
    return {
      transformOrigin: `${originX}% ${originY}%`,
      transform: `
        perspective(${perspective}px)
        scale(${scale})
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        skewX(${skewX}deg)
        skewY(${skewY}deg)
      `,
      filter: `blur(${normalizedIntensity * 1.0}px)`,
    };
  };

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={clsx('absolute inset-0', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        pointerEvents: 'auto',
        cursor: 'none',
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-150 ease-out"
        style={{
          backgroundImage: `url("data:image/svg+xml,${dotPattern}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '12px 12px',
          opacity,
          ...getDistortionStyle(),
        }}
      />
    </div>
  );
};

