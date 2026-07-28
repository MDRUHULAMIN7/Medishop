import { AppliedCoupon, CouponRule, CouponValidationResult } from '@/types/cart';

/**
 * Enterprise Rule-Based Coupon Repository.
 * Adding new coupons or dynamic coupons from backend requires zero UI refactoring.
 */
export const MOCK_COUPON_RULES: CouponRule[] = [
  {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    maxDiscount: 300,
    minOrder: 0,
    descriptionEn: '10% OFF up to ৳300',
    descriptionBn: '১০% ছাড় (সর্বোচ্চ ৳৩০০)',
    isActive: true,
  },
  {
    code: 'MEDI100',
    type: 'flat',
    value: 100,
    minOrder: 800,
    descriptionEn: 'Flat ৳100 OFF on orders above ৳800',
    descriptionBn: '৳৮০০+ অর্ডারে ৳১০০ ছাড়',
    isActive: true,
  },
  {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minOrder: 0,
    descriptionEn: '100% Free Shipping on your order',
    descriptionBn: 'সম্পূর্ণ বিনামূল্যে ডেলিভারি',
    isActive: true,
  },
];

export class CouponService {
  private rules: CouponRule[];

  constructor(rules: CouponRule[] = MOCK_COUPON_RULES) {
    this.rules = rules;
  }

  /**
   * Validate coupon code against active rules and current subtotal.
   */
  public async validateCoupon(
    inputCode: string,
    subtotal: number
  ): Promise<CouponValidationResult> {
    // Simulate brief network delay for production feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanCode = inputCode.trim().toUpperCase();

    if (!cleanCode) {
      return {
        success: false,
        messageEn: 'Please enter a coupon code',
        messageBn: 'অনুগ্রহ করে একটি কুপন কোড লিখুন',
      };
    }

    const rule = this.rules.find(
      (r) => r.code === cleanCode && r.isActive
    );

    if (!rule) {
      return {
        success: false,
        messageEn: 'Invalid coupon code. Try SAVE10, MEDI100, or FREESHIP',
        messageBn: 'অকার্যকর কুপন কোড। SAVE10, MEDI100, বা FREESHIP চেষ্টা করুন',
      };
    }

    if (rule.minOrder && subtotal < rule.minOrder) {
      return {
        success: false,
        messageEn: `Coupon requires a minimum order of ৳${rule.minOrder}. Add ৳${rule.minOrder - subtotal} more items.`,
        messageBn: `কুপনের জন্য সর্বনিম্ন ৳${rule.minOrder} টাকার অর্ডার প্রয়োজন। আরও ৳${rule.minOrder - subtotal} টাকার পণ্য যোগ করুন।`,
      };
    }

    let discountAmount = 0;
    if (rule.type === 'percentage') {
      const calculated = Math.round((subtotal * rule.value) / 100);
      discountAmount = rule.maxDiscount ? Math.min(calculated, rule.maxDiscount) : calculated;
    } else if (rule.type === 'flat') {
      discountAmount = Math.min(rule.value, subtotal);
    } else if (rule.type === 'free_shipping') {
      discountAmount = 0; // Free shipping rule waives delivery charge separately
    }

    const appliedCoupon: AppliedCoupon = {
      code: rule.code,
      type: rule.type,
      value: rule.value,
      discountAmount,
      descriptionEn: rule.descriptionEn,
      descriptionBn: rule.descriptionBn,
    };

    return {
      success: true,
      coupon: appliedCoupon,
      messageEn: `Coupon "${rule.code}" applied successfully!`,
      messageBn: `কুপন "${rule.code}" সফলভাবে প্রয়োগ করা হয়েছে!`,
    };
  }

  /**
   * Return list of active coupons for hints/promotions.
   */
  public getAvailableCoupons(): CouponRule[] {
    return this.rules.filter((r) => r.isActive);
  }
}

export const couponService = new CouponService();
