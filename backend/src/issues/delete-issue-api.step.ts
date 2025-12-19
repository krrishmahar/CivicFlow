import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { deleteIssue, findIssueById } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'DeleteIssue',
  type: 'api',
  path: '/issues/:id',
  method: 'DELETE',
  description: 'Delete an issue (Admin only or issue owner)',
  emits: ['issue.deleted'],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
    403: z.object({
      error: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
  middleware: [coreMiddleware, authMiddleware],
};

export const handler: Handlers['DeleteIssue'] = async (req, ctx) => {
  const { logger, state, emit } = ctx;
  const { id } = req.params;

  const auth = (ctx as any).auth as
    | {
        user: { id: string; role: string };
      }
    | undefined;

  if (!auth) {
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    };
  }

  // Check if issue exists
  const issue = await findIssueById(id, { logger, state });

  if (!issue || !issue.isActive) {
    logger.warn('issue.delete.not_found', { issueId: id });
    return {
      status: 404,
      body: { error: 'Issue not found' },
    };
  }

  // Check permission: only owner or admin can delete
  if (issue.userId !== auth.user.id && auth.user.role !== 'ADMIN') {
    logger.warn('issue.delete.forbidden', {
      issueId: id,
      userId: auth.user.id,
      issueOwnerId: issue.userId,
    });
    return {
      status: 403,
      body: { error: 'You do not have permission to delete this issue' },
    };
  }

  try {
    const deleted = await deleteIssue(id, { logger, state });

    if (!deleted) {
      return {
        status: 500,
        body: { error: 'Failed to delete issue' },
      };
    }

    // Emit deletion event
    await emit('issue.deleted', {
      issueId: id,
      userId: auth.user.id,
      timestamp: new Date().toISOString(),
    });

    logger.info('issue.delete.success', {
      issueId: id,
      deletedBy: auth.user.id,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Issue deleted successfully',
      },
    };
  } catch (error) {
    logger.error('issue.delete.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      issueId: id,
    });
    return {
      status: 500,
      body: { error: 'Failed to delete issue' },
    };
  }
};
