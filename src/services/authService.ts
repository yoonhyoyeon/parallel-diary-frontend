import { apiClient } from './apiClient';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    provider: string;
    providerId?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export async function registerUser(payload: RegisterRequest) {
  return apiClient<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    provider: string;
    providerId?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export async function loginUser(payload: LoginRequest) {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  provider: string;
  providerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProfile(token: string) {
  return apiClient<UserProfile>('/auth/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
