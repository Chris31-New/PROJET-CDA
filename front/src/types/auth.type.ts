import type {User} from '../interfaces/user.tsx'

export interface SigninData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}