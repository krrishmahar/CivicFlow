import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { findIssueById } from '../services/issue.service';

export const config: ApiRouteConfig = {
  name: 'GetIssueResponses',
  type: 'api',
  path: '/issues/:id/responses',
  method: 'GET',
  description: 'Get all responses/updates for a specific issue',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.array(z.any()),
      count: z.number(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
  middleware: [coreMiddleware],
};

export const handler: Handlers['GetIssueResponses'] = async (req, ctx) => {
  const { logger, state } = ctx;
  const { id } = req.params;

  const issue = await findIssueById(id, { logger, state });

  if (!issue || !issue.isActive) {
    logger.warn('issue.get_responses.not_found', { issueId: id });
    return {
      status: 404,
      body: { error: 'Issue not found' },
    };
  }

  try {
    const responsesKey = `issue:${id}:responses`;
    const responseIds = (await state.get<string[]>(responsesKey)) || [];

    // Fetch all responses
    const responsesPromises = responseIds.map((responseId) =>
      state.get(`response:${responseId}`)
    );
    const responses = await Promise.all(responsesPromises);

    const validResponses = responses.filter((r) => r !== null);

    logger.info('issue.get_responses.success', {
      issueId: id,
      count: validResponses.length,
    });

    return {
      status: 200,
      body: {
        success: true,
        data: validResponses,
        count: validResponses.length,
      },
    };
  } catch (error) {
    logger.error('issue.get_responses.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      issueId: id,
    });
    return {
      status: 500,
      body: { error: 'Failed to fetch responses' },
    };
  }
};
