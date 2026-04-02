'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatInit, useChat, ChatMessage } from '@/features/chat/hooks/useChat';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { mutate: initSession, isPending: isInitializing, isError, sessionId } = useChatInit();
  const { messages, isStreaming, sendMessage } = useChat(sessionId);

  useEffect(() => {
    initSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !sessionId || isStreaming) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F5F2]">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isInitializing && <StatusBubble text="Starting session…" />}
        {isError && <StatusBubble text="Could not start session. Write a journal entry first." isError />}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-[#D6C7B2]/60 p-3">
        <div className="flex items-end gap-2 bg-[#EDE9E3] rounded-xl border border-[#D6C7B2] px-3 py-2 focus-within:border-[#7D8F82] transition-colors">
          <textarea
            rows={1}
            placeholder="Reflect on your thoughts…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!sessionId || isStreaming}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-[#2C2723] placeholder-[#2C2723]/30 leading-relaxed max-h-32 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !sessionId || isStreaming}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#7D8F82] hover:bg-[#6A7A6F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'ai') {
    return (
      <div className="flex justify-start">
        <div className="flex flex-col gap-1 max-w-[80%]">
          <span className="text-[10px] text-[#2C2723]/40 font-mono uppercase tracking-widest pl-1">
            MindMirror
          </span>
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#EDE9E3] text-[#2C2723] text-sm leading-relaxed">
            {msg.text}
            {msg.isStreaming && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7D8F82] animate-pulse align-text-bottom rounded-sm" />
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-[#7D8F82] text-white text-sm leading-relaxed max-w-[80%]">
        {msg.text}
      </div>
    </div>
  );
}

function StatusBubble({ text, isError = false }: { text: string; isError?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className={`px-4 py-3 rounded-2xl rounded-tl-sm text-sm ${isError ? 'bg-red-900/30 text-red-400' : 'bg-[#EDE9E3] text-[#2C2723]/50'}`}>
        {text}
      </div>
    </div>
  );
}
