import { apiClient } from '@/lib/apiClient';

export interface BackendCartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    dosageForm: string;
    unitType: string;
    images: string[];
    price: number;
    discountPrice?: number;
    effectivePrice: number;
    stock: number;
    inStock: boolean;
    requiresPrescription: boolean;
    isActive: boolean;
  };
  quantity: number;
  itemTotal: number;
  isAvailable: boolean;
  isStockExceeded: boolean;
  maxAvailableQuantity: number;
}

export interface BackendCartResponse {
  id: string;
  userId: string;
  items: BackendCartItem[];
  totalItemCount: number;
  uniqueItemCount: number;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  hasPrescriptionProducts: boolean;
  hasUnavailableItems: boolean;
  updatedAt?: string;
}

export const CartService = {
  /**
   * Get current authenticated user's cart
   */
  async getCart(): Promise<BackendCartResponse> {
    return apiClient<BackendCartResponse>('/cart', {
      method: 'GET',
    });
  },

  /**
   * Add product item to user's cart
   */
  async addItem(productId: string, quantity = 1): Promise<BackendCartResponse> {
    return apiClient<BackendCartResponse>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  /**
   * Update item quantity in cart
   */
  async updateQuantity(productId: string, quantity: number): Promise<BackendCartResponse> {
    return apiClient<BackendCartResponse>(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  /**
   * Remove item from cart
   */
  async removeItem(productId: string): Promise<BackendCartResponse> {
    return apiClient<BackendCartResponse>(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Clear all items from cart
   */
  async clearCart(): Promise<BackendCartResponse> {
    return apiClient<BackendCartResponse>('/cart', {
      method: 'DELETE',
    });
  },
};
