import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { updateIssue, findIssueById } from '../services/issue.service';
import { IssueStatus } from '../types/issue.types';

const resolveSchema = z.object({
  resolutionNote: z.string().min(10).max(500).optional(),
  verificationImageUrl: z.string().url().optional(),
});

export const config: ApiRouteConfig = {
  name: 'ResolveIssue',
  type: 'api',
  path: '/issues/:id/resolve',
  method: 'POST',
  description: 'Mark an issue as resolved (Admin only)',
  emits: ['issue.resolved'],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      message: z.string(),
      data: z.any(),
    }),
  },
  middleware: [coreMiddleware, authMiddleware, requireRoles(['ADMIN'])],
};

export const handler: Handlers['ResolveIssue'] = async (req, ctx) => {
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
  const validationResult = resolveSchema.safeParse(req.body);
  if (!validationResult.success) {
    return {
      status: 400,
      body: { error: 'Invalid request data', details: validationResult.error.errors },
    };
  }

  const { resolutionNote, verificationImageUrl } = validationResult.data;

  const issue = await findIssueById(id, { logger, state });

  if (!issue || !issue.isActive) {
    logger.warn('issue.resolve.not_found', { issueId: id });
    return {
      status: 404,
      body: { error: 'Issue not found' },
    };
  }

  try {
    const resolvedAt = new Date().toISOString();

    const updatedIssue = await updateIssue(
      id,
      {
        status: IssueStatus.RESOLVED,
        resolvedAt,
      },
      { logger, state }
    );

    if (!updatedIssue) {
      return {
        status: 500,
        body: { error: 'Failed to resolve issue' },
      };
    }

    if (resolutionNote || verificationImageUrl) {
      await state.set(`issue:${id}:resolution`, {
        note: resolutionNote,
        verificationImageUrl,
        resolvedBy: auth.user.id,
        resolvedAt,
      });
    }

    await emit('issue.resolved', {
      issueId: id,
      userId: issue.userId,
      resolvedBy: auth.user.id,
      resolvedAt,
      resolutionNote,
    });

    logger.info('issue.resolve.success', {
      issueId: id,
      resolvedBy: auth.user.id,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Issue marked as resolved',
        data: updatedIssue,
      },
    };
  } catch (error) {
    logger.error('issue.resolve.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      issueId: id,
    });
    return {
      status: 500,
      body: { error: 'Failed to resolve issue' },
    };
  }
};
