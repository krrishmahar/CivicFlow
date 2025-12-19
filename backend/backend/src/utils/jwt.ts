import jwt, { type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

type JwtPayloadBase = {
  sub: string;
  roles: string[];
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
};

export const signAccessToken = (
  payload: JwtPayloadBase,
  expiresIn?: StringValue | number,
): string => {
  const secret = getJwtSecret();
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    algorithm: 'HS256',
  } as SignOptions;
  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): JwtPayloadBase => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

  if (typeof decoded.sub !== 'string' || !Array.isArray(decoded.roles)) {
    throw new Error('Invalid token payload');
  }

  return {
    sub: decoded.sub,
    roles: decoded.roles as string[],
  };
};
