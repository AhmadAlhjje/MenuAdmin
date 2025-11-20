import apiClient from '../client';
import { Table, ApiResponse, PaginatedResponse } from '@/types';

export const tableService = {
  // Get all tables
  getAllTables: async (limit = 50, page = 1): Promise<PaginatedResponse<Table>> => {
    const response = await apiClient.get<PaginatedResponse<Table>>('/api/admin/tables', {
      params: { limit, page },
    });
    return response.data;
  },

  // Get single table
  getTable: async (id: number): Promise<ApiResponse<Table>> => {
    const response = await apiClient.get<ApiResponse<Table>>(`/api/admin/tables/${id}`);
    return response.data;
  },

  // Create table
  createTable: async (
    data: Omit<Table, 'id' | 'restaurantId' | 'qrCode' | 'qrCodeImage' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Table>> => {
    const response = await apiClient.post<ApiResponse<Table>>('/api/admin/tables', data);
    return response.data;
  },

  // Update table
  updateTable: async (
    id: number,
    data: Partial<Omit<Table, 'id' | 'restaurantId' | 'qrCode' | 'qrCodeImage' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<Table>> => {
    const response = await apiClient.put<ApiResponse<Table>>(`/api/admin/tables/${id}`, data);
    return response.data;
  },

  // Delete table
  deleteTable: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/tables/${id}`);
    return response.data;
  },
};
