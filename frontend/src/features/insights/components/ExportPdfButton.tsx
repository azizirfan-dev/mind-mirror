'use client';

import { Download, Loader2 } from 'lucide-react';
import { useDownloadPdf } from '../hooks/useDownloadPdf';
import { type TimeWindow } from '../services/insights.service';

interface ExportPdfButtonProps {
  window: TimeWindow;
}

export default function ExportPdfButton({ window }: ExportPdfButtonProps) {
  const { mutate, isPending } = useDownloadPdf();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => mutate(window)}
        disabled={isPending}
        className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-[#2C2723] text-white rounded-xl text-sm font-medium hover:bg-[#1a1714] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating report…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export PDF Report
          </>
        )}
      </button>
    </div>
  );
}
