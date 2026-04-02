'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { type EmotionTrendPoint } from '../services/insights.service';

const EMOTIONS = [
  { key: 'anxietyScore', label: 'Anxiety', color: '#F59E0B' },
  { key: 'stressScore', label: 'Stress', color: '#F97316' },
  { key: 'happinessScore', label: 'Happiness', color: '#10B981' },
  { key: 'angerScore', label: 'Anger', color: '#F43F5E' },
  { key: 'sadnessScore', label: 'Sadness', color: '#60A5FA' },
  { key: 'depressionScore', label: 'Depression', color: '#7C3AED' },
] as const;

interface EmotionTrendChartProps {
  trend: EmotionTrendPoint[];
}

export default function EmotionTrendChart({ trend }: EmotionTrendChartProps) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const toggleLine = (key: string) =>
    setHidden((prev) => ({ ...prev, [key]: !prev[key] }));

  const formatted = trend.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-white border border-[#2C2723]/8 rounded-2xl p-5 flex flex-col gap-3 h-full">
      <h2 className="text-sm font-semibold text-[#2C2723]">Emotion Trends</h2>
      {trend.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[240px]">
          <p className="text-sm text-[#2C2723]/40">No scored entries in this period yet.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#2C2723', opacity: 0.5 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#2C2723', opacity: 0.5 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #2C272315' }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', cursor: 'pointer' }}
                onClick={({ dataKey }) => typeof dataKey === 'string' && toggleLine(dataKey)}
              />
              {EMOTIONS.map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                  hide={hidden[key] ?? false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
