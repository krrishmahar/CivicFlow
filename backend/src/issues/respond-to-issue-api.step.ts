import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { findIssueById } from '../services/issue.service';
import { v4 as uuidv4 } from 'uuid';

interface IssueResponse {
  id: string;
  issueId: string;
  adminId: string;
  message: string;
  createdAt: string;
}

const respondSchema = z.object({
  message: z.string().min(10).max(1000),
});

export const config: ApiRouteConfig = {
  name: 'RespondToIssue',
  type: 'api',
  path: '/issues/:id/respond',
  method: 'POST',
  description: 'Admin/Municipality responds to an issue',
  emits: ['issue.responded'],
  flows: ['issue-flow'],
  responseSchema: {
    201: z.object({
      success: z.boolean(),
      message: z.string(),
      data: z.object({
        id: z.string(),
        issueId: z.string(),
        adminId: z.string(),
        message: z.string(),
        createdAt: z.string(),
      }),
    }),
  },
  middleware: [coreMiddleware, authMiddleware, requireRoles(['ADMIN'])],
};

export const handler: Handlers['RespondToIssue'] = async (req, ctx) => {
  const { logger, state, emit } = ctx;
  const { id } = req.params;

  const auth = (ctx as any).auth as
    | {
        user: { id: string };
      }
    | undefined;

  if (!auth) {
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    };
  }

  // Validate request body
  const validationResult = respondSchema.safeParse(req.body);
  if (!validationResult.success) {
    return {
      status: 400,
      body: { error: 'Invalid request data', details: validationResult.error.errors },
    };
  }

  const { message } = validationResult.data;

  const issue = await findIssueById(id, { logger, state });

  if (!issue || !issue.isActive) {
    logger.warn('issue.respond.not_found', { issueId: id });
    return {
      status: 404,
      body: { error: 'Issue not found' },
    };
  }

  try {
    const responseId = uuidv4();
    const now = new Date().toISOString();

    const issueResponse: IssueResponse = {
      id: responseId,
      issueId: id,
      adminId: auth.user.id,
      message,
      createdAt: now,
    };

    await state.set(`response:${responseId}`, issueResponse);

    const responsesKey = `issue:${id}:responses`;
    const responses = (await state.get<string[]>(responsesKey)) || [];
    responses.push(responseId);
    await state.set(responsesKey, responses);

    await emit('issue.responded', {
      issueId: id,
      responseId,
      adminId: auth.user.id,
      userId: issue.userId,
      message,
      timestamp: now,
    });

    logger.info('issue.respond.success', {
      issueId: id,
      responseId,
      adminId: auth.user.id,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: 'Response added successfully',
        data: issueResponse,
      },
    };
  } catch (error) {
    logger.error('issue.respond.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      issueId: id,
    });
    return {
      status: 500,
      body: { error: 'Failed to add response' },
    };
  }
};
