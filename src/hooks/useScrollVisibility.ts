'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseScrollVisibilityOptions {
  selector: string;
  visibilityThreshold?: number;
}

export function useScrollVisibility({
  selector,
  visibilityThreshold = 0.3
}: UseScrollVisibilityOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleElementsRef = useRef<Set<HTMLElement>>(new Set());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobileRef = useRef(false);

  const checkVisibility = useCallback(() => {
    // Skip bidirectional animations on mobile
    if (isMobileRef.current) {
      return;
    }

    const parentElement = containerRef.current;
    if (!parentElement) return;

    const elements = parentElement.querySelectorAll(selector);
    const windowHeight = window.innerHeight;

    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const elementHeight = rect.height;

      // Calculate how much of the element is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / elementHeight;

      const isInView = visibleRatio >= visibilityThreshold;
      const wasInView = visibleElementsRef.current.has(htmlElement);

      if (isInView && !wasInView) {
        // Element entering viewport
        htmlElement.classList.remove('out-of-view');
        htmlElement.classList.add('in-view');
        visibleElementsRef.current.add(htmlElement);
      } else if (!isInView && wasInView) {
        // Element leaving viewport
        htmlElement.classList.remove('in-view');
        htmlElement.classList.add('out-of-view');
        visibleElementsRef.current.delete(htmlElement);
      }
    });
  }, [selector, visibilityThreshold]);

  useEffect(() => {
    isMobileRef.current = window.innerWidth <= 768;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const delay = isMobileRef.current ? 32 : 16;

      scrollTimeoutRef.current = setTimeout(() => {
        checkVisibility();
      }, delay);
    };

    const handleResize = () => {
      isMobileRef.current = window.innerWidth <= 768;
    };

    // Initial check
    checkVisibility();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkVisibility]);

  return containerRef;
}
