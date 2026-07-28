'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to track window scroll position.
 * Returns true if user has scrolled beyond threshold pixels.
 */
export function useScrollPosition(threshold: number = 8): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Run once on mount to handle reloads with scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
