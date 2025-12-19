import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserIssues } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'GetUserIssues',
  type: 'api',
  path: '/users/me/issues',
  method: 'GET',
  description: 'Get all issues created by the authenticated user',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.array(z.any()),
      count: z.number(),
    }),
  },
  middleware: [coreMiddleware, authMiddleware],
};

export const handler: Handlers['GetUserIssues'] = async (_req, ctx) => {
  const { logger, state } = ctx;

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

  try {
    const issues = await getUserIssues(auth.user.id, { logger, state });

    logger.info('issue.get_user_issues.success', { 
      userId: auth.user.id,
      count: issues.length 
    });

    return {
      status: 200,
      body: {
        success: true,
        data: issues,
        count: issues.length,
      },
    };
  } catch (error) {
    logger.error('issue.get_user_issues.error', { error, userId: auth.user.id });
    return {
      status: 500,
      body: { error: 'Failed to fetch user issues' },
    };
  }
};
