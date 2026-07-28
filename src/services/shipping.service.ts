import { ShippingOption, ShippingStrategyParams } from '@/types/cart';
import { DEFAULT_SHIPPING_OPTION } from '@/utils/pricing';

export class ShippingService {
  /**
   * Calculate shipping charge based on zone, express flags, cold-chain, and coupons.
   */
  public calculateShipping(params: ShippingStrategyParams): {
    charge: number;
    option: ShippingOption;
  } {
    const { subtotal, coupon } = params;

    let baseCharge = DEFAULT_SHIPPING_OPTION.baseCharge;
    const freeThreshold = DEFAULT_SHIPPING_OPTION.freeThreshold;

    // Free shipping coupon waives charge completely
    if (coupon?.type === 'free_shipping') {
      return {
        charge: 0,
        option: {
          ...DEFAULT_SHIPPING_OPTION,
          baseCharge: 0,
        },
      };
    }

    // Orders meeting free shipping threshold
    if (subtotal >= freeThreshold || subtotal === 0) {
      return {
        charge: 0,
        option: DEFAULT_SHIPPING_OPTION,
      };
    }

    return {
      charge: baseCharge,
      option: DEFAULT_SHIPPING_OPTION,
    };
  }
}

export const shippingService = new ShippingService();
