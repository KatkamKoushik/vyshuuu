'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export interface ScrollProgressOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  onUpdate?: (progress: number, velocity: number) => void;
}

export function useScrollTriggerCallback({
  triggerRef,
  start = 'top top',
  end = 'bottom bottom',
  onUpdate,
}: ScrollProgressOptions) {
  const onUpdateRef = useRef(onUpdate);
  const progressRef = useRef(0);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el || typeof window === 'undefined') return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const velocity = typeof self.getVelocity === 'function' ? self.getVelocity() : 0;
        onUpdateRef.current?.(self.progress, velocity);
      },
    });

    return () => {
      st.kill();
    };
  }, [triggerRef, start, end]);

  return { progressRef };
}

export function useScrollProgress({
  triggerRef,
  start = 'top top',
  end = 'bottom bottom',
  onUpdate,
}: ScrollProgressOptions) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const onUpdateRef = useRef(onUpdate);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el || typeof window === 'undefined') return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const velocity = typeof self.getVelocity === 'function' ? self.getVelocity() : 0;
        onUpdateRef.current?.(self.progress, velocity);

        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            setProgress((prev) => {
              if (
                Math.abs(prev - progressRef.current) < 0.005 &&
                progressRef.current > 0 &&
                progressRef.current < 1
              ) {
                return prev;
              }
              return progressRef.current;
            });
          });
        }
      },
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      st.kill();
    };
  }, [triggerRef, start, end]);

  return { progress, progressRef };
}
