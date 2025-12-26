// Marquee scrolling text hook

import { useState, useEffect, useCallback } from 'react';

interface UseMarqueeOptions {
  text: string;
  maxLength: number;
  speed?: number; // milliseconds per character
  pauseOnHover?: boolean;
}

export function useMarquee({
  text,
  maxLength,
  speed = 150,
  pauseOnHover = true,
}: UseMarqueeOptions) {
  const [displayText, setDisplayText] = useState(text);
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const needsScroll = text.length > maxLength;
  const paddedText = needsScroll ? text + '   ***   ' : text;

  useEffect(() => {
    if (!needsScroll || isPaused) {
      setDisplayText(text.slice(0, maxLength));
      return;
    }

    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % paddedText.length);
    }, speed);

    return () => clearInterval(interval);
  }, [text, needsScroll, speed, isPaused, paddedText.length, maxLength]);

  useEffect(() => {
    if (!needsScroll) {
      setDisplayText(text);
      return;
    }

    const start = offset;
    let result = '';

    for (let i = 0; i < maxLength; i++) {
      result += paddedText[(start + i) % paddedText.length];
    }

    setDisplayText(result);
  }, [offset, paddedText, maxLength, needsScroll, text]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  return {
    displayText,
    needsScroll,
    isPaused,
    handleMouseEnter,
    handleMouseLeave,
  };
}
