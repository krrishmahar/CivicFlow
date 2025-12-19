import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { findIssueById } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'GetIssueById',
  type: 'api',
  path: '/issues/:id',
  method: 'GET',
  description: 'Get a specific issue by ID',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.any(),
    }),
  },
  middleware: [coreMiddleware],
};

export const handler: Handlers['GetIssueById'] = async (req, ctx) => {
  const { logger, state } = ctx;
  const { id } = req.params;

  const issue = await findIssueById(id, { logger, state });

  if (!issue || !issue.isActive) {
    logger.warn('issue.get_by_id.not_found', { issueId: id });
    return {
      status: 404,
      body: { error: 'Issue not found' },
    };
  }

  logger.info('issue.get_by_id.success', { issueId: id });

  return {
    status: 200,
    body: {
      success: true,
      data: issue,
    },
  };
};
