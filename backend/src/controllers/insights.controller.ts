import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import * as insightsService from '../services/insights/insights.service';
import * as summaryService from '../services/insights/insights.summary.service';
import * as pdfService from '../services/insights/insights.pdf.service';

const WindowQuerySchema = z.object({
  window: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
});

const SummaryBodySchema = z.object({
  window: z.enum(['7d', '30d', '90d', 'all']),
});

const sendSuccess = (res: Response, data: unknown, status = 200) => {
  res.status(status).json({ success: true, data });
};

const sendErr = (res: Response, error: unknown, status = 500) => {
  const message = error instanceof Error ? error.message : 'Error';
  res.status(status).json({ success: false, error: message });
};

export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { window } = WindowQuerySchema.parse(req.query);
    const data = await insightsService.getInsightsData(req.user.id, window);
    sendSuccess(res, data);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { window } = SummaryBodySchema.parse(req.body);
    const data = await summaryService.generateSummary(req.user.id, window);
    sendSuccess(res, data);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const downloadPdf = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { window } = WindowQuerySchema.parse(req.query);
    const [insights, summaryData] = await Promise.all([
      insightsService.getInsightsData(req.user.id, window),
      summaryService.generateSummary(req.user.id, window),
    ]);
    const buffer = await pdfService.generatePdfBuffer(insights, summaryData.summary, summaryData.entryCount, window);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="mindmirror-report-${window}.pdf"`);
    res.send(buffer);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};
