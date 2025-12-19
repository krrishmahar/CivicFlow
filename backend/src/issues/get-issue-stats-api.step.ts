import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { getIssueStats } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'GetIssueStats',
  type: 'api',
  path: '/issues/stats',
  method: 'GET',
  description: 'Get issue statistics (Admin only)',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.object({
        total: z.number(),
        pending: z.number(),
        inProgress: z.number(),
        resolved: z.number(),
        rejected: z.number(),
      }),
    }),
  },
  middleware: [coreMiddleware, authMiddleware, requireRoles(['ADMIN'])],
};

export const handler: Handlers['GetIssueStats'] = async (_req, ctx) => {
  const { logger, state } = ctx;

  try {
    const stats = await getIssueStats({ logger, state });

    logger.info('issue.stats.success', { stats });

    return {
      status: 200,
      body: {
        success: true,
        data: stats,
      },
    };
  } catch (error) {
    logger.error('issue.stats.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      status: 500,
      body: { error: 'Failed to fetch statistics' },
    };
  }
};
