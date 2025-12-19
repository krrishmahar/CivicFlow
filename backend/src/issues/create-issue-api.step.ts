import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createIssue } from '../services/issue.service';
import { IssueCategory } from '../types/issue.types';

const createIssueSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10).max(2000),
  category: z.nativeEnum(IssueCategory),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  imageUrls: z.array(z.string().url()).max(5).optional(),
});

export const config: ApiRouteConfig = {
  name: 'CreateIssue',
  type: 'api',
  path: '/issues',
  method: 'POST',
  description: 'Create a new civic issue/complaint',
  emits: [], // ✅ REMOVE emits for now
  flows: [], // ✅ REMOVE flows for now
  responseSchema: {
    201: z.object({
      success: z.boolean(),
      message: z.string(),
      data: z.object({
        id: z.string(),
        title: z.string(),
        category: z.nativeEnum(IssueCategory),
        status: z.string(),
        createdAt: z.string(),
      }),
    }),
  },
  middleware: [coreMiddleware, authMiddleware],
};

export const handler: Handlers['CreateIssue'] = async (req, ctx) => {
  const { logger, state } = ctx; // ✅ Remove 'emit' from destructuring

  const auth = (ctx as any).auth as
    | {
        user: { id: string };
      }
    | undefined;

  if (!auth) {
    logger.warn('issue.create.missing_auth', {});
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    };
  }

  const validationResult = createIssueSchema.safeParse(req.body);
  if (!validationResult.success) {
    logger.warn('issue.create.validation_failed', {
      errors: validationResult.error.errors,
    });
    return {
      status: 400,
      body: { error: 'Invalid request data', details: validationResult.error.errors },
    };
  }

  const { title, description, category, latitude, longitude, address, imageUrls } =
    validationResult.data;

  try {
    const issue = await createIssue(
      {
        userId: auth.user.id,
        title,
        description,
        category,
        latitude,
        longitude,
        address: address || '',
        imageUrls: imageUrls || [],
      },
      { logger, state }
    );

    // ✅ REMOVE the emit call that's causing the hang
    // await emit('issue.created', { ... });

    logger.info('issue.create.success', {
      issueId: issue.id,
      userId: auth.user.id,
      category: issue.category,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: `Issue #${issue.id.slice(0, 8)} created successfully`,
        data: {
          id: issue.id,
          title: issue.title,
          category: issue.category,
          status: issue.status,
          createdAt: issue.createdAt,
        },
      },
    };
  } catch (error) {
    logger.error('issue.create.error', {
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
      userId: auth.user.id,
    });
    
    return {
      status: 500,
      body: { 
        error: 'Failed to create issue',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
    };
  }
};
