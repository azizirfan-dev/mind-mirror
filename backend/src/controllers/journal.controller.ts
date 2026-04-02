import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import { CreateEntrySchema, UpdateEntrySchema, EntryParamsSchema, ListQuerySchema } from '../shared/schemas';
import * as journalService from '../services/journal.service';

const sendSuccess = (res: Response, data: unknown, status = 200) => {
  res.status(status).json({ success: true, data });
};

const sendErr = (res: Response, error: unknown, status = 500) => {
  const message = error instanceof Error ? error.message : 'Error';
  res.status(status).json({ success: false, error: message });
};

export const createEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = CreateEntrySchema.parse(req.body);
    if (!req.user?.id) throw new Error('Unauthorized');
    const entry = await journalService.processEntry(req.user.id, content, title);
    sendSuccess(res, entry, 201);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const getEntries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { page, limit } = ListQuerySchema.parse(req.query);
    const result = await journalService.getUserEntries(req.user.id, page, limit);
    sendSuccess(res, result);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const getEntryById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { id } = EntryParamsSchema.parse(req.params);
    const entry = await journalService.getEntry(req.user.id, id);
    if (!entry) return sendErr(res, new Error('Not found'), 404);
    sendSuccess(res, entry);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { id } = EntryParamsSchema.parse(req.params);
    const { title, content } = UpdateEntrySchema.parse(req.body);
    const entry = await journalService.updateEntry(req.user.id, id, content, title);
    if (!entry) return sendErr(res, new Error('Not found'), 404);
    sendSuccess(res, entry);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const { id } = EntryParamsSchema.parse(req.params);
    const deleted = await journalService.deleteEntry(req.user.id, id);
    if (!deleted) return sendErr(res, new Error('Not found'), 404);
    sendSuccess(res, null);
  } catch (err) {
    sendErr(res, err, err instanceof z.ZodError ? 400 : 500);
  }
};
