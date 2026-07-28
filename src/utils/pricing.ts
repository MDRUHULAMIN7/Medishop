import { AppliedCoupon, CartItem, CartSummary, ShippingOption } from '@/types/cart';

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_DELIVERY_CHARGE = 60;

export const DEFAULT_SHIPPING_OPTION: ShippingOption = {
  id: 'standard-dhaka',
  nameEn: 'Express Same-Day Delivery',
  nameBn: 'এক্সপ্রেস সেম-ডে ডেলিভারি',
  baseCharge: STANDARD_DELIVERY_CHARGE,
  freeThreshold: FREE_DELIVERY_THRESHOLD,
  estimatedDeliveryEn: '2-4 Hours in Dhaka',
  estimatedDeliveryBn: 'ঢাকায় ২-৪ ঘণ্টা',
};

/**
 * PricingEngine - Unified source of truth for all cart financial calculations.
 * Never perform mathematical or pricing calculations inside UI components.
 */
export class PricingEngine {
  public static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  }

  public static calculateMrpTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.mrp || item.sellingPrice) * item.quantity, 0);
  }

  public static calculateMrpDiscount(items: CartItem[]): number {
    const mrpTotal = this.calculateMrpTotal(items);
    const subtotal = this.calculateSubtotal(items);
    return Math.max(0, mrpTotal - subtotal);
  }

  public static calculateCouponDiscount(
    subtotal: number,
    coupon?: AppliedCoupon | null
  ): number {
    if (!coupon || subtotal <= 0) return 0;

    if (coupon.type === 'percentage') {
      const discount = Math.round((subtotal * coupon.value) / 100);
      return coupon.discountAmount > 0
        ? Math.min(discount, coupon.discountAmount)
        : discount;
    }

    if (coupon.type === 'flat') {
      return Math.min(coupon.value, subtotal);
    }

    // Free shipping coupon waives shipping charge, discount amount on subtotal is 0
    return 0;
  }

  public static calculateDeliveryCharge(
    subtotal: number,
    coupon?: AppliedCoupon | null,
    shippingOption: ShippingOption = DEFAULT_SHIPPING_OPTION
  ): number {
    if (subtotal <= 0) return 0;
    if (coupon?.type === 'free_shipping') return 0;
    if (subtotal >= shippingOption.freeThreshold) return 0;
    return shippingOption.baseCharge;
  }

  public static calculateCartSummary(
    items: CartItem[],
    coupon?: AppliedCoupon | null,
    shippingOption: ShippingOption = DEFAULT_SHIPPING_OPTION
  ): CartSummary {
    const subtotal = this.calculateSubtotal(items);
    const mrpTotal = this.calculateMrpTotal(items);
    const mrpDiscount = this.calculateMrpDiscount(items);
    const couponDiscount = this.calculateCouponDiscount(subtotal, coupon);
    const deliveryCharge = this.calculateDeliveryCharge(subtotal, coupon, shippingOption);
    const vat = 0; // Tax included in prices per BD regulation

    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryCharge + vat);

    // Calculate delivery savings: standard shipping (৳60) saved if delivery is free and subtotal > 0
    const deliverySavings = subtotal > 0 && deliveryCharge === 0 ? shippingOption.baseCharge : 0;
    const totalSavings = mrpDiscount + couponDiscount + deliverySavings;

    const remainingForFreeDelivery = subtotal >= shippingOption.freeThreshold
      ? 0
      : Math.max(0, shippingOption.freeThreshold - subtotal);
    const isFreeDelivery = deliveryCharge === 0 && subtotal > 0;

    return {
      subtotal,
      mrpTotal,
      mrpDiscount,
      couponDiscount,
      deliveryCharge,
      vat,
      grandTotal,
      totalSavings,
      totalQuantity,
      remainingForFreeDelivery,
      isFreeDelivery,
      freeDeliveryThreshold: shippingOption.freeThreshold,
    };
  }
}
