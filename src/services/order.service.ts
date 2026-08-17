import { apiClient, getAccessToken } from '@/lib/apiClient';

export interface CheckoutPayload {
  items?: Array<{
    productId: string;
    unit?: string;
    unitMultiplier?: number;
    unitPrice?: number;
    totalPrice?: number;
    quantity: number;
    availableQuantity?: number;
    preOrderQuantity?: number;
    fulfillmentType?: 'immediate' | 'preorder' | 'mixed';
  }>;
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
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card' | 'rocket' | 'banking' | 'sslcommerz' | 'stripe' | string;
  couponCode?: string;
  prescriptionId?: string;
  deliveryCharge?: number;
  isPreOrder?: boolean;
  isSplitDelivery?: boolean;
  shipment1DeliveryMethod?: string;
  shipment2DeliveryMethod?: string;
  note?: string;
}

export interface UpdateOrderStatusPayload {
  orderStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'partially_paid' | 'paid' | 'failed' | 'refunded';
  shipment1Status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipment2Status?: 'pending' | 'sourcing' | 'ready_to_ship' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipment1PaymentStatus?: 'pending' | 'paid' | 'failed';
  shipment2PaymentStatus?: 'pending' | 'paid' | 'failed';
  targetShipment?: 'all' | 'shipment1' | 'shipment2';
  paidAmount?: number;
  cancellationReason?: string;
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
   * Admin / Staff: Update order status, payment status, or shipment lifecycles
   */
  public async updateOrderStatus(id: string, payload: UpdateOrderStatusPayload): Promise<any> {
    return apiClient<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  /**
   * User / Admin: Cancel an order if pending
   */
  public async cancelOrder(id: string, reason?: string): Promise<any> {
    return apiClient<any>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Download official invoice as PDF from backend endpoint
   */
  public async downloadInvoicePdf(orderId: string, orderNumber: string): Promise<void> {
    try {
      const token = getAccessToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const url = `${baseUrl}/orders/${orderId}/invoice/download`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice PDF');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Invoice-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Invoice download error:', err);
      throw err;
    }
  }
}

export const orderService = new OrderService();
