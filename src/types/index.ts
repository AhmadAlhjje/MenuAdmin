export interface Category {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  image?: string; // Deprecated - kept for backward compatibility
  images: string[]; // New field - array of image URLs (max 5)
  preparationTime: number;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: number;
  restaurantId: number;
  tableNumber: string;
  capacity: number;
  location: string;
  qrCode: string;
  qrCodeImage: string;
  status: 'available' | 'occupied' | 'reserved';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'kitchen' | 'waiter';
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface FormError {
  field: string;
  message: string;
}
