import { InferenceClient, InferenceClientProviderApiError } from '@huggingface/inference';
import type { ChatCompletionInputMessage } from '@huggingface/tasks';

const hf = new InferenceClient(process.env.HF_API_TOKEN);

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface EmotionContext {
  anxiety: number | null;
  stress: number | null;
  happiness: number | null;
  anger: number | null;
  sadness: number | null;
  depression: number | null;
}

const buildSystemPrompt = (journalContent: string): string =>
  `You are MindMirror, a Socratic reflection guide.
You do NOT give advice. You ask ONE thoughtful question at a time
based on the user's journal entry to help them reflect deeper.
Journal context: ${journalContent}`;

const buildNoJournalWelcomePrompt = (): string =>
  `You are MindMirror, a warm and empathetic psychological companion.
Send ONE warm, welcoming greeting to the user who just opened the app.
Be natural and inviting. Ask gently how they feel today. Keep it under 30 words.`;

const formatEmotionHint = (emotions: EmotionContext): string => {
  const nonNull = Object.entries(emotions).filter(([, v]) => v !== null);
  if (!nonNull.length) return '';
  return `\nInternal calibration only — NEVER reveal these to the user: ${nonNull.map(([k, v]) => `${k}=${v}`).join(', ')}`;
};

const buildJournalWelcomePrompt = (content: string, emotions: EmotionContext | null): string =>
  `You are MindMirror, a warm and empathetic Socratic reflection guide.
The user just opened the app. Send ONE warm, personalized welcome based on their latest journal entry.
Use emotion signals to calibrate tone — NEVER mention scores, numbers, or emotion labels explicitly.
Be natural and human. End with a gentle Socratic question. Keep it under 30 words.${emotions ? formatEmotionHint(emotions) : ''}
Journal: ${content}`;

const buildWelcomePrompt = (journalContent: string, emotions: EmotionContext | null): string =>
  journalContent ? buildJournalWelcomePrompt(journalContent, emotions) : buildNoJournalWelcomePrompt();

const extractChunkText = (chunk: { choices: Array<{ delta: { content?: string } }> }): string =>
  chunk.choices[0]?.delta?.content ?? '';

const mapHfError = (err: unknown): Error => {
  if (err instanceof InferenceClientProviderApiError && err.httpResponse.status === 503)
    return new Error('AI is warming up, try again in a moment.');
  return err instanceof Error ? err : new Error('HF stream error');
};

export async function collectHfResponse(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userMessage },
  ] as unknown as import('@huggingface/tasks').ChatCompletionInputMessage[];
  const stream = hf.chatCompletionStream({ model: process.env.HF_MODEL!, messages, max_tokens: 512 });
  const parts: string[] = [];
  try {
    for await (const chunk of stream) {
      const text = extractChunkText(chunk);
      if (text) parts.push(text);
    }
  } catch (err) {
    throw mapHfError(err);
  }
  return parts.join('');
}

export async function* streamWelcomeMessage(
  journalContent: string,
  emotions: EmotionContext | null,
): AsyncIterable<string> {
  const hfMessages = [
    { role: 'system' as const, content: buildWelcomePrompt(journalContent, emotions) },
    { role: 'user' as const, content: 'Begin.' },
  ] as unknown as import('@huggingface/tasks').ChatCompletionInputMessage[];
  const stream = hf.chatCompletionStream({ model: process.env.HF_MODEL!, messages: hfMessages, max_tokens: 150 });
  try {
    for await (const chunk of stream) {
      const text = extractChunkText(chunk);
      if (text) yield text;
    }
  } catch (err) {
    throw mapHfError(err);
  }
}

export async function* streamSocraticResponse(
  journalContent: string,
  messages: ChatMessage[]
): AsyncIterable<string> {
  const systemMsg: ChatMessage = { role: 'system', content: buildSystemPrompt(journalContent) };
  const hfMessages = [systemMsg, ...messages] as unknown as ChatCompletionInputMessage[];
  const stream = hf.chatCompletionStream({
    model: process.env.HF_MODEL!,
    messages: hfMessages,
    max_tokens: 512,
  });
  try {
    for await (const chunk of stream) {
      const text = extractChunkText(chunk);
      if (text) yield text;
    }
  } catch (err) {
    throw mapHfError(err);
  }
}
