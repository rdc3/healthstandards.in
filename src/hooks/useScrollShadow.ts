import { useState, useEffect } from 'react';

/**
 * Custom hook to add shadow to sticky elements when scrolling
 */
export const useScrollShadow = (threshold: number = 10) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHasScrolled(scrollTop > threshold);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return hasScrolled;
};