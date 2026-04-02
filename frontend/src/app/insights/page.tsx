'use client';

import { useState } from 'react';
import { useInsights } from '@/features/insights/hooks/useInsights';
import { type TimeWindow, type EmotionAverages } from '@/features/insights/services/insights.service';
import InsightsHeader from '@/features/insights/components/InsightsHeader';
import SafetyBanner from '@/features/insights/components/SafetyBanner';
import AISummaryCard from '@/features/insights/components/AISummaryCard';
import JournalStatsCard from '@/features/insights/components/JournalStatsCard';
import EmotionTrendChart from '@/features/insights/components/EmotionTrendChart';
import EmotionPieChart from '@/features/insights/components/EmotionPieChart';
import ActivityHeatmap from '@/features/insights/components/ActivityHeatmap';
import ExportPdfButton from '@/features/insights/components/ExportPdfButton';

const computeSafetyAlert = (avg: EmotionAverages): boolean => {
  const { anxiety, stress, anger, sadness, depression } = avg;
  return (anxiety + stress + anger + sadness + depression) / 5 > 70;
};

const LoadingSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="h-16 bg-[#EDE9E3] rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 h-48 bg-[#EDE9E3] rounded-2xl" />
      <div className="h-48 bg-[#EDE9E3] rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 h-72 bg-[#EDE9E3] rounded-2xl" />
      <div className="h-72 bg-[#EDE9E3] rounded-2xl" />
    </div>
    <div className="h-48 bg-[#EDE9E3] rounded-2xl" />
  </div>
);

export default function InsightsPage() {
  const [window, setWindow] = useState<TimeWindow>('30d');
  const { data, isLoading, isError } = useInsights(window);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-4 md:p-8 flex items-center justify-center">
        <p className="text-sm text-rose-500">Failed to load insights. Please try again.</p>
      </main>
    );
  }

  const isSafetyAlert = computeSafetyAlert(data.emotionAverages);

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Row 1 — Header */}
        <InsightsHeader
          name={data.user.name}
          email={data.user.email}
          memberSince={data.user.createdAt}
          allTimeEntryCount={data.user.allTimeEntryCount}
          window={window}
          onWindowChange={setWindow}
        />

        {/* Safety banner */}
        <SafetyBanner isVisible={isSafetyAlert} />

        {/* Row 2 — AI Summary + Journal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <AISummaryCard window={window} />
          </div>
          <div className="md:col-span-1">
            <JournalStatsCard stats={data.journalStats} />
          </div>
        </div>

        {/* Row 3 — Trend + Pie chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 min-h-[300px]">
            <EmotionTrendChart trend={data.emotionTrend} />
          </div>
          <div className="md:col-span-1 min-h-[300px]">
            <EmotionPieChart averages={data.emotionAverages} />
          </div>
        </div>

        {/* Row 4 — Activity heatmap */}
        <ActivityHeatmap activity={data.activity} streaks={data.streaks} />

        {/* Row 5 — Export */}
        <ExportPdfButton window={window} />

      </div>
    </main>
  );
}
