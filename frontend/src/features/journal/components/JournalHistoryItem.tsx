'use client';

import { EMOTION_COLORS } from '@/shared/constants/emotions';
import { type EmotionScores, type JournalListItem } from '@/features/journal/services/journal.service';

interface Props {
  entry: JournalListItem;
  isSelected: boolean;
  onClick: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const EmotionDots = ({ scores }: { scores: EmotionScores | null }) => (
  <div className="flex gap-1 mt-2">
    {(Object.keys(EMOTION_COLORS) as Array<keyof EmotionScores>).map((key) => (
      <span
        key={key}
        className={`w-2 h-2 rounded-full shrink-0 ${scores ? EMOTION_COLORS[key] : 'bg-[#D6C7B2]'}`}
      />
    ))}
  </div>
);

export default function JournalHistoryItem({ entry, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
        isSelected ? 'bg-[#D6C7B2]/40' : 'hover:bg-[#EDE9E3]'
      }`}
    >
      <p className="text-xs text-[#2C2723]/50 font-mono mb-1">{formatDate(entry.createdAt)}</p>
      {entry.title ? (
        <>
          <p className="text-sm font-semibold text-[#2C2723] truncate leading-snug">{entry.title}</p>
          <p className="text-xs text-[#2C2723]/50 truncate leading-snug mt-0.5">{entry.preview}</p>
        </>
      ) : (
        <p className="text-sm text-[#2C2723]/80 truncate leading-snug">{entry.preview}</p>
      )}
      <EmotionDots scores={entry.emotionScores} />
    </button>
  );
}
