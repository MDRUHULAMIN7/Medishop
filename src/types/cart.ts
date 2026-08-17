export enum ProductAvailabilityStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PREORDER = 'PREORDER',
}

export interface CartItem {
  productId: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  brand: string;
  image: string;
  unit: string;
  unitType?: string;
  sellingPrice: number;
  mrp: number;
  prescriptionRequired: boolean;
  stock: number;
  quantity: number;
  availableQuantity?: number;
  preOrderQuantity?: number;
  allowPreOrder?: boolean;
  fulfillmentType?: 'immediate' | 'preorder' | 'mixed';
  unitMultiplier?: number;
  unitPrice?: number;
  effectiveUnitPrice?: number;
  totalPrice?: number;
  availabilityStatus?: ProductAvailabilityStatus;
}

export type CouponType = 'percentage' | 'flat' | 'free_shipping';

export interface CouponRule {
  code: string;
  type: CouponType;
  value: number; // e.g. 10 for 10%, 100 for ৳100
  maxDiscount?: number; // e.g. 300 for SAVE10
  minOrder?: number; // e.g. 800 for MEDI100
  descriptionEn: string;
  descriptionBn: string;
  isActive: boolean;
  validUntil?: string;
}

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  discountAmount: number;
  descriptionEn: string;
  descriptionBn: string;
}

export interface ShippingOption {
  id: string;
  nameEn: string;
  nameBn: string;
  baseCharge: number;
  freeThreshold: number;
  estimatedDeliveryEn: string;
  estimatedDeliveryBn: string;
}

export interface ShippingStrategyParams {
  subtotal: number;
  destinationZone?: string;
  isColdChainRequired?: boolean;
  isExpress?: boolean;
  coupon?: AppliedCoupon | null;
}

export interface CartSummary {
  subtotal: number;
  mrpTotal: number;
  mrpDiscount: number;
  couponDiscount: number;
  deliveryCharge: number;
  vat: number;
  grandTotal: number;
  totalSavings: number;
  totalQuantity: number;
  remainingForFreeDelivery: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
}

export interface CouponValidationResult {
  success: boolean;
  coupon?: AppliedCoupon;
  messageEn: string;
  messageBn: string;
}

export type CartEventType =
  | 'CartUpdated'
  | 'CouponApplied'
  | 'CouponRemoved'
  | 'ItemAdded'
  | 'ItemRemoved'
  | 'QuantityChanged'
  | 'CartCleared';

export interface CartEventPayload {
  type: CartEventType;
  items: CartItem[];
  item?: CartItem;
  coupon?: AppliedCoupon | null;
  summary?: CartSummary;
  timestamp: number;
}
