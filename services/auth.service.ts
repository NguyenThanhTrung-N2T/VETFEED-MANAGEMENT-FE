import apiClient from '@/lib/axios';
import { AuthResponse, LoginPayload, SignupPayload } from '@/types/auth';

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>('/api/TaiKhoans/login', data);
    return response.data;
  },

  signup: async (data: SignupPayload) => {
    const response = await apiClient.post('/api/TaiKhoans/signup', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post('/api/TaiKhoans/forgot-password', { email });
  },

  logout: async () => {
    return await apiClient.post('/api/TaiKhoans/logout');
  }
};