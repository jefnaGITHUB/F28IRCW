import { useState, useRef, useCallback } from 'react';

export const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(0);
  }, [stop]);

  return { seconds, start, stop, reset };
};