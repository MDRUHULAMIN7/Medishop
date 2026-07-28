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
    descriptionEn: 'Normal delivery across Bangladesh',
    descriptionBn: 'সারা বাংলাদেশে স্ট্যান্ডার্ড হোম ডেলিভারি',
    charge: 60,
    estimatedDeliveryEn: '1-2 Days in Dhaka, 2-4 Days Outside',
    estimatedDeliveryBn: 'ঢাকায় ১-২ দিন, বাইরে ২-৪ দিন',
    isPopular: true,
  },
  {
    id: 'express',
    nameEn: 'Same-Day Express Delivery',
    nameBn: 'এক্সপ্রেস সেম-ডে ডেলিভারি',
    descriptionEn: 'Super fast delivery in Dhaka metro area',
    descriptionBn: 'ঢাকায় ২-৪ ঘণ্টার মধ্যে জরুরি ডেলিভারি',
    charge: 120,
    estimatedDeliveryEn: '2-4 Hours in Dhaka Metro',
    estimatedDeliveryBn: 'ঢাকায় ২-৪ ঘণ্টা',
  },
  {
    id: 'pickup',
    nameEn: 'Partner Pharmacy Pickup',
    nameBn: 'ফার্মেসি পিকআপ পয়েন্ট',
    descriptionEn: 'Collect directly from nearby verified mediShop outlet',
    descriptionBn: 'নিকটস্থ অনুমোদিত ফার্মেসি থেকে পিকআপ করুন',
    charge: 0,
    estimatedDeliveryEn: 'Ready in 2 Hours',
    estimatedDeliveryBn: '২ ঘণ্টার মধ্যে প্রস্তুত',
  },
];

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    nameEn: 'Cash on Delivery (COD)',
    nameBn: 'ক্যাশ অন ডেলিভারি (COD)',
    descriptionEn: 'Pay with cash upon receiving your medical package',
    descriptionBn: 'পণ্য বুঝে পেয়ে নগদে মূল্য পরিশোধ করুন',
    iconName: 'Banknote',
    isAvailable: true,
  },
  {
    id: 'bkash',
    nameEn: 'bKash Online Payment',
    nameBn: 'বিকাশ পেমেন্ট',
    descriptionEn: 'Pay securely using your bKash wallet account',
    descriptionBn: 'বিকাশ ওয়ালেট দিয়ে দ্রুত ও নিরাপদে পেমেন্ট করুন',
    iconName: 'Smartphone',
    isAvailable: true,
    instructionsEn: 'Merchant Number: 01700000000',
    instructionsBn: 'মার্চেন্ট নম্বর: ০১৭০০০০০-০০',
  },
  {
    id: 'nagad',
    nameEn: 'Nagad Digital Payment',
    nameBn: 'নগদ পেমেন্ট',
    descriptionEn: 'Pay using Nagad mobile financial service',
    descriptionBn: 'নগদ ওয়ালেট দিয়ে তাৎক্ষণিক পেমেন্ট করুন',
    iconName: 'Smartphone',
    isAvailable: true,
  },
  {
    id: 'rocket',
    nameEn: 'Dutch-Bangla Rocket',
    nameBn: 'রকেট পেমেন্ট',
    descriptionEn: 'Pay using DBBL Rocket account',
    descriptionBn: 'রকেট অ্যাকাউন্ট দিয়ে পেমেন্ট করুন',
    iconName: 'Smartphone',
    isAvailable: true,
  },
  {
    id: 'card',
    nameEn: 'Debit / Credit Card',
    nameBn: 'ডেবিট / ক্রেডিট কার্ড',
    descriptionEn: 'Visa, Mastercard, AMEX (Gateway Mock)',
    descriptionBn: 'যেকোনো ভিসা বা মাস্টারকার্ড দিয়ে পেমেন্ট',
    iconName: 'CreditCard',
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
