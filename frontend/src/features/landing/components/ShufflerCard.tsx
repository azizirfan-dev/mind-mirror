'use client';

import { useEffect, useState } from 'react';

export const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Anxiety', value: 'Elevated' },
    { id: 2, title: 'Resilience', value: 'Stable' },
    { id: 3, title: 'Clarity', value: 'Improving' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const last = newCards.pop();
        if (last) newCards.unshift(last);
        return newCards;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-accent/20 bg-background/50 p-6 shadow-sm backdrop-blur-md">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
          Metric Extraction
        </span>
      </div>

      <div className="relative mt-8 h-48 w-full max-w-xs">
        {cards.map((card, i) => {
          const isTop = i === 0;
          return (
            <div
              key={card.id}
              className="absolute left-0 right-0 top-0 transition-transform duration-700"
              style={{
                transform: `translateY(${i * 12}px) scale(${1 - i * 0.05})`,
                zIndex: 3 - i,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div
                className="flex h-32 flex-col justify-between rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-foreground/5 dark:bg-foreground dark:text-background"
                style={{
                  opacity: 1 - i * 0.15,
                }}
              >
                <span
                  className={`font-sans text-sm font-medium ${
                    isTop
                      ? 'text-foreground/60 dark:text-background/80'
                      : 'text-foreground/60 dark:text-background/60'
                  }`}
                >
                  {card.title}
                </span>
                <span
                  className={`font-serif text-2xl italic ${
                    isTop
                      ? 'text-primary'
                      : 'text-foreground dark:text-background'
                  }`}
                >
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
