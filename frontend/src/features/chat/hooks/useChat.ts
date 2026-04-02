'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { initChat, createChatStream, createWelcomeStream } from '@/features/chat/services/chat.service';

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
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const prevRef = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: (prevId?: string) => initChat(prevId),
    onSuccess: (data) => {
      prevRef.current = data.sessionId;
      setSessionId(data.sessionId);
    },
  });

  useEffect(() => {
    mutation.mutate(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshSession = useCallback(() => {
    if (isRefreshDisabled || mutation.isPending) return;
    setIsRefreshDisabled(true);
    setTimeout(() => setIsRefreshDisabled(false), 5000);
    mutation.mutate(prevRef.current ?? undefined);
  }, [isRefreshDisabled, mutation]);

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    sessionId,
    refreshSession,
    isRefreshDisabled,
  };
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

  // Auto-start welcome stream whenever sessionId becomes active (init or refresh)
  useEffect(() => {
    esRef.current?.close();
    if (!sessionId) {
      setIsStreaming(false);
      return;
    }
    setMessages([]);
    setIsStreaming(true);
    // createWelcomeStream is a stable import — excluded from deps intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
    createWelcomeStream(sessionId).then((es) => {
      esRef.current = es;
      attachListeners(es);
    });
  }, [sessionId, attachListeners]);

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
