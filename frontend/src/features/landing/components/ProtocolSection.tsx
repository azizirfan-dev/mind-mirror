'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: 'Uncover',
    desc: 'The Shuffler cycles through your cognitive landscape, bringing hidden stressors to the surface.',
    icon: (
      <svg viewBox="0 0 100 100" className="h-48 w-48 text-primary opacity-20">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[spin_20s_linear_infinite]"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-[spin_10s_linear_infinite_reverse]"
        />
      </svg>
    ),
  },
  {
    title: 'Quantify',
    desc: 'The Typewriter analyzes your input, dynamically tagging and categorizing emotional frequencies in real-time.',
    icon: (
      <svg viewBox="0 0 100 100" className="h-48 w-48 text-accent opacity-20">
        <path
          d="M10 50 Q 25 20, 40 50 T 70 50 T 100 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="10"
          y1="10"
          x2="10"
          y2="90"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          className="animate-pulse"
        />
      </svg>
    ),
  },
  {
    title: 'Harmonize',
    desc: 'The Scheduler formats your insights into a clinical-grade protocol ready for professional review.',
    icon: (
      <svg viewBox="0 0 100 100" className="h-48 w-48 text-primary opacity-20">
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="5"
          fill="currentColor"
          className="animate-ping"
        />
      </svg>
    ),
  },
];

export default function ProtocolSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card || index === cardsRef.current.length - 1) return;

        gsap.to(card, {
          scale: 0.9,
          opacity: 0.3,
          filter: 'blur(10px)',
          scrollTrigger: {
            trigger: cardsRef.current[index + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-background">
      {steps.map((step, index) => (
        <div
          key={step.title}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
          className="mx-auto flex h-screen w-full max-w-7xl flex-col justify-center px-6 md:px-24"
          style={{ zIndex: index }}
        >
          <div className="relative flex h-[80vh] w-full items-center justify-between overflow-hidden rounded-3xl border border-foreground/5 bg-white p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:bg-foreground/5">
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 select-none">
              {step.icon}
            </div>

            <div className="relative z-10 flex max-w-xl flex-col gap-6">
              <span className="font-mono text-sm uppercase tracking-widest text-primary">
                0{index + 1} // Phase
              </span>
              <h2 className="font-sans text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                {step.title}
              </h2>
              <p className="font-serif text-xl italic leading-relaxed text-foreground/70 md:text-2xl">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
