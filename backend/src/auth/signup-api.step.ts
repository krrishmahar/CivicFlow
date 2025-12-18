import type { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { coreMiddleware } from '../middlewares/core.middleware'
import { createUser } from '../services/user.service'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['COMPLAINANT', 'VOLUNTEER', 'ADMIN']),
})

export const config: ApiRouteConfig = {
  name: 'AuthSignup',
  type: 'api',
  path: '/auth/signup',
  method: 'POST',
  description: 'Creates a new user with bcrypt-hashed password in Motia State',
  emits: [],
  flows: ['auth-flow'],
  bodySchema,
  responseSchema: {
    201: z.object({
      id: z.string(),
      email: z.string().email(),
      role: z.string(),
      isActive: z.boolean(),
      createdAt: z.string(),
    }),
    409: z.object({
      error: z.any(),
    }),
  },
  middleware: [coreMiddleware],
}

export const handler: Handlers['AuthSignup'] = async (req, ctx) => {
  const { logger, state } = ctx

  const parsed = bodySchema.parse(req.body)

  const user = await createUser(
    {
      email: parsed.email,
      password: parsed.password,
      role: parsed.role,
    },
    { logger, state },
  )

  logger.info('auth.signup.controller.success', { userId: user.id, email: user.email })

  return {
    status: 201,
    body: {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  }
}


