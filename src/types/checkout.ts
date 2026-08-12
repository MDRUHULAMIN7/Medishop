import { AppliedCoupon, CartItem } from './cart';
import { ShippingAddress } from './address';

export type DeliveryMethodId = 'standard' | 'express' | 'pickup';

export interface DeliveryMethod {
  id: DeliveryMethodId;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  charge: number;
  estimatedDeliveryEn: string;
  estimatedDeliveryBn: string;
  isPopular?: boolean;
}

export type PaymentMethodId =
  | 'cod'
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'card'
  | 'banking'
  | 'sslcommerz'
  | 'stripe';

export interface PaymentMethod {
  id: PaymentMethodId;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconName: string;
  isAvailable: boolean;
  instructionsEn?: string;
  instructionsBn?: string;
}

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

export interface CheckoutState {
  selectedAddressId: string | null;
  selectedDeliveryMethodId: DeliveryMethodId;
  selectedPaymentMethodId: PaymentMethodId;
  currentStep: CheckoutStep;
  isSubmitting: boolean;
  error: string | null;
}
