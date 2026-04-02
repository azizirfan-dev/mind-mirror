import { type EmotionScores } from '@/features/journal/services/journal.service';

export const EMOTION_COLORS: Record<keyof EmotionScores, string> = {
  anxiety:    'bg-amber-500',
  stress:     'bg-orange-500',
  happiness:  'bg-emerald-500',
  anger:      'bg-rose-500',
  sadness:    'bg-blue-400',
  depression: 'bg-violet-600',
};
