export type UserRole = 'COMPLAINANT' | 'VOLUNTEER' | 'ADMIN'

export type User = {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export type AuthContext = {
  user: {
    id: string;
    username: string;
    role: string;
  };
  tokenPayload: {
    sub: string;
    role: string;
  };
};
