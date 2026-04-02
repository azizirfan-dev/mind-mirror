'use client';

import { type ActivityDay, type StreakData } from '../services/insights.service';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_TO_SHOW = 26;

const getIntensityClass = (count: number): string => {
  if (count === 0) return 'bg-[#EDE9E3]';
  if (count === 1) return 'bg-[#7D8F82]/40';
  if (count === 2) return 'bg-[#7D8F82]/65';
  return 'bg-[#7D8F82]';
};

const buildGrid = (activity: ActivityDay[]): (number | null)[][] => {
  const countMap = new Map(activity.map((d) => [d.date, d.count]));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setUTCDate(startDay.getUTCDate() - (WEEKS_TO_SHOW * 7 - 1));
  const grid: (number | null)[][] = Array.from({ length: 7 }, () => []);
  const cursor = new Date(startDay);
  while (cursor <= today) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const dayOfWeek = cursor.getUTCDay();
    grid[dayOfWeek].push(countMap.get(dateStr) ?? 0);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return grid;
};

interface StreakChipProps {
  label: string;
  value: string;
}

function StreakChip({ label, value }: StreakChipProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 py-2 bg-[#F7F5F2] rounded-xl">
      <span className="text-base font-bold text-[#2C2723]">{value}</span>
      <span className="text-[11px] text-[#2C2723]/50">{label}</span>
    </div>
  );
}

interface ActivityHeatmapProps {
  activity: ActivityDay[];
  streaks: StreakData;
}

export default function ActivityHeatmap({ activity, streaks }: ActivityHeatmapProps) {
  const grid = buildGrid(activity);
  const maxCols = Math.max(...grid.map((row) => row.length));

  return (
    <div className="bg-white border border-[#2C2723]/8 rounded-2xl p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-[#2C2723]">Journaling Activity</h2>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-0">
          <div className="flex flex-col gap-0.5 mr-1 justify-around">
            {DAY_LABELS.map((d) => (
              <span key={d} className="text-[9px] text-[#2C2723]/30 w-6 text-right">{d}</span>
            ))}
          </div>
          {Array.from({ length: maxCols }, (_, col) => (
            <div key={col} className="flex flex-col gap-0.5">
              {grid.map((row, dayIndex) => {
                const count = row[col];
                if (count === undefined || count === null) return <div key={dayIndex} className="w-3 h-3" />;
                return (
                  <div
                    key={dayIndex}
                    title={`${count} ${count === 1 ? 'entry' : 'entries'}`}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(count)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <StreakChip label="Current Streak" value={`${streaks.currentStreak}d`} />
        <StreakChip label="Longest Streak" value={`${streaks.longestStreak}d`} />
        <StreakChip label="Active Days" value={String(streaks.totalActiveDays)} />
      </div>
    </div>
  );
}
