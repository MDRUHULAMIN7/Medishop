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

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface TimelineStep {
  status: OrderStatus;
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
  summary: CartSummary;
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
