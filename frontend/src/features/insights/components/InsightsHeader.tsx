'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { type TimeWindow } from '../services/insights.service';

const WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'All time', value: 'all' },
];

interface InsightsHeaderProps {
  name: string | null;
  email: string;
  memberSince: string;
  allTimeEntryCount: number;
  window: TimeWindow;
  onWindowChange: (w: TimeWindow) => void;
}

export default function InsightsHeader({
  name, email, memberSince, allTimeEntryCount, window, onWindowChange,
}: InsightsHeaderProps) {
  const router = useRouter();
  const displayName = name || email;
  const since = new Date(memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#EDE9E3] transition-colors shrink-0"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-[#2C2723]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#2C2723]">{displayName}</h1>
          <p className="text-sm text-[#2C2723]/60 mt-0.5">Member since {since} · {allTimeEntryCount} entries total</p>
        </div>
      </div>

      <div className="flex gap-1.5 bg-[#EDE9E3] rounded-xl p-1 self-start">
        {WINDOWS.map((w) => (
          <button
            key={w.value}
            onClick={() => onWindowChange(w.value)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              window === w.value
                ? 'bg-white text-[#2C2723] shadow-sm'
                : 'text-[#2C2723]/60 hover:text-[#2C2723]'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}
