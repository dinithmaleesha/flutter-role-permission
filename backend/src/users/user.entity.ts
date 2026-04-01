export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
