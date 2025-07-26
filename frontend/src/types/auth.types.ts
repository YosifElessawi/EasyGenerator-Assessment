/**
 * Authentication-related type definitions
 */

export interface User {
  email: string;
  name: string;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
