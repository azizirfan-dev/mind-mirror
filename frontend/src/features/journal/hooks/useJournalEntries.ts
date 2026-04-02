'use client';

import { useQuery } from '@tanstack/react-query';
import { getEntries } from '@/features/journal/services/journal.service';

export const useJournalEntries = (page = 1) => {
  return useQuery({
    queryKey: ['journal', 'entries', page],
    queryFn: () => getEntries(page),
    staleTime: 30_000,
  });
};
