'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTypingAnimationOptions {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function useTypingAnimation({
  texts,
  typeSpeed = 100,
  deleteSpeed = 75,
  pauseDuration = 1000,
}: UseTypingAnimationOptions) {
  const [currentText, setCurrentText] = useState('');
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    // Timeout chain (not setInterval) so each tick picks the delay for the
    // current phase — an interval's delay is fixed when it is created, which
    // silently ignored deleteSpeed and pauseDuration.
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentFullText = texts[textIndexRef.current];

      if (!isDeletingRef.current) {
        // Typing
        const newCharIndex = charIndexRef.current + 1;
        setCurrentText(currentFullText.substring(0, newCharIndex));
        charIndexRef.current = newCharIndex;

        if (newCharIndex === currentFullText.length) {
          isDeletingRef.current = true;
          timeout = setTimeout(tick, pauseDuration);
          return;
        }
        timeout = setTimeout(tick, typeSpeed);
      } else {
        // Deleting
        const newCharIndex = charIndexRef.current - 1;
        setCurrentText(currentFullText.substring(0, newCharIndex));
        charIndexRef.current = newCharIndex;

        if (newCharIndex === 0) {
          isDeletingRef.current = false;
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          timeout = setTimeout(tick, typeSpeed);
          return;
        }
        timeout = setTimeout(tick, deleteSpeed);
      }
    };

    timeout = setTimeout(tick, typeSpeed);

    return () => {
      clearTimeout(timeout);
    };
  }, [texts, typeSpeed, deleteSpeed, pauseDuration]);

  return currentText;
}
