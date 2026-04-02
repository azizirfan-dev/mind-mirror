'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SafetyBannerProps {
  isVisible: boolean;
}

export default function SafetyBanner({ isVisible }: SafetyBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isVisible || dismissed) return null;

  return (
    <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-rose-700 leading-relaxed">
        Your recent emotional patterns suggest elevated distress. We encourage you to reach out to a
        qualified mental health professional for personalized support.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
