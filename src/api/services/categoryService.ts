import apiClient from '../client';
import { Category, ApiResponse, PaginatedResponse } from '@/types';

export const categoryService = {
  // Get all categories
  getAllCategories: async (limit = 50, page = 1): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/api/menu/categories', {
      params: { limit, page },
    });
    return response.data;
  },

  // Get single category
  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/menu/categories/${id}`);
    return response.data;
  },

  // Create category
  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/api/menu/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (
    id: number,
    data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/api/menu/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/menu/categories/${id}`);
    return response.data;
  },
};
