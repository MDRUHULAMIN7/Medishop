import { apiClient } from '@/lib/apiClient';

export interface SalesSummaryData {
  totalRevenue: number;
  totalOrders: number;
  totalPosSales: number;
  totalPosRevenue: number;
  combinedRevenue: number;
  todayRevenue: number;
  todayOrdersCount: number;
}

export interface OrderStatusBreakdownData {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total: number;
}

export interface UserMetricsData {
  totalCustomers: number;
  totalPrescriptions: number;
  pendingPrescriptions: number;
}

export interface LowStockItemData {
  id: string;
  name: string;
  slug: string;
  dosageForm: string;
  unitType: string;
  stock: number;
  price: number;
  images: string[];
}

export interface DashboardSummaryResponse {
  salesSummary: SalesSummaryData;
  orderStatusBreakdown: OrderStatusBreakdownData;
  userMetrics: UserMetricsData;
  lowStockItemsCount: number;
}

export const adminService = {
  /**
   * Fetch aggregated dashboard summary overview KPIs
   */
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    return apiClient<DashboardSummaryResponse>('/admin/dashboard/summary');
  },

  /**
   * Fetch detailed sales & revenue analytics
   */
  async getSalesSummary(): Promise<SalesSummaryData> {
    return apiClient<SalesSummaryData>('/admin/dashboard/sales');
  },

  /**
   * Fetch order status breakdown
   */
  async getOrderStatusBreakdown(): Promise<OrderStatusBreakdownData> {
    return apiClient<OrderStatusBreakdownData>('/admin/dashboard/order-breakdown');
  },

  /**
   * Fetch low stock items report
   */
  async getLowStockReport(threshold = 10): Promise<LowStockItemData[]> {
    const res = await apiClient<LowStockItemData[]>(`/admin/dashboard/low-stock?threshold=${threshold}`);
    return res || [];
  },
};
