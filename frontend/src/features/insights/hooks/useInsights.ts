'use client';

import { useQuery } from '@tanstack/react-query';
import { getInsights, type TimeWindow } from '../services/insights.service';

export const useInsights = (window: TimeWindow) =>
  useQuery({
    queryKey: ['insights', window],
    queryFn: () => getInsights(window),
    staleTime: 5 * 60 * 1000,
  });
