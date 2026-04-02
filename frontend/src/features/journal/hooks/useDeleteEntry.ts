import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteEntry } from '@/features/journal/services/journal.service';

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] });
      toast.success('Entry deleted.');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete entry';
      toast.error(message);
    },
  });
};
