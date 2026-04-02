'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
          if (self.progress > 0 && !isScrolled) {
            setIsScrolled(true);
            gsap.to(navRef.current, {
              backgroundColor: 'rgba(247, 245, 242, 0.6)', // Soft Linen with blur
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(125, 143, 130, 0.2)', // Sage border
              color: '#2C2723', // Earth Umber
              duration: 0.4,
              ease: 'power2.inOut',
            });
          } else if (self.progress === 0 && isScrolled) {
            setIsScrolled(false);
            gsap.to(navRef.current, {
              backgroundColor: 'transparent',
              backdropFilter: 'blur(0px)',
              borderColor: 'transparent',
              color: '#F7F5F2', // Soft Linen text initially
              duration: 0.4,
              ease: 'power2.inOut',
            });
          }
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, [isScrolled]);

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between rounded-3xl border border-transparent px-8 py-3 text-background transition-all"
      style={{ width: 'min(90%, 900px)' }}
    >
      <div className="font-sans text-xl font-bold tracking-tight">MindMirror</div>

      <div className="hidden items-center gap-8 md:flex">
        <Link href="#reflection" className="text-sm font-medium hover:-translate-y-px transition-transform">Reflection</Link>
        <Link href="#insights" className="text-sm font-medium hover:-translate-y-px transition-transform">Insights</Link>
        <Link href="#protocol" className="text-sm font-medium hover:-translate-y-px transition-transform">Protocol</Link>
      </div>

      <button className="group relative overflow-hidden rounded-[2rem] bg-accent px-6 py-2 text-sm font-medium text-foreground transition-transform hover:scale-[1.03] duration-300" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
        <span className="relative z-10">Start Reflection</span>
        <span className="absolute inset-0 z-0 h-full w-full -translate-x-full bg-primary transition-transform duration-300 group-hover:translate-x-0"></span>
      </button>
    </nav>
  );
}
