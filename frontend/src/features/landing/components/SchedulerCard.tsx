'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check } from 'lucide-react';

export const SchedulerCard = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, yoyo: false, delay: 1 });

      tl.to(svgRef.current, {
        x: 140,
        y: 80,
        duration: 1.5,
        ease: 'power2.inOut',
      })
        .to(svgRef.current, { scale: 0.85, duration: 0.1 })
        .to(
          '.day-node-wed',
          {
            backgroundColor: '#D6C7B2',
            color: '#2C2723',
            duration: 0.2,
          },
          '<',
        )
        .to(svgRef.current, { scale: 1, duration: 0.1 })
        .to(svgRef.current, {
          x: 220,
          y: 180,
          duration: 1,
          ease: 'power2.inOut',
          delay: 0.5,
        })
        .to(svgRef.current, { scale: 0.85, duration: 0.1 })
        .to(
          '.save-btn',
          { scale: 0.95, duration: 0.1 },
          '<',
        )
        .to(svgRef.current, { scale: 1, duration: 0.1 })
        .to(
          '.save-btn',
          { scale: 1, duration: 0.1 },
          '<',
        )
        .to(svgRef.current, { opacity: 0, duration: 0.5 })
        .to(svgRef.current, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0,
        });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={gridRef}
      className="relative flex h-80 w-full flex-col justify-start overflow-hidden rounded-[2rem] border border-accent/20 bg-background/50 p-8 shadow-sm backdrop-blur-md"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
          Protocol Handover
        </span>
      </div>

      <div className="relative w-full rounded-xl border border-foreground/5 bg-white/50 p-4">
        <div className="mb-3 flex justify-between font-sans text-xs font-medium text-foreground/40">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span className="text-foreground">W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
            <div
              key={day}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${
                i === 3
                  ? 'day-node-wed border border-accent/30'
                  : 'bg-transparent text-foreground/40'
              }`}
            >
              {20 + day}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="save-btn flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs text-background">
            <Check size={12} /> Finalize
          </button>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-0 top-0 z-10 h-6 w-6 text-foreground drop-shadow-md"
        >
          <path
            d="M4 4l16 16-6.4 1.6-3.2 6.4L4 4z"
            fill="currentColor"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
