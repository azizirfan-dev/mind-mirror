'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useInsightsSummary } from '../hooks/useInsightsSummary';
import { type TimeWindow } from '../services/insights.service';

interface AISummaryCardProps {
  window: TimeWindow;
}

export default function AISummaryCard({ window }: AISummaryCardProps) {
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, isError } = useInsightsSummary(window, enabled);

  return (
    <div className="bg-white border border-[#2C2723]/8 rounded-2xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#7D8F82]" />
        <h2 className="text-sm font-semibold text-[#2C2723]">Emotional Journey Summary</h2>
      </div>

      {!enabled && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
          <p className="text-sm text-[#2C2723]/50 text-center">AI-generated reflection of your emotional patterns in this period.</p>
          <button
            onClick={() => setEnabled(true)}
            className="min-h-[44px] px-4 py-2 bg-[#7D8F82] text-white rounded-xl text-sm font-medium hover:bg-[#6B7D70] transition-colors"
          >
            Generate Summary
          </button>
        </div>
      )}

      {enabled && isLoading && (
        <div className="flex-1 flex flex-col gap-2 animate-pulse py-2">
          <div className="h-3 bg-[#EDE9E3] rounded w-full" />
          <div className="h-3 bg-[#EDE9E3] rounded w-5/6" />
          <div className="h-3 bg-[#EDE9E3] rounded w-4/5" />
          <div className="h-3 bg-[#EDE9E3] rounded w-full mt-2" />
          <div className="h-3 bg-[#EDE9E3] rounded w-3/4" />
        </div>
      )}

      {enabled && isError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
          <p className="text-sm text-rose-500 text-center">Failed to generate summary. Please try again.</p>
          <button onClick={() => setEnabled(false)} className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 border border-[#2C2723]/15 rounded-xl text-sm text-[#2C2723]/60 hover:bg-[#EDE9E3] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {enabled && data && (
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-[11px] text-[#2C2723]/40">Based on {data.entryCount} entries in this period</p>
          <p className="text-sm text-[#2C2723]/80 leading-relaxed">{data.summary}</p>
        </div>
      )}
    </div>
  );
}
