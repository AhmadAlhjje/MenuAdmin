import apiClient from '../client';
import { ApiResponse } from '@/types';

interface LogoUploadResponse {
  logo: string;
  logoUrl: string;
}

export const restaurantService = {
  // Upload logo
  uploadLogo: async (file: File): Promise<ApiResponse<LogoUploadResponse>> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<ApiResponse<LogoUploadResponse>>(
      '/api/admin/restaurant/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Update logo
  updateLogo: async (file: File): Promise<ApiResponse<LogoUploadResponse>> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.put<ApiResponse<LogoUploadResponse>>(
      '/api/admin/restaurant/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Delete logo
  deleteLogo: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>('/api/admin/restaurant/logo');
    return response.data;
  },
};
