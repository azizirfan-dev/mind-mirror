'use client';

import { useEffect, useState } from 'react';

const phrases = [
  'What core truth are you avoiding today?',
  'How does that sensation physically manifest?',
  'Why is certainty more comfortable than growth?',
];

export const TypewriterCard = () => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const speed = isDeleting ? 30 : 70;

    if (!isDeleting && text === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(
        currentPhrase.substring(
          0,
          text.length + (isDeleting ? -1 : 1),
        ),
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <div className="relative flex h-80 w-full flex-col justify-start overflow-hidden rounded-[2rem] border border-accent/20 bg-background/50 p-8 shadow-sm backdrop-blur-md">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
          Live Feed
        </span>
      </div>

      <div className="flex-1 font-mono text-sm leading-relaxed text-foreground md:text-base">
        <span className="text-primary">{'> '}</span>
        {text}
        <span className="ml-[2px] inline-block h-[1em] w-[8px] animate-pulse bg-accent align-middle" />
      </div>
    </div>
  );
};
