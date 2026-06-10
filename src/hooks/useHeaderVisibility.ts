'use client';

import { useState, useEffect, useRef } from 'react';

export function useHeaderVisibility() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollTopRef = useRef(0);
  const headerHeightRef = useRef(55);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;

      if (st > lastScrollTopRef.current && st > headerHeightRef.current) {
        // Scrolling down and past header height
        setIsHidden(true);
      } else {
        // Scrolling up
        setIsHidden(false);
      }

      lastScrollTopRef.current = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isHidden;
}
