import apiClient from '../client';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'kitchen' | 'waiter';
  restaurantId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'kitchen' | 'waiter';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export const userService = {
  // Get all users
  async getAllUsers() {
    const response = await apiClient.get<{
      success: boolean;
      count: number;
      data: User[];
    }>('/api/admin/users');
    return response.data;
  },

  // Get user by ID
  async getUserById(id: number) {
    const response = await apiClient.get<{
      success: boolean;
      data: User;
    }>(`/api/admin/users/${id}`);
    return response.data;
  },

  // Create new user
  async createUser(data: CreateUserData) {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: User;
    }>('/api/admin/users', data);
    return response.data;
  },

  // Update user
  async updateUser(id: number, data: UpdateUserData) {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: User;
    }>(`/api/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async deleteUser(id: number) {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/admin/users/${id}`);
    return response.data;
  },

  // Toggle user active status (using PUT endpoint)
  async toggleUserStatus(id: number, isActive: boolean) {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: User;
    }>(`/api/admin/users/${id}`, { isActive: isActive.toString() });
    return response.data;
  },
};
