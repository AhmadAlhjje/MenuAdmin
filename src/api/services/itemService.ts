import apiClient from '../client';
import { MenuItem, ApiResponse, PaginatedResponse } from '@/types';

export const itemService = {
  // Get all items
  getAllItems: async (limit = 50, page = 1): Promise<PaginatedResponse<MenuItem>> => {
    const response = await apiClient.get<PaginatedResponse<MenuItem>>('/api/menu/items', {
      params: { limit, page },
    });
    return response.data;
  },

  // Get items by category
  getItemsByCategory: async (categoryId: number): Promise<PaginatedResponse<MenuItem>> => {
    const response = await apiClient.get<PaginatedResponse<MenuItem>>(
      `/api/menu/categories/${categoryId}/items`
    );
    return response.data;
  },

  // Get single item
  getItem: async (id: number): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/api/menu/items/${id}`);
    return response.data;
  },

  // Create item
  createItem: async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.post<ApiResponse<MenuItem>>('/api/menu/items', data);
    return response.data;
  },

  // Update item
  updateItem: async (
    id: number,
    data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.put<ApiResponse<MenuItem>>(`/api/menu/items/${id}`, data);
    return response.data;
  },

  // Delete item
  deleteItem: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/menu/items/${id}`);
    return response.data;
  },

  // Toggle item availability
  toggleAvailability: async (id: number, isAvailable: boolean): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.patch<ApiResponse<MenuItem>>(
      `/api/menu/items/${id}/availability`,
      { isAvailable }
    );
    return response.data;
  },
};
