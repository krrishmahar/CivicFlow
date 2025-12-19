import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { findUserById } from '../services/user.service';

export const config: ApiRouteConfig = {
  name: 'AdminOnlyEndpoint',
  type: 'api',
  path: '/admin/secure',
  method: 'GET',
  description: 'Example ADMIN-only secure endpoint backed by Motia State',
  emits: [],
  flows: ['auth-flow'],
  responseSchema: {
    200: z.object({
      message: z.string(),
      userId: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  },
  middleware: [coreMiddleware, authMiddleware, requireRoles(['ADMIN'])],
};

export const handler: Handlers['AdminOnlyEndpoint'] = async (_req, ctx) => {
  const { logger, state } = ctx;

  const auth = (ctx as any).auth as
    | {
        user: { id: string };
      }
    | undefined;

  if (!auth) {
    // Should not happen because authMiddleware runs first, but we guard anyway
    logger.warn('auth.admin_only.missing_auth', {});
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    };
  }

  const user = await findUserById(auth.user.id, { logger, state });

  if (!user || !user.isActive) {
    logger.warn('auth.admin_only.user_inactive_or_missing', { userId: auth.user.id });
    return {
      status: 403,
      body: { error: 'Forbidden' },
    };
  }

  logger.info('auth.admin_only.success', { userId: user.id, role: user.role });

  return {
    status: 200,
    body: {
      message: 'Admin-only secure resource',
      userId: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
