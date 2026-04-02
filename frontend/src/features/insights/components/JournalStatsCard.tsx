'use client';

import { BookOpen } from 'lucide-react';
import { type JournalStats } from '../services/insights.service';

const EMOTION_COLORS: Record<string, string> = {
  anxiety: 'text-amber-600',
  stress: 'text-orange-500',
  happiness: 'text-emerald-600',
  anger: 'text-rose-500',
  sadness: 'text-blue-400',
  depression: 'text-violet-600',
};

interface StatRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function StatRow({ label, value, valueClass = 'text-[#2C2723]' }: StatRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] text-[#2C2723]/40 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

interface JournalStatsCardProps {
  stats: JournalStats;
}

export default function JournalStatsCard({ stats }: JournalStatsCardProps) {
  const { totalEntriesInWindow, longestEntry, shortestEntry, mostActiveDayOfWeek, dominantEmotion } = stats;

  return (
    <div className="bg-white border border-[#2C2723]/8 rounded-2xl p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#7D8F82]" />
        <h2 className="text-sm font-semibold text-[#2C2723]">Journal Stats</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatRow label="Total Entries" value={String(totalEntriesInWindow)} />
        <StatRow
          label="Longest Entry"
          value={longestEntry ? `${longestEntry.wordCount} words` : '—'}
        />
        <StatRow
          label="Shortest Entry"
          value={shortestEntry ? `${shortestEntry.wordCount} words` : '—'}
        />
        <StatRow label="Most Active Day" value={mostActiveDayOfWeek} />
        <StatRow
          label="Dominant Emotion"
          value={dominantEmotion === 'N/A' ? '—' : dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
          valueClass={EMOTION_COLORS[dominantEmotion] ?? 'text-[#2C2723]'}
        />
      </div>
    </div>
  );
}
