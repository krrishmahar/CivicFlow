import type { FlowContext } from 'motia';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { User, UserRole } from '../types/types';
import { BaseError } from '../errors/base.error';

const USERS_GROUP = 'users';
const USER_EMAILS_GROUP = 'user-emails';

type CreateUserInput = {
  email: string;
  password: string;
  role: UserRole;
};

export const createUser = async (
  input: CreateUserInput,
  ctx: Pick<FlowContext<any>, 'logger' | 'state'>,
): Promise<User> => {
  const { email, password, role } = input;
  const { logger, state } = ctx;

  const normalizedEmail = email.trim().toLowerCase();

  logger.info('auth.signup.start', { email: normalizedEmail, role });

  const existingUserId = await state.get<string | null>(
    USER_EMAILS_GROUP,
    normalizedEmail,
  );
  if (existingUserId) {
    logger.warn('auth.signup.failed', {
      email: normalizedEmail,
      reason: 'EMAIL_ALREADY_EXISTS',
    });
    throw new BaseError('Email already in use', 409, 'EMAIL_ALREADY_EXISTS', {
      email: normalizedEmail,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user: User = {
    id: uuidv4(),
    email: normalizedEmail,
    passwordHash,
    role,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  await state.set<User>(USERS_GROUP, user.id, user);
  await state.set<string>(USER_EMAILS_GROUP, normalizedEmail, user.id);

  logger.info('auth.signup.success', { userId: user.id, email: normalizedEmail, role });

  return user;
};

export const findUserByEmail = async (
  email: string,
  ctx: Pick<FlowContext<any>, 'logger' | 'state'>,
): Promise<User | null> => {
  const { state } = ctx;
  const normalizedEmail = email.trim().toLowerCase();

  const userId = await state.get<string | null>(USER_EMAILS_GROUP, normalizedEmail);
  if (!userId) return null;

  return state.get<User | null>(USERS_GROUP, userId);
};

export const findUserById = async (
  id: string,
  ctx: Pick<FlowContext<any>, 'logger' | 'state'>,
): Promise<User | null> => {
  const { state } = ctx;
  return state.get<User | null>(USERS_GROUP, id);
};
