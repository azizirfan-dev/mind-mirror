import { collectHfResponse } from '../hf.service';
import type { PromptArchitectState } from './state';

const FALLBACK_PROMPTS = [
  "What's one thing that's been taking up space in your mind lately?",
  "If you could describe how you're feeling right now using a weather metaphor, what would the forecast be?",
  "What's something you've been avoiding thinking about, and what's keeping you from it?",
  "Looking back at the past week, what moment stands out most — and why?",
  "What would you need right now to feel even 10% more at ease?",
];

const getRandomFallback = (): string =>
  FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];

const SYSTEM_PROMPT = `You are MindMirror's Prompt Architect — a compassionate journaling guide.
Your task: generate ONE highly specific, personalized Socratic journaling prompt.
Rules:
- Reference the user's actual emotional pattern in the prompt
- Ask ONE question only — no preamble, no explanation, no quotes
- Make it feel personal and clinically thoughtful, not generic
- Maximum 2 sentences`;

const buildUserMessage = (pattern: string): string =>
  `Emotional pattern: ${pattern}\nGenerate one personalized journaling prompt based on this pattern.`;

export const promptArchitectNode = async (
  state: PromptArchitectState,
): Promise<Partial<PromptArchitectState>> => {
  try {
    const raw = await collectHfResponse(SYSTEM_PROMPT, buildUserMessage(state.dominantPattern));
    return { generatedPrompt: raw.trim() };
  } catch {
    return { generatedPrompt: getRandomFallback() };
  }
};
