'use client';

import React, { useEffect, useState } from 'react';
import './VyshuuuLoader.css';

export type VyshuuuLoaderProps = {
  /** Path to your EXISTING transparent wordmark asset. Do not replace it with re-typeset text. */
  wordmarkSrc: string;
  /** Alt text for the original wordmark artwork. */
  alt?: string;
  /** Maximum intro duration. Kept short so the site is never held hostage by the animation. */
  durationMs?: number;
  /** Set false if you want to control visibility yourself. */
  autoDismiss?: boolean;
  onDone?: () => void;
};

/**
 * A short, non-blocking brand intro for VYSHUUU.
 * Keep the source wordmark as an image so its exact lettering and subtitle remain untouched.
 * The animated filament is an independent SVG overlay; adjust its path to trace your artwork more closely.
 */
export default function VyshuuuLoader({
  wordmarkSrc,
  alt = 'VYSHUUU — The Unstitched Continuum',
  durationMs = 2200,
  autoDismiss = true,
  onDone,
}: VyshuuuLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      if (autoDismiss) {
        setVisible(false);
        onDone?.();
      }
      return;
    }
    if (!autoDismiss) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, Math.max(700, Math.min(durationMs, 2600)));

    return () => window.clearTimeout(timer);
  }, [autoDismiss, durationMs, onDone]);

  if (!visible) return null;

  return (
    <div className="vyshuuu-loader" role="status" aria-label="Loading VYSHUUU">
      <div className="vyshuuu-loader__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="vyshuuu-loader__wordmark" src={wordmarkSrc} alt={alt} />
        <svg
          className="vyshuuu-loader__filament"
          viewBox="0 0 1200 360"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="vyshuuu-zari" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8f6238" />
              <stop offset=".48" stopColor="#f0d7a0" />
              <stop offset=".72" stopColor="#c49a60" />
              <stop offset="1" stopColor="#efd9a6" />
            </linearGradient>
          </defs>
          {/* Minimal single filament. Tune this path to match the line in your master artwork. */}
          <path
            className="vyshuuu-loader__thread-shadow"
            d="M38 226 C145 150 204 257 302 214 S455 154 535 207 S666 247 720 156 S793 104 835 157 S943 252 1020 204 S1112 174 1160 211"
          />
          <path
            className="vyshuuu-loader__thread"
            d="M38 226 C145 150 204 257 302 214 S455 154 535 207 S666 247 720 156 S793 104 835 157 S943 252 1020 204 S1112 174 1160 211"
          />
          <path
            className="vyshuuu-loader__highlight"
            d="M38 226 C145 150 204 257 302 214 S455 154 535 207 S666 247 720 156 S793 104 835 157 S943 252 1020 204 S1112 174 1160 211"
          />
        </svg>
      </div>
      <span className="vyshuuu-loader__sr">Loading website</span>
    </div>
  );
}
