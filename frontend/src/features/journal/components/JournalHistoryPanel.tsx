'use client';

import { useState } from 'react';
import { Search, PenLine } from 'lucide-react';
import { useJournalEntries } from '@/features/journal/hooks/useJournalEntries';
import JournalHistoryItem from './JournalHistoryItem';
import JournalEntryModal from './JournalEntryModal';
import UserBadge from '@/shared/layout/UserBadge';

const SkeletonItem = () => (
  <div className="px-3 py-3 rounded-lg animate-pulse">
    <div className="h-2.5 w-20 bg-[#D6C7B2]/40 rounded mb-2" />
    <div className="h-3.5 bg-[#D6C7B2]/40 rounded w-full" />
    <div className="flex gap-1 mt-2">
      {[...Array(6)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-[#D6C7B2]/40" />)}
    </div>
  </div>
);

export default function JournalHistoryPanel() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useJournalEntries();

  const entries = data?.data ?? [];
  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return e.preview.toLowerCase().includes(q) || (e.title ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#F7F5F2]">
      <UserBadge />
      <div className="px-3 pt-4 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2C2723]/40" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#EDE9E3] border border-[#D6C7B2] text-sm text-[#2C2723]/80 placeholder-[#2C2723]/30 outline-none focus:border-[#7D8F82] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {isLoading ? (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : filtered.length === 0 ? (
          <p className="text-center text-xs text-[#2C2723]/40 font-serif italic mt-8">No entries found.</p>
        ) : (
          filtered.map((entry) => (
            <JournalHistoryItem
              key={entry.id}
              entry={entry}
              isSelected={entry.id === selectedId}
              onClick={() => setSelectedId(entry.id)}
            />
          ))
        )}
      </div>

      <div className="p-3 shrink-0 border-t border-[#D6C7B2]/60">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('journal:new-entry'))}
          className="flex items-center justify-center gap-2 w-full h-9 rounded-lg bg-[#7D8F82] hover:bg-[#6A7A6F] text-white text-sm font-medium transition-colors"
        >
          <PenLine className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {selectedId && (
        <JournalEntryModal entryId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
