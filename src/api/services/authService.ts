import apiClient from '../client';
import { ApiResponse, AuthToken, User } from '@/types';

export const authService = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<AuthToken>> => {
    const response = await apiClient.post<ApiResponse<AuthToken>>('/api/auth/login', {
      email,
      password,
      requiredRole: 'admin',
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/api/auth/me');
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/auth/logout', {});
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
