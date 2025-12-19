import type { ApiMiddleware } from 'motia';
import { ForbiddenError } from '../errors/forbidden.error';
import type { AuthContext } from '../types/types';

export const requireRoles = (allowedRoles: string[]): ApiMiddleware => {
  return async (_req, ctx, next) => {
    const logger = ctx.logger;
    const auth = (ctx as any).auth as AuthContext | undefined;

    if (!auth) {
      throw new ForbiddenError('Missing auth context');
    }

    // const hasRole = auth.user.roles.some((role) => allowedRoles.includes(role))

    const userRole = auth.user?.role;
    const hasRole = allowedRoles.includes(userRole);

    logger.info('RBAC check', {
      userId: auth.user.id,
      username: auth.user.username,
      userRoles: auth.user.role,
      allowedRoles,
      accessGranted: hasRole,
    });

    if (!hasRole) {
      throw new ForbiddenError('Insufficient permissions', {
        userId: auth.user.id,
        username: auth.user.username,
        requiredRoles: allowedRoles,
        userRoles: auth.user.role,
      });
    }

    return next();
  };
};
