'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export interface ScrollProgressOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  onUpdate?: (progress: number, velocity: number) => void;
}

export function useScrollProgress({
  triggerRef,
  start = 'top top',
  end = 'bottom bottom',
  onUpdate,
}: ScrollProgressOptions) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
        const velocity = typeof self.getVelocity === 'function' ? self.getVelocity() : 0;
        onUpdate?.(self.progress, velocity);
      },
    });

    return () => {
      st.kill();
    };
  }, [triggerRef, start, end, onUpdate]);

  return { progress, progressRef };
}
