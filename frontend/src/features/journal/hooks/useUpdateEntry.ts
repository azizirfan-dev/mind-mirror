import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateEntry, UpdateEntryInput } from '@/features/journal/services/journal.service';

export const useUpdateEntry = (entryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEntryInput) => updateEntry(entryId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entry', entryId] });
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] });
      toast.success('Entry updated.');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to update entry';
      toast.error(message);
    },
  });
};
