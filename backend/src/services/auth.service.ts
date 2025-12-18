import type { FlowContext } from 'motia'
import bcrypt from 'bcrypt'
import { BaseError } from '../errors/base.error'
import type { User } from '../auth/types'
import { findUserByEmail } from './user.service'
import { signAccessToken } from '../auth/jwt'

type LoginInput = {
  email: string
  password: string
}

type LoginResult = {
  token: string
  user: Pick<User, 'id' | 'email' | 'role' | 'isActive' | 'createdAt'>
}

export const loginUser = async (
  input: LoginInput,
  ctx: Pick<FlowContext<any>, 'logger' | 'state'>,
): Promise<LoginResult> => {
  const { email, password } = input
  const { logger } = ctx

  const normalizedEmail = email.trim().toLowerCase()
  logger.info('auth.login.start', { email: normalizedEmail })

  const user = await findUserByEmail(normalizedEmail, ctx)
  if (!user) {
    logger.warn('auth.login.failed', { email: normalizedEmail, reason: 'USER_NOT_FOUND' })
    throw new BaseError('Invalid credentials', 401, 'INVALID_CREDENTIALS', { reason: 'USER_NOT_FOUND' })
  }

  if (!user.isActive) {
    logger.warn('auth.login.failed', { email: normalizedEmail, reason: 'USER_INACTIVE', userId: user.id })
    throw new BaseError('User is inactive', 403, 'USER_INACTIVE', { userId: user.id })
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    logger.warn('auth.login.failed', { email: normalizedEmail, reason: 'PASSWORD_MISMATCH', userId: user.id })
    throw new BaseError('Invalid credentials', 401, 'INVALID_CREDENTIALS', { reason: 'PASSWORD_MISMATCH' })
  }

  const token = signAccessToken({
    sub: user.id,
    roles: [user.role],
  })

  const result: LoginResult = {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  }

  logger.info('auth.login.success', { userId: user.id, role: user.role })

  return result
}


