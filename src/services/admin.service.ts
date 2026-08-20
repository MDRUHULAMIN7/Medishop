import { apiClient } from '@/lib/apiClient';

export interface SalesSummaryData {
  totalRevenue: number;
  totalOrders: number;
  totalPosSales: number;
  totalPosRevenue: number;
  combinedRevenue: number;
  todayRevenue: number;
  todayOrdersCount: number;
  totalCost?: number;
  grossProfit?: number;
  grossLoss?: number;
  marginPercent?: number;
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

export interface AdminAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  channel?: 'all' | 'online' | 'pos';
  productId?: string;
  categoryId?: string;
  staffId?: string;
}

export interface AdminAnalyticsResponse {
  filters: AdminAnalyticsFilters;
  summary: {
    totalSales: number;
    revenue: number;
    grossProfit: number;
    loss: number;
    productSales: number;
    stockValue: number;
    lowStock: number;
    outOfStock: number;
    purchaseCost: number;
    sellingValue: number;
    profitMargin: number;
    onlineSales: number;
    posSales: number;
    refundCount: number;
    refundAmount: number;
    auditActivity: number;
  };
  trend: Array<{ date: string; revenue: number; buyingCost: number; profit: number }>;
  channels: Array<{ name: string; value: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number; profit: number }>;
  lowSellingProducts: Array<{ name: string; quantity: number; revenue: number; profit: number }>;
  stockStatus: Array<{ name: string; value: number }>;
  rows?: Array<{
    date: string;
    channel: string;
    reference: string;
    product: string;
    quantity: number;
    unitPrice: number;
    buyingCost: number;
    revenue: number;
    profit: number;
  }>;
}

export interface ProductInsightsResponse {
  product: {
    id: string;
    name: string;
    genericName?: string;
    category?: string;
    brand?: string;
    stock: number;
    lowStockThreshold: number;
    price: number;
    buyingPrice: number;
    unit: string;
    image?: string;
    expiryDate?: string;
  };
  sales: {
    onlineQuantity: number;
    onlineRevenue: number;
    posQuantity: number;
    posRevenue: number;
    totalQuantity: number;
    totalRevenue: number;
    profit: number;
    lastSaleAt?: string;
  };
  stockMovements: number;
}

export interface AdminUserListItem {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  status: 'active' | 'blocked';
  createdAt?: string;
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

  async getAnalytics(filters: AdminAnalyticsFilters = {}, includeRows = false): Promise<AdminAnalyticsResponse> {
    const query = new URLSearchParams({ includeRows: String(includeRows) });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    return apiClient<AdminAnalyticsResponse>(`/admin/reports/analytics?${query.toString()}`);
  },

  async getProductInsights(productId: string): Promise<ProductInsightsResponse> {
    return apiClient<ProductInsightsResponse>(`/admin/products/${productId}/insights`);
  },

  /**
   * List all registered users for Admin User Management table
   */
  async listUsers(params?: string): Promise<{ users: AdminUserListItem[]; total: number }> {
    const query = params ? `?${params}` : '';
    const res = await apiClient<any>(`/users${query}`);
    const items = Array.isArray(res) ? res : res?.data || [];
    return {
      users: items.map((u: any) => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email || 'N/A',
        phone: u.phone || 'N/A',
        role: u.role || 'customer',
        status: u.status || 'active',
        createdAt: u.createdAt,
      })),
      total: items.length,
    };
  },

  /**
   * Toggle or update user account status (active / blocked)
   */
  async updateUserStatus(userId: string, status: 'active' | 'blocked'): Promise<any> {
    return apiClient<any>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
