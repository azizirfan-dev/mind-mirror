'use client';

import { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import { useJournalEntry } from '@/features/journal/hooks/useJournalEntry';
import { useUpdateEntry } from '@/features/journal/hooks/useUpdateEntry';
import { useDeleteEntry } from '@/features/journal/hooks/useDeleteEntry';
import { EMOTION_COLORS } from '@/shared/constants/emotions';
import { type EmotionScores } from '@/features/journal/services/journal.service';

interface Props {
  entryId: string;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

const EmotionBadges = ({ scores }: { scores: EmotionScores }) => (
  <div className="flex flex-wrap gap-2">
    {(Object.keys(EMOTION_COLORS) as Array<keyof EmotionScores>).map((key) => (
      <span
        key={key}
        className={`${EMOTION_COLORS[key]} text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize`}
      >
        {key} {scores[key] ?? '—'}
      </span>
    ))}
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 w-48 bg-[#D6C7B2]/40 rounded" />
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <div key={i} className="h-3 bg-[#D6C7B2]/40 rounded w-full" />)}
    </div>
    <div className="flex gap-2">
      {[...Array(6)].map((_, i) => <div key={i} className="h-6 w-20 bg-[#D6C7B2]/40 rounded-full" />)}
    </div>
  </div>
);

export default function JournalEntryModal({ entryId, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { data: entry, isLoading } = useJournalEntry(entryId);
  const { mutate: saveUpdate, isPending: isSaving } = useUpdateEntry(entryId);
  const { mutate: confirmDelete, isPending: isDeleting } = useDeleteEntry();

  const handleEditStart = () => {
    setEditTitle(entry?.title ?? '');
    setEditContent(entry?.content ?? '');
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const handleSave = () => {
    if (!editContent.trim()) return;
    saveUpdate(
      { title: editTitle.trim() || undefined, content: editContent },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    confirmDelete(entryId, { onSuccess: onClose });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2C2723]/30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#F7F5F2] border border-[#D6C7B2] rounded-xl p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3 flex items-center gap-0.5">
          {!isEditing && !isConfirmingDelete && (
            <>
              <button
                onClick={handleEditStart}
                title="Edit"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#2C2723]/40 hover:text-[#2C2723] hover:bg-[#EDE9E3] transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsConfirmingDelete(true)}
                title="Delete"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#2C2723]/40 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            title="Close"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#2C2723]/40 hover:text-[#2C2723] hover:bg-[#EDE9E3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading || !entry ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-[#2C2723]/50">
              {formatDate(entry.createdAt)}
            </p>

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Entry title (optional)"
                className="w-full bg-transparent outline-none text-lg font-semibold text-[#2C2723] placeholder-[#2C2723]/30 border-b border-[#D6C7B2] pb-1 focus:border-[#7D8F82] transition-colors"
              />
            ) : entry.title ? (
              <h2 className="text-lg font-semibold text-[#2C2723]">{entry.title}</h2>
            ) : null}

            <div className="max-h-72 overflow-y-auto pr-1">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[140px] bg-[#EDE9E3] border border-[#D6C7B2] rounded-lg px-3 py-2.5 text-sm text-[#2C2723] leading-relaxed resize-none outline-none focus:border-[#7D8F82] transition-colors"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-[#2C2723] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              )}
            </div>

            {!isEditing && (
              entry.emotionScores ? (
                <EmotionBadges scores={entry.emotionScores} />
              ) : (
                <p className="text-xs text-[#2C2723]/40 font-serif italic">Emotion scores processing...</p>
              )
            )}

            {(isEditing || isConfirmingDelete) && (
              <div className="border-t border-[#D6C7B2]/60 pt-4">
                <ModalFooter
                  isEditing={isEditing}
                  isConfirmingDelete={isConfirmingDelete}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                  hasChanged={editContent !== entry.content || editTitle !== (entry.title ?? '')}
                  onEditCancel={handleEditCancel}
                  onSave={handleSave}
                  onDeleteCancel={() => setIsConfirmingDelete(false)}
                  onDeleteConfirm={handleDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface FooterProps {
  isEditing: boolean;
  isConfirmingDelete: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  hasChanged: boolean;
  onEditCancel: () => void;
  onSave: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

function ModalFooter({
  isEditing, isConfirmingDelete, isSaving, isDeleting,
  hasChanged, onEditCancel, onSave, onDeleteCancel, onDeleteConfirm,
}: FooterProps) {
  if (isEditing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onEditCancel}
          className="h-9 px-4 rounded-lg border border-[#D6C7B2] text-sm text-[#2C2723]/70 hover:bg-[#EDE9E3] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!hasChanged || isSaving}
          className="h-9 px-5 rounded-lg bg-[#7D8F82] hover:bg-[#6A7A6F] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    );
  }

  if (isConfirmingDelete) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm font-serif italic text-[#2C2723]/60">Delete this entry?</span>
        <div className="flex gap-2">
          <button
            onClick={onDeleteCancel}
            className="h-9 px-4 rounded-lg border border-[#D6C7B2] text-sm text-[#2C2723]/70 hover:bg-[#EDE9E3] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDeleteConfirm}
            disabled={isDeleting}
            className="h-9 px-4 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
