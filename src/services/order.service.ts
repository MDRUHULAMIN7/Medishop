import { apiClient } from '@/lib/apiClient';

export interface CheckoutPayload {
  shippingAddressId?: string;
  shippingAddress?: {
    recipientName: string;
    phone: string;
    division?: string;
    district: string;
    thana: string;
    addressLine: string;
    postalCode?: string;
  };
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  couponCode?: string;
  prescriptionId?: string;
  deliveryCharge?: number;
  note?: string;
}

export interface UpdateOrderStatusPayload {
  orderStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  note?: string;
}

export class OrderService {
  /**
   * Process checkout with backend server validation (Stock check, RX check, Coupon re-check, Cart clear)
   */
  public async checkout(payload: CheckoutPayload, idempotencyKey?: string): Promise<any> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    return apiClient<any>('/orders/checkout', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Fetch authenticated user's orders from backend
   */
  public async getMyOrders(): Promise<any[]> {
    return apiClient<any[]>('/orders/my', {
      method: 'GET',
    });
  }

  /**
   * Fetch specific order details by ID from backend
   */
  public async getOrderById(id: string): Promise<any> {
    return apiClient<any>(`/orders/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Admin / Staff: List all orders with optional filters
   */
  public async getAllOrders(query?: string): Promise<any> {
    const q = query ? `?${query}` : '';
    return apiClient<any>(`/orders${q}`, {
      method: 'GET',
    });
  }

  /**
   * Admin / Staff: Update order status (orderStatus, paymentStatus, note)
   */
  public async updateOrderStatus(id: string, payload: UpdateOrderStatusPayload): Promise<any> {
    return apiClient<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Cancel order
   */
  public async cancelOrder(id: string, note?: string): Promise<any> {
    return apiClient<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus: 'cancelled', note }),
    });
  }
}

export const orderService = new OrderService();
