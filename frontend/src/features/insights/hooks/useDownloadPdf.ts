'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { downloadPdf, type TimeWindow } from '../services/insights.service';

const triggerBlobDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const useDownloadPdf = () =>
  useMutation({
    mutationFn: (window: TimeWindow) => downloadPdf(window),
    onSuccess: (blob, window) => {
      triggerBlobDownload(blob, `mindmirror-report-${window}.pdf`);
      toast.success('Report downloaded!');
    },
    onError: () => toast.error('Failed to generate PDF report.'),
  });
