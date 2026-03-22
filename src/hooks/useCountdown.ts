import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialMs: number) {
  const [remaining, setRemaining] = useState(initialMs);

  useEffect(() => {
    setRemaining(initialMs);
  }, [initialMs]);

  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1000;
        return next <= 0 ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining > 0]);

  const reset = useCallback((ms: number) => setRemaining(ms), []);

  return { remaining, reset, isActive: remaining > 0 };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ready!";
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}
