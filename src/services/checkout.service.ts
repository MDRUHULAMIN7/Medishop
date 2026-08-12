import {
  DeliveryMethod,
  DeliveryMethodId,
  PaymentMethod,
  PaymentMethodId,
} from '@/types/checkout';

export const CHECKOUT_STORAGE_KEY = 'medishop_checkout_v1';

export const AVAILABLE_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    nameEn: 'Standard Delivery',
    nameBn: 'স্ট্যান্ডার্ড ডেলিভারি',
    descriptionEn: '2 - 4 working days',
    descriptionBn: '২ - ৪ কর্মদিবস',
    charge: 60,
    estimatedDeliveryEn: '2 - 4 working days',
    estimatedDeliveryBn: '২ - ৪ কর্মদিবস',
    isPopular: true,
  },
  {
    id: 'express',
    nameEn: 'Express Delivery',
    nameBn: 'এক্সপ্রেস ডেলিভারি',
    descriptionEn: '1 - 2 working days',
    descriptionBn: '১ - ২ কর্মদিবস',
    charge: 120,
    estimatedDeliveryEn: '1 - 2 working days',
    estimatedDeliveryBn: '১ - ২ কর্মদিবস',
  },
  {
    id: 'pickup',
    nameEn: 'Store Pickup',
    nameBn: 'স্টোর পিকআপ',
    descriptionEn: 'Pick up from nearest store',
    descriptionBn: 'নিকটস্থ দোকান থেকে পিকআপ করুন',
    charge: 0,
    estimatedDeliveryEn: 'Pick up from nearest store',
    estimatedDeliveryBn: 'নিকটস্থ দোকান থেকে পিকআপ করুন',
  },
];

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    nameEn: 'Cash on Delivery (COD)',
    nameBn: 'ক্যাশ অন ডেলিভারি (COD)',
    descriptionEn: 'Pay when you receive',
    descriptionBn: 'পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন',
    iconName: 'Banknote',
    isAvailable: true,
  },
  {
    id: 'bkash',
    nameEn: 'bKash',
    nameBn: 'বিকাশ',
    descriptionEn: 'Pay with bKash',
    descriptionBn: 'বিকাশের মাধ্যমে পেমেন্ট করুন',
    iconName: 'Smartphone',
    isAvailable: true,
  },
  {
    id: 'nagad',
    nameEn: 'Nagad',
    nameBn: 'নগদ',
    descriptionEn: 'Pay with Nagad',
    descriptionBn: 'নগদের মাধ্যমে পেমেন্ট করুন',
    iconName: 'Smartphone',
    isAvailable: true,
  },
  {
    id: 'card',
    nameEn: 'Card Payment',
    nameBn: 'কার্ড পেমেন্ট',
    descriptionEn: 'Visa, Mastercard, etc.',
    descriptionBn: 'ভিসা, মাস্টারকার্ড ইত্যাদি',
    iconName: 'CreditCard',
    isAvailable: true,
  },
  {
    id: 'banking',
    nameEn: 'Online Banking',
    nameBn: 'অনলাইন ব্যাংকিং',
    descriptionEn: 'All major banks supported',
    descriptionBn: 'সকল ব্যাংক সাপোর্টেড',
    iconName: 'Building',
    isAvailable: true,
  },
];

export class CheckoutService {
  public getDeliveryMethods(): DeliveryMethod[] {
    return AVAILABLE_DELIVERY_METHODS;
  }

  public getPaymentMethods(): PaymentMethod[] {
    return AVAILABLE_PAYMENT_METHODS;
  }

  public getDeliveryMethodById(id: DeliveryMethodId): DeliveryMethod {
    return (
      AVAILABLE_DELIVERY_METHODS.find((m) => m.id === id) ||
      AVAILABLE_DELIVERY_METHODS[0]
    );
  }

  public getPaymentMethodById(id: PaymentMethodId): PaymentMethod {
    return (
      AVAILABLE_PAYMENT_METHODS.find((m) => m.id === id) ||
      AVAILABLE_PAYMENT_METHODS[0]
    );
  }

  public saveSelectionsToStorage(selections: {
    selectedAddressId?: string | null;
    selectedDeliveryMethodId?: DeliveryMethodId;
    selectedPaymentMethodId?: PaymentMethodId;
  }): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(selections));
    } catch (e) {
      console.error('Failed to save checkout selections:', e);
    }
  }

  public loadSelectionsFromStorage(): {
    selectedAddressId: string | null;
    selectedDeliveryMethodId: DeliveryMethodId;
    selectedPaymentMethodId: PaymentMethodId;
  } {
    if (typeof window === 'undefined') {
      return {
        selectedAddressId: null,
        selectedDeliveryMethodId: 'standard',
        selectedPaymentMethodId: 'cod',
      };
    }
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load checkout selections:', e);
    }
    return {
      selectedAddressId: null,
      selectedDeliveryMethodId: 'standard',
      selectedPaymentMethodId: 'cod',
    };
  }
}

export const checkoutService = new CheckoutService();
