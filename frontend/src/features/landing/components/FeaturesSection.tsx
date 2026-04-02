'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShufflerCard } from './ShufflerCard';
import { TypewriterCard } from './TypewriterCard';
import { SchedulerCard } from './SchedulerCard';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="mx-auto max-w-7xl px-6 py-32 md:px-12"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="feature-card flex flex-col gap-4">
          <ShufflerCard />
          <h3 className="font-sans text-xl font-bold">
            Multidimensional Insights
          </h3>
          <p className="font-serif text-base italic text-foreground/70">
            Quantifying complex emotions into a balanced inventory.
          </p>
        </div>

        <div className="feature-card flex flex-col gap-4 md:mt-12">
          <TypewriterCard />
          <h3 className="font-sans text-xl font-bold">
            Socratic Guided Reflection
          </h3>
          <p className="font-serif text-base italic text-foreground/70">
            An active listening process that uncovers hidden insights.
          </p>
        </div>

        <div className="feature-card flex flex-col gap-4 md:mt-24">
          <SchedulerCard />
          <h3 className="font-sans text-xl font-bold">
            Professional Handover
          </h3>
          <p className="font-serif text-base italic text-foreground/70">
            Seamless transition from personal journaling to consultation.
          </p>
        </div>
      </div>
    </section>
  );
}
