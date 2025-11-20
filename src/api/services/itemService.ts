import apiClient from '../client';
import { MenuItem, ApiResponse, PaginatedResponse } from '@/types';

export const itemService = {
  // Get all items
  getAllItems: async (limit = 50, page = 1): Promise<PaginatedResponse<MenuItem>> => {
    const response = await apiClient.get<PaginatedResponse<MenuItem>>('/api/menu/items', {
      params: { limit, page },
    });

    // Parse images from JSON string to array
    if (response.data.data) {
      response.data.data = response.data.data.map((item: any) => ({
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images || []
      }));
    }

    return response.data;
  },

  // Get items by category
  getItemsByCategory: async (categoryId: number): Promise<PaginatedResponse<MenuItem>> => {
    const response = await apiClient.get<PaginatedResponse<MenuItem>>(
      `/api/menu/categories/${categoryId}/items`
    );

    // Parse images from JSON string to array
    if (response.data.data) {
      response.data.data = response.data.data.map((item: any) => ({
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images || []
      }));
    }

    return response.data;
  },

  // Get single item
  getItem: async (id: number): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/api/menu/items/${id}`);

    // Parse images from JSON string to array
    if (response.data.data) {
      const item: any = response.data.data;
      response.data.data = {
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images || []
      } as MenuItem;
    }

    return response.data;
  },

  // Create item with images
  createItem: async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>, images?: File[]): Promise<ApiResponse<MenuItem>> => {
    const formData = new FormData();

    // Add text fields
    formData.append('categoryId', data.categoryId.toString());
    formData.append('name', data.name);
    formData.append('nameAr', data.nameAr);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('preparationTime', data.preparationTime?.toString() || '30');
    formData.append('displayOrder', data.displayOrder?.toString() || '0');

    // Add image files
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await apiClient.post<ApiResponse<MenuItem>>('/api/menu/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update item with images
  updateItem: async (
    id: number,
    data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>,
    images?: File[],
    replaceImages: boolean = false,
    existingImages?: string[]
  ): Promise<ApiResponse<MenuItem>> => {
    const formData = new FormData();

    // Add replaceImages flag
    formData.append('replaceImages', replaceImages.toString());

    // Add existing images to keep (when user removed some)
    if (existingImages && existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    // Add text fields if they exist
    if (data.categoryId) formData.append('categoryId', data.categoryId.toString());
    if (data.name) formData.append('name', data.name);
    if (data.nameAr) formData.append('nameAr', data.nameAr);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price.toString());
    if (data.preparationTime) formData.append('preparationTime', data.preparationTime.toString());
    if (data.displayOrder !== undefined) formData.append('displayOrder', data.displayOrder.toString());

    // Add image files if replacing
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await apiClient.put<ApiResponse<MenuItem>>(`/api/menu/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
