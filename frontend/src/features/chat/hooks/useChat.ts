'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { initChat, createChatStream } from '@/features/chat/services/chat.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
}

interface SsePayload {
  type: string;
  text?: string;
  message?: string;
}

export const useChatInit = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: initChat,
    onSuccess: (data) => setSessionId(data.sessionId),
  });

  return { ...mutation, sessionId };
};

const appendChunk = (prev: ChatMessage[], chunk: string): ChatMessage[] => {
  const last = prev[prev.length - 1];
  if (last?.role === 'ai' && last.isStreaming) {
    return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
  }
  return [...prev, { id: Date.now().toString(), role: 'ai', text: chunk, isStreaming: true }];
};

const finalizeLastMessage = (prev: ChatMessage[]): ChatMessage[] => {
  const last = prev[prev.length - 1];
  if (last?.role === 'ai' && last.isStreaming) {
    return [...prev.slice(0, -1), { ...last, isStreaming: false }];
  }
  return prev;
};

export const useChat = (sessionId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => () => { esRef.current?.close(); }, []);

  const handleDone = useCallback((es: EventSource) => {
    setMessages((prev) => finalizeLastMessage(prev));
    setIsStreaming(false);
    es.close();
  }, []);

  const handleError = useCallback((es: EventSource, errorText: string) => {
    setMessages((prev) => finalizeLastMessage(appendChunk(prev, errorText)));
    setIsStreaming(false);
    es.close();
  }, []);

  const attachListeners = useCallback(
    (es: EventSource) => {
      let closed = false;
      const close = (errorText?: string) => {
        if (closed) return;
        closed = true;
        if (errorText) handleError(es, errorText);
        else handleDone(es);
      };

      es.onmessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data as string) as SsePayload;
        if (data.type === 'chunk' && data.text) setMessages((p) => appendChunk(p, data.text!));
        if (data.type === 'done') close();
        if (data.type === 'error') close(data.message ?? 'Stream failed');
        // ping: ignore
      };
      es.onerror = () => close('AI is warming up, try again in a moment.');
    },
    [handleDone, handleError],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!sessionId || isStreaming) return;
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', text }]);
      setIsStreaming(true);
      esRef.current?.close();
      const es = await createChatStream(sessionId, text);
      esRef.current = es;
      attachListeners(es);
    },
    [sessionId, isStreaming, attachListeners],
  );

  return { messages, isStreaming, sendMessage };
};
