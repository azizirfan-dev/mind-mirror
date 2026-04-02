'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitText = (element: HTMLElement | null) => {
        if (!element) return;

        const processTextNode = (text: string, parent: HTMLElement) => {
          const words = text.split(/(\s+)/);
          words.forEach((word) => {
            if (word.trim() === '') {
              if (word.length > 0) parent.appendChild(document.createTextNode(word));
              return;
            }
            const span = document.createElement('span');
            span.textContent = word;
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            span.style.display = 'inline-block';
            span.className = 'word';
            parent.appendChild(span);
          });
        };

        const nodes = Array.from(element.childNodes);
        element.innerHTML = '';

        nodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node.textContent || '', element);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const clone = el.cloneNode() as HTMLElement;
            clone.innerHTML = '';
            processTextNode(el.textContent || '', clone);
            element.appendChild(clone);
          }
        });
      };

      splitText(text1Ref.current);
      splitText(text2Ref.current);

      const t1 = gsap.timeline({
        scrollTrigger: {
          trigger: text1Ref.current,
          start: 'top 85%',
        },
      });

      t1.to(text1Ref.current?.querySelectorAll('.word') || [], {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
      });

      const t2 = gsap.timeline({
        scrollTrigger: {
          trigger: text2Ref.current,
          start: 'top 85%',
        },
      });

      t2.to(text2Ref.current?.querySelectorAll('.word') || [], {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-foreground px-6 py-24 text-background"
    >
      <div
        className="absolute inset-0 z-0 h-[120%] w-full opacity-10"
        style={{
          backgroundImage:
            'url(\"https://images.unsplash.com/photo-1542451313056-b7c8e6266459?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80\")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-16 text-center">
        <h2
          ref={text1Ref}
          className="max-w-2xl text-balance font-sans text-2xl font-light text-background/60 md:text-3xl"
        >
          Most mental health apps focus on generic affirmations and passive tracking.
        </h2>

        <h2
          ref={text2Ref}
          className="max-w-4xl text-balance font-serif text-5xl italic leading-tight text-background md:text-7xl"
        >
          We focus on absolute clarity through <span className="text-primary">Socratic dialogue.</span>
        </h2>
      </div>
    </section>
  );
}
