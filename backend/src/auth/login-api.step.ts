import type { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import { coreMiddleware } from '../middlewares/core.middleware'
import { loginUser } from '../services/auth.service'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const config: ApiRouteConfig = {
  name: 'AuthLogin',
  type: 'api',
  path: '/auth/login',
  method: 'POST',
  description: 'Authenticates a user via bcrypt and issues a JWT',
  emits: [],
  flows: ['auth-flow'],
  bodySchema,
  responseSchema: {
    200: z.object({
      token: z.string(),
      user: z.object({
        id: z.string(),
        email: z.string().email(),
        role: z.string(),
        isActive: z.boolean(),
        createdAt: z.string(),
      }),
    }),
    401: z.object({ error: z.any() }),
    403: z.object({ error: z.any() }),
  },
  middleware: [coreMiddleware],
}

export const handler: Handlers['AuthLogin'] = async (req, ctx) => {
  const { logger, state } = ctx

  const parsed = bodySchema.parse(req.body)

  const result = await loginUser(
    {
      email: parsed.email,
      password: parsed.password,
    },
    { logger, state },
  )

  logger.info('auth.login.controller.success', { userId: result.user.id })

  return {
    status: 200,
    body: result,
  }
}


