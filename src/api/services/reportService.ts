import apiClient from '../client';

export interface PopularItem {
  item: {
    id: number;
    name: string;
    nameAr: string;
    price: string;
    images: string;
    category: {
      id: number;
      name: string;
      nameAr: string;
    };
  };
  totalOrdered: number;
  totalRevenue: string;
  ordersCount: number;
}

export interface SalesData {
  date?: string;
  totalSales: string;
  sessionsCount: number;
  ordersCount?: number;
}

export interface DashboardStats {
  activeSessions: number;
  todaySales: string;
  activeOrders: number;
  totalTables: number;
  occupiedTables: number;
  occupancyRate: number;
  avgSessionValue: string;
}

export const reportService = {
  // Get popular items report
  async getPopularItems(params?: { startDate?: string; endDate?: string; limit?: number }) {
    const response = await apiClient.get<{
      success: boolean;
      count: number;
      data: PopularItem[];
    }>('/api/admin/reports/popular-items', { params });
    return response.data;
  },

  // Get sales report
  async getSalesReport(params?: { startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' }) {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        salesData: SalesData[];
        totals: {
          totalSales: string;
          totalSessions: number;
          avgSessionValue: string;
        };
      };
    }>('/api/admin/reports/sales', { params });
    return response.data;
  },

  // Get dashboard statistics
  async getDashboardStats() {
    const response = await apiClient.get<{
      success: boolean;
      data: DashboardStats;
    }>('/api/admin/dashboard');
    return response.data;
  },
};
