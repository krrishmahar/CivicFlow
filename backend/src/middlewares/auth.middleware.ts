import type { ApiMiddleware } from 'motia'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { verifyAccessToken } from '../auth/jwt'

export const authMiddleware: ApiMiddleware = async (req, ctx, next) => {
  const { logger, state } = ctx
  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  if (!authHeader || (Array.isArray(authHeader) ? authHeader[0] : authHeader).trim() === '') {
    throw new UnauthorizedError('Missing Authorization header')
  }

  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader
  const [scheme, token] = headerValue.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Invalid Authorization header format')
  }

  try {
    const payload = verifyAccessToken(token)

    // Load user from Motia State using subject as user id
    const user = await state.get<{ id: string; username: string; roles: string[] }>('users', payload.sub)

    if (!user) {
      throw new UnauthorizedError('User not found for token subject')
    }

    // Attach auth context to ctx for downstream handlers/middlewares
    ;(ctx as any).auth = {
      user,
      tokenPayload: payload,
    }

    logger.info('Authenticated request', {
      userId: user.id,
      username: user.username,
      roles: user.roles,
    })

    return await next()
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      throw error
    }

    logger.error('Failed to authenticate JWT', {
      message: error?.message,
    })
    throw new UnauthorizedError('Invalid or expired token')
  }
}


