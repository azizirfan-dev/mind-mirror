'use client';

import { useQuery } from '@tanstack/react-query';
import { getEntryById } from '@/features/journal/services/journal.service';

export const useJournalEntry = (id: string | null) => {
  return useQuery({
    queryKey: ['journal', 'entry', id],
    queryFn: () => getEntryById(id!),
    enabled: !!id,
    staleTime: 30_000,
    refetchInterval: (query) => (!query.state.data?.emotionScores ? 3_000 : false),
  });
};
