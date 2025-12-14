'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Custom cursor component - teal circle that follows mouse and animates on interactions
 */
type CursorType = 'default' | 'clickable' | 'input';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const rafRef = useRef<number | null>(null);
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition(targetPosition.current);
          rafRef.current = null;
        });
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Check for interactive elements and differentiate types
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for input fields first (textarea, input, select)
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      ) {
        setCursorType('input');
      }
      // Check for clickable elements (links, buttons, etc.)
      else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]')
      ) {
        setCursorType('clickable');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseOut = () => {
      setCursorType('default');
    };

    // Initialize cursor position
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousemove', handleMouseMove, { once: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide default cursor on all elements
    const hideCursor = () => {
      // Apply to body and html
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      
      // Apply to all interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer'
      );
      interactiveElements.forEach((el) => {
        (el as HTMLElement).style.cursor = 'none';
      });
    };

    // Initial hide
    hideCursor();

    // Use MutationObserver to hide cursor on dynamically added elements
    const observer = new MutationObserver(() => {
      hideCursor();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      observer.disconnect();
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      
      // Restore cursor on interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer'
      );
      interactiveElements.forEach((el) => {
        (el as HTMLElement).style.cursor = '';
      });
    };
  }, []);

  const getCursorStyle = () => {
    if (isClicking) {
      return {
        size: 'w-8 h-8',
        scale: 'scale-75',
        opacity: 'opacity-80',
        shadow: '0 0 20px rgba(6, 182, 212, 0.6)',
      };
    }

    switch (cursorType) {
      case 'clickable':
        return {
          size: 'w-12 h-12',
          scale: 'scale-100',
          opacity: 'opacity-90',
          shadow: '0 0 20px rgba(6, 182, 212, 0.5)',
          ring: true,
        };
      case 'input':
        return {
          size: 'w-1 h-6',
          scale: 'scale-100',
          opacity: 'opacity-100',
          shadow: '0 0 10px rgba(6, 182, 212, 0.6)',
          isInput: true,
        };
      default:
        return {
          size: 'w-6 h-6',
          scale: 'scale-100',
          opacity: 'opacity-100',
          shadow: '0 0 10px rgba(6, 182, 212, 0.3)',
        };
    }
  };

  const cursorStyle = getCursorStyle();

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: isClicking || cursorType !== 'default' ? 'none' : 'transform 0.1s ease-out',
      }}
    >
      {cursorType === 'input' ? (
        // Input cursor - vertical line (text cursor style)
        <div
          className={`bg-cyan-500 transition-all duration-200 ${cursorStyle.size} ${cursorStyle.scale} ${cursorStyle.opacity}`}
          style={{
            boxShadow: cursorStyle.shadow,
            borderRadius: '2px',
          }}
        />
      ) : (
        // Default and clickable cursor - circle
        <div className="relative">
          <div
            className={`rounded-full bg-cyan-500 transition-all duration-200 ${cursorStyle.size} ${cursorStyle.scale} ${cursorStyle.opacity}`}
            style={{
              boxShadow: cursorStyle.shadow,
            }}
          />
          {cursorStyle.ring && (
            <>
              {/* Outer ring */}
              <div
                className="absolute rounded-full border-2 border-cyan-500 transition-all duration-200"
                style={{
                  width: '48px',
                  height: '48px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.5,
                }}
              />
            </>
          )}
          {/* Inner white circle for clickable elements - always rendered but animated */}
          <div
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              width: '16px',
              height: '16px',
              left: '50%',
              top: '50%',
              transform: cursorType === 'clickable' 
                ? 'translate(-50%, -50%) scale(1)' 
                : 'translate(-50%, -50%) scale(0)',
              opacity: cursorType === 'clickable' ? 0.9 : 0,
              boxShadow: cursorType === 'clickable' ? '0 0 8px rgba(255, 255, 255, 0.4)' : 'none',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease-out',
            }}
          />
        </div>
      )}
    </div>
  );
};
