'use client';

import { useQuery } from '@tanstack/react-query';
import { generateSummary, type TimeWindow } from '../services/insights.service';

export const useInsightsSummary = (window: TimeWindow, enabled: boolean) =>
  useQuery({
    queryKey: ['insights', 'summary', window],
    queryFn: () => generateSummary(window),
    enabled,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
