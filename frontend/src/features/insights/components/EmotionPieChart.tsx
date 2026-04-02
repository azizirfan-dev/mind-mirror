'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type EmotionAverages } from '../services/insights.service';

const EMOTION_HEX: Record<keyof EmotionAverages, string> = {
  anxiety: '#F59E0B',
  stress: '#F97316',
  happiness: '#10B981',
  anger: '#F43F5E',
  sadness: '#60A5FA',
  depression: '#7C3AED',
};

interface EmotionPieChartProps {
  averages: EmotionAverages;
}

export default function EmotionPieChart({ averages }: EmotionPieChartProps) {
  const data = (Object.entries(averages) as [keyof EmotionAverages, number][]).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.round(value),
    color: EMOTION_HEX[key],
  }));

  return (
    <div className="bg-white border border-[#2C2723]/8 rounded-2xl p-5 flex flex-col gap-3 h-full">
      <h2 className="text-sm font-semibold text-[#2C2723]">Emotion Averages</h2>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value)}/100`, '']} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
