import { useState, useEffect, useRef, useCallback } from "react";

export function useCountdown(initialMs: number) {
  const [remaining, setRemaining] = useState(initialMs);
  const [isActive, setIsActive] = useState(initialMs > 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback((newMs: number) => {
    clearInterval(intervalRef.current!);
    setRemaining(newMs);
    setIsActive(newMs > 0);
  }, []);

  useEffect(() => {
    if (isActive && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1000) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else if (remaining === 0) {
      clearInterval(intervalRef.current!);
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remaining]);

  return { remaining, isActive, reset };
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${pad(seconds)}s`;
  } else {
    return `${seconds}s`;
  }
}
