import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { getAllIssues } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'GetIssues',
  type: 'api',
  path: '/issues',
  method: 'GET',
  description: 'Get all issues with optional filters',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.array(z.any()),
      pagination: z.object({
        limit: z.number(),
        offset: z.number(),
        total: z.number(),
      }),
    }),
  },
  middleware: [coreMiddleware],
};

export const handler: Handlers['GetIssues'] = async (req, ctx) => {
  const { logger, state } = ctx;

  const status = req.query.status as any;
  const category = req.query.category as any;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const issues = await getAllIssues(
      { status, category, limit, offset },
      { logger, state }
    );

    logger.info('issue.get_all.success', { 
      count: issues.length, 
      filters: { status, category } 
    });

    return {
      status: 200,
      body: {
        success: true,
        data: issues,
        pagination: {
          limit,
          offset,
          total: issues.length,
        },
      },
    };
  } catch (error) {
    logger.error('issue.get_all.error', { error });
    return {
      status: 500,
      body: { error: 'Failed to fetch issues' },
    };
  }
};
