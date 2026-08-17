import { CartItem, CartSummary } from './cart';
import { ShippingAddress } from './address';
import { DeliveryMethod, PaymentMethod } from './checkout';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PreOrderStatus =
  | 'pending'
  | 'sourcing'
  | 'ready_to_ship'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'failed' | 'refunded';

export interface TimelineStep {
  status: OrderStatus | PreOrderStatus;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string; // Internal unique ID
  orderNumber: string; // Format: ORD-2026-XXXXXX
  invoiceNumber: string; // Format: INV-2026-XXXXXX
  trackingNumber: string; // Format: TRK-XXXXXXXX
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shipment1Status?: OrderStatus;
  shipment2Status?: PreOrderStatus;
  shipment1PaymentStatus?: 'pending' | 'paid' | 'failed';
  shipment2PaymentStatus?: 'pending' | 'paid' | 'failed';
  shipment1Total?: number;
  shipment2Total?: number;
  shipment1DeliveryCharge?: number;
  shipment2DeliveryCharge?: number;
  paidAmount?: number;
  summary: CartSummary;
  isPreOrder?: boolean;
  isSplitDelivery?: boolean;
  shipment1DeliveryMethod?: string;
  shipment2DeliveryMethod?: string;
  shipment1DeliveryMethodDetails?: DeliveryMethod | null;
  shipment2DeliveryMethodDetails?: DeliveryMethod | null;
  createdAt: string;
  estimatedDeliveryDate: string;
  notes?: string;
  timeline: TimelineStep[];
}

export interface OrderFilterState {
  searchQuery: string;
  statusFilter: OrderStatus | 'all';
  sortBy: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  summary: CartSummary;
  paymentMethodName: string;
  paymentStatus: PaymentStatus;
}
