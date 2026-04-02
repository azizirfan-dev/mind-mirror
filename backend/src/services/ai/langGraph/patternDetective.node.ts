import type { PromptArchitectState } from './state';
import type { EmotionTrendPoint, EmotionAverages } from '../../insights/insights.types';

const NEGATIVE_EMOTIONS = ['anxiety', 'stress', 'anger', 'sadness', 'depression'] as const;
type NegativeEmotion = (typeof NEGATIVE_EMOTIONS)[number];

const TREND_KEY_MAP: Record<NegativeEmotion, keyof EmotionTrendPoint> = {
  anxiety: 'anxietyScore',
  stress: 'stressScore',
  anger: 'angerScore',
  sadness: 'sadnessScore',
  depression: 'depressionScore',
};

const hasEmotionData = (averages: EmotionAverages): boolean =>
  NEGATIVE_EMOTIONS.some((e) => averages[e] > 0);

const findDominantEmotion = (averages: EmotionAverages): NegativeEmotion =>
  NEGATIVE_EMOTIONS.reduce((a, b) => (averages[a] >= averages[b] ? a : b));

const avg = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;

const detectTrend = (
  emotion: NegativeEmotion,
  trend: EmotionTrendPoint[],
): 'rising' | 'falling' | 'stable' => {
  if (trend.length < 2) return 'stable';
  const key = TREND_KEY_MAP[emotion];
  const scores = trend.map((p) => p[key] as number);
  const split = Math.max(1, Math.floor(scores.length / 2));
  const recentAvg = avg(scores.slice(split));
  const olderAvg = avg(scores.slice(0, split));
  if (recentAvg - olderAvg > 10) return 'rising';
  if (olderAvg - recentAvg > 10) return 'falling';
  return 'stable';
};

const buildPatternDescription = (
  emotion: NegativeEmotion,
  score: number,
  trend: 'rising' | 'falling' | 'stable',
  recentDate: string | undefined,
): string => {
  const trendText =
    trend === 'rising'
      ? 'has been increasing recently'
      : trend === 'falling'
        ? 'has been improving recently'
        : 'has been consistent';
  const dateText = recentDate ? ` Most recent data: ${recentDate}.` : '';
  return `User's dominant emotion is ${emotion} at ${Math.round(score)}/100 and ${trendText}.${dateText}`;
};

export const patternDetectiveNode = (
  state: PromptArchitectState,
): Partial<PromptArchitectState> => {
  const { emotionAverages, emotionTrend } = state;

  if (!hasEmotionData(emotionAverages)) {
    return { dominantPattern: 'No emotion history yet — user is just getting started.' };
  }

  const dominant = findDominantEmotion(emotionAverages);
  const score = emotionAverages[dominant];
  const trend = detectTrend(dominant, emotionTrend);
  const recentDate = emotionTrend[emotionTrend.length - 1]?.date;

  return { dominantPattern: buildPatternDescription(dominant, score, trend, recentDate) };
};
