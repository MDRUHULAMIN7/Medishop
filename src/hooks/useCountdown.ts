'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom countdown timer hook for OTP resend verification.
 */
export function useCountdown(initialSeconds: number = 60) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const startCountdown = useCallback((seconds?: number) => {
    setSecondsLeft(seconds !== undefined ? seconds : initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const resetCountdown = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  return {
    secondsLeft,
    isActive,
    isFinished: secondsLeft === 0,
    startCountdown,
    resetCountdown,
  };
}
