import { Annotation } from '@langchain/langgraph';
import type { EmotionTrendPoint, EmotionAverages } from '../../insights/insights.types';

export const PromptArchitectStateAnnotation = Annotation.Root({
  userId: Annotation<string>(),
  emotionTrend: Annotation<EmotionTrendPoint[]>(),
  emotionAverages: Annotation<EmotionAverages>(),
  dominantPattern: Annotation<string>(),
  generatedPrompt: Annotation<string>(),
  error: Annotation<string | null>(),
});

export type PromptArchitectState = typeof PromptArchitectStateAnnotation.State;
