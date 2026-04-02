import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_TOKEN);
const EMOTION_MODEL = process.env.HF_EMOTION_MODEL ?? 'j-hartmann/emotion-english-distilroberta-base';

export interface EmotionScoreData {
  anxietyScore: number;
  stressScore: number;
  happinessScore: number;
  angerScore: number;
  sadnessScore: number;
  depressionScore: number;
}

const fetchEmotionLabels = async (text: string) => {
  return hf.textClassification({ model: EMOTION_MODEL, inputs: text });
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const withRetry = async (text: string) => {
  try {
    return await fetchEmotionLabels(text);
  } catch {
    await delay(2000);
    try { return await fetchEmotionLabels(text); } catch { return null; }
  }
};

const getLabelScore = (labels: Array<{ label: string; score: number }>, name: string) =>
  labels.find(l => l.label === name)?.score ?? 0;

const mapToScores = (labels: Array<{ label: string; score: number }>): EmotionScoreData => {
  const get = (name: string) => getLabelScore(labels, name);
  const anxietyScore = Math.round(get('fear') * 100);
  const stressScore = Math.round(((get('disgust') + get('sadness')) / 2) * 100);
  const happinessScore = Math.round(get('joy') * 100);
  const angerScore = Math.round(get('anger') * 100);
  const sadnessScore = Math.round(get('sadness') * 100);
  const depressionScore = Math.round((anxietyScore + stressScore + sadnessScore) / 3);
  return { anxietyScore, stressScore, happinessScore, angerScore, sadnessScore, depressionScore };
};

export const computeEmotionScores = async (text: string): Promise<EmotionScoreData | null> => {
  const labels = await withRetry(text);
  if (!labels) return null;
  return mapToScores(labels);
};
