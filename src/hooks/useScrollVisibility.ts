'use client';

import { useEffect, useRef } from 'react';

interface UseScrollVisibilityOptions {
  selector: string;
  visibilityThreshold?: number;
}

// Fine-grained steps so the observer fires close to the moment the
// enter/exit bands below are crossed.
const THRESHOLD_STEPS = Array.from({ length: 21 }, (_, i) => i / 20);

export function useScrollVisibility({
  selector,
  visibilityThreshold = 0.3
}: UseScrollVisibilityOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentElement = containerRef.current;
    if (!parentElement) return;

    const elements = Array.from(
      parentElement.querySelectorAll<HTMLElement>(selector)
    );
    if (elements.length === 0) return;

    const reveal = (element: HTMLElement) => {
      element.classList.remove('out-of-view');
      element.classList.add('in-view');
    };

    // Reveals are pure decoration: under reduced motion just show
    // everything and skip the observer entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(reveal);
      return;
    }

    // On mobile, reveal each element once and stop watching it. Re-hiding
    // content as it leaves the viewport forces every fast upward flick to
    // re-run entry animations mid-scroll, which reads as glitchy under
    // momentum scrolling.
    const revealOnce = window.matchMedia('(max-width: 768px)').matches;

    const enterAt = visibilityThreshold;
    // Exit at a lower ratio than we enter: an element sitting on the enter
    // boundary doesn't flip classes on every small scroll jitter.
    const exitAt = visibilityThreshold / 2;

    const visibleElements = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const elementHeight = entry.boundingClientRect.height;
          const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
          // Measure visibility against whichever is smaller — an element
          // taller than the viewport can never reach a raw ratio of 1.
          const limit = Math.min(elementHeight, viewportHeight);
          const visibleRatio =
            limit > 0 ? entry.intersectionRect.height / limit : 0;

          const wasInView = visibleElements.has(element);

          if (!wasInView && visibleRatio >= enterAt) {
            reveal(element);
            visibleElements.add(element);
            if (revealOnce) observer.unobserve(element);
          } else if (!revealOnce && wasInView && visibleRatio < exitAt) {
            element.classList.remove('in-view');
            element.classList.add('out-of-view');
            visibleElements.delete(element);
          }
        });
      },
      { threshold: THRESHOLD_STEPS }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector, visibilityThreshold]);

  return containerRef;
}
