'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

// Wraps InvoicePreview and scales it to fit the container width on any screen.
// The inner content keeps its true A4 dimensions (needed for PDF capture).
// On desktop the scale is 1 (no change); on mobile it shrinks to fit.
export function InvoiceScaleWrapper({ children }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function compute() {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const containerW = outer.offsetWidth;
      const contentW   = inner.scrollWidth;   // actual rendered width of the A4 invoice
      const contentH   = inner.scrollHeight;

      if (contentW === 0) return;
      const s = Math.min(1, containerW / contentW);
      setScale(s);
      setScaledHeight(contentH * s);
    }

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div ref={outerRef} style={{ width: '100%', overflow: 'hidden' }}>
      {/* Height placeholder so the page doesn't collapse */}
      <div style={{ height: scaledHeight ?? 'auto', position: 'relative' }}>
        <div
          ref={innerRef}
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            // While measuring (scale=1 but content wider than container),
            // position absolute so it doesn't push layout.
            position: scale < 1 ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
