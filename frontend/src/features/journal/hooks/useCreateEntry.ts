'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createEntry, type CreateEntryInput } from '@/features/journal/services/journal.service';

export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEntryInput) => createEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] });
      toast.success('Entry saved.');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to save entry';
      toast.error(message);
    },
  });
};
