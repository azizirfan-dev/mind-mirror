'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useCreateEntry } from '@/features/journal/hooks/useCreateEntry';
import { usePromptArchitect } from '@/features/journal/hooks/usePromptArchitect';
import PromptSuggestionCard from './PromptSuggestionCard';

const countWords = (text: string) =>
  text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

export default function JournalEditorPanel() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dateHeader, setDateHeader] = useState('');
  const { mutate: saveEntry, isPending } = useCreateEntry();
  const { generatePrompt, isGenerating, prompt, clearPrompt } = usePromptArchitect();
  const wordCount = countWords(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDateHeader(new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    }));
  }, []);

  useEffect(() => {
    const focus = () => { setTitle(''); setContent(''); clearPrompt(); textareaRef.current?.focus(); };
    window.addEventListener('journal:new-entry', focus);
    return () => window.removeEventListener('journal:new-entry', focus);
  }, [clearPrompt]);

  const handleSave = () => {
    if (!content.trim()) return;
    saveEntry(
      { title: title.trim() || undefined, content },
      { onSuccess: () => { setTitle(''); setContent(''); clearPrompt(); } },
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F5F2]">
      <div className="px-5 pt-5 pb-2 shrink-0">
        <p className="text-xs font-mono uppercase tracking-widest text-[#2C2723]/40">
          {dateHeader}
        </p>
      </div>

      <div className="px-5 pt-3 pb-1 shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title (optional)"
          className="w-full bg-transparent outline-none text-lg font-semibold text-[#2C2723] placeholder-[#2C2723]/25 font-sans"
        />
      </div>

      {prompt && (
        <PromptSuggestionCard
          prompt={prompt}
          onDismiss={clearPrompt}
        />
      )}

      <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today..."
          className="w-full flex-1 bg-transparent resize-none outline-none text-[#2C2723] placeholder-[#2C2723]/30 text-base leading-relaxed font-sans"
        />
        {wordCount === 0 && !prompt && (
          <button
            onClick={() => generatePrompt()}
            disabled={isGenerating}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#7D8F82] hover:text-[#6A7A6F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Finding your prompt...</span>
              </>
            ) : (
              <>
                <span>✦</span>
                <span>Help me start</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="shrink-0 border-t border-[#D6C7B2]/60 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-[#2C2723]/40 font-mono">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <button
          onClick={handleSave}
          disabled={wordCount === 0 || isPending}
          className="h-9 px-5 rounded-lg bg-[#7D8F82] hover:bg-[#6A7A6F] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
}
