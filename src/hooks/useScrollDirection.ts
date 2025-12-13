/**
 * Custom hook to detect scroll direction
 * Returns true when scrolling down, false when scrolling up
 */

import { useState, useEffect } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, initialDirection = 'up' } = options;
  
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Only update if we've scrolled past the threshold
      if (Math.abs(scrollY - lastScrollY) >= threshold) {
        setScrollDirection(direction);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
      
      // Track if we've scrolled at all
      setIsScrolled(scrollY > 0);
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollDirection, isScrolled };
}