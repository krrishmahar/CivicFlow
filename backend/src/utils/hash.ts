import crypto from 'crypto-js';

export const hashPassword = (password: string): string => {
  return crypto.SHA256(password).toString(crypto.enc.Hex);
}

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}


