'use client';

import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | HTMLSpanElement | HTMLParagraphElement)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRefs.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLHeadingElement | HTMLSpanElement | HTMLParagraphElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex h-dvh w-full items-end justify-start overflow-hidden bg-foreground pb-24 pl-8 pt-32 md:pb-32 md:pl-24"
    >
      <div
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
        style={{
          backgroundImage:
            'url(\"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 z-10 bg-linear-to-t from-foreground via-foreground/60 to-transparent" />

      <div className="relative z-20 flex max-w-4xl flex-col items-start gap-4">
        <h1 className="flex flex-col">
          <span
            ref={addToRefs}
            className="font-sans text-4xl font-bold tracking-tight text-background md:text-5xl lg:text-6xl"
          >
            Reflect your
          </span>
          <span
            ref={addToRefs}
            className="mt-2 font-serif text-6xl italic leading-tight text-primary md:text-8xl lg:text-[10rem]"
          >
            Internal State.
          </span>
        </h1>

        <p
          ref={addToRefs}
          className="mt-4 max-w-xl font-sans text-lg text-background/80 md:text-xl"
        >
          MindMirror acts as your conversational mirror. Socratic reflection meets actionable protocol.
        </p>

        <button
          ref={buttonRef}
          onClick={() => router.push('/login')}
          className="group relative mt-8 overflow-hidden rounded-[2rem] bg-accent px-8 py-4 font-sans text-lg font-medium text-foreground transition-transform duration-300 hover:scale-[1.03]"
          style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        >
          <span className="relative z-10">Start Your Reflection</span>
          <span className="absolute inset-0 z-0 h-full w-full -translate-x-full bg-primary transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </div>
    </section>
  );
}
