'use client';

import { X } from 'lucide-react';

interface PromptSuggestionCardProps {
  prompt: string;
  onDismiss: () => void;
}

export default function PromptSuggestionCard({ prompt, onDismiss }: PromptSuggestionCardProps) {
  return (
    <div className="mx-5 mb-3 rounded-xl border border-[#7D8F82]/30 bg-[#EEF0EC] px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="mt-0.5 shrink-0 text-[#7D8F82] text-sm">✦</span>
          <p className="text-sm text-[#2C2723]/80 leading-relaxed">{prompt}</p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss prompt"
          className="shrink-0 mt-0.5 p-1 rounded-md text-[#2C2723]/30 hover:text-[#2C2723]/60 hover:bg-[#D6C7B2]/40 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
