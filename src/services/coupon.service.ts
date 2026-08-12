import { apiClient } from '@/lib/apiClient';

export interface ApplyCouponResult {
  coupon: {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  };
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

export interface PublicCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  description?: string;
  endDate: string;
}

export const CouponService = {
  /**
   * Validate and apply coupon to order amount
   */
  async applyCoupon(code: string, orderAmount: number): Promise<ApplyCouponResult> {
    return apiClient<ApplyCouponResult>('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    });
  },

  /**
   * Get active public coupons for promotion banners
   */
  async getValidPublicCoupons(): Promise<PublicCoupon[]> {
    return apiClient<PublicCoupon[]>('/coupons/valid', {
      method: 'GET',
    });
  },

  /**
   * Admin: Get all coupons
   */
  async getAllCoupons(includeInactive = true): Promise<any[]> {
    return apiClient<any[]>(`/coupons?includeInactive=${includeInactive}`, {
      method: 'GET',
    });
  },

  /**
   * Admin: Create new coupon
   */
  async createCoupon(data: any): Promise<any> {
    return apiClient<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Admin: Delete coupon
   */
  async deleteCoupon(id: string): Promise<any> {
    return apiClient<any>(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },
};
