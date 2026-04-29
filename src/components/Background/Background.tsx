'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Props = {
  accent?: string;
  density?: number;
  intensity?: number;
};

function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function isTouch(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: none)').matches;
}

function useMotionEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!reduced.matches && !isTouch());
    const update = () => setEnabled(!reduced.matches && !isTouch());
    reduced.addEventListener?.('change', update);
    return () => reduced.removeEventListener?.('change', update);
  }, []);
  return enabled;
}

export default function Background({
  accent = '#22d3ee',
  density = 0.6,
  intensity = 1,
}: Props) {
  const haloRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(-9999);
  const yRef = useRef(-9999);
  const rafRef = useRef(0);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const halo = haloRef.current;
    if (!halo) return;

    const onMove = (e: MouseEvent) => {
      xRef.current = e.clientX;
      yRef.current = e.clientY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          halo.style.transform = `translate3d(${xRef.current - 200}px, ${
            yRef.current - 200
          }px, 0)`;
          halo.style.opacity = '1';
        });
      }
    };
    const onLeave = () => {
      halo.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  // Static circuit-trace tile: L-shaped paths + center dot.
  // Deterministic — identical on server and client (no hydration mismatch).
  const spacing = Math.round(64 / Math.max(0.4, density));
  const op = (0.18 * intensity).toFixed(2);
  const dotOp = (0.32 * intensity).toFixed(2);
  const half = spacing / 2;
  const pattern = `<svg xmlns='http://www.w3.org/2000/svg' width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}'>
    <g stroke='${accent}' stroke-opacity='${op}' stroke-width='1' fill='none'>
      <path d='M0 ${half} L${half} ${half} L${half} 0' />
      <path d='M${spacing} ${half} L${half} ${half}' />
      <path d='M${half} ${spacing} L${half} ${half}' />
    </g>
    <circle cx='${half}' cy='${half}' r='1.6' fill='${accent}' fill-opacity='${dotOp}' />
  </svg>`;
  const tileUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(pattern)}")`;

  const wrapStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    backgroundImage: tileUrl,
    backgroundRepeat: 'repeat',
    opacity: 0.85,
  };

  const haloStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${hexA(accent, 0.35 * intensity)} 0%, ${hexA(
      accent,
      0.12 * intensity
    )} 30%, transparent 65%)`,
    opacity: 0,
    transition: 'opacity 240ms ease',
    mixBlendMode: 'screen',
    willChange: 'transform',
    pointerEvents: 'none',
    zIndex: 0,
    transform: 'translate3d(-9999px, -9999px, 0)',
  };

  return (
    <>
      <div aria-hidden="true" style={wrapStyle} />
      {enabled && <div ref={haloRef} aria-hidden="true" style={haloStyle} />}
    </>
  );
}
