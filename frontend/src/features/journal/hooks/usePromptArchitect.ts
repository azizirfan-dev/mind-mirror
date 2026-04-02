import { useMutation } from '@tanstack/react-query';
import { generateWritingPrompt } from '../services/promptArchitect.service';

export const usePromptArchitect = () => {
  const { mutate, isPending, data, reset } = useMutation({
    mutationFn: generateWritingPrompt,
  });

  return {
    generatePrompt: mutate,
    isGenerating: isPending,
    prompt: data?.prompt ?? null,
    clearPrompt: reset,
  };
};
