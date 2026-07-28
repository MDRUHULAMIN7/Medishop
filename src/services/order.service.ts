import { CartItem, CartSummary } from '@/types/cart';
import { ShippingAddress } from '@/types/address';
import { DeliveryMethod, PaymentMethod } from '@/types/checkout';
import { Order, OrderStatus, TimelineStep } from '@/types/order';

export const ORDERS_STORAGE_KEY = 'medishop_orders_v1';

export class OrderService {
  /**
   * Generate random but deterministic order numbers adhering to SRS rules.
   */
  public generateOrderIdentifiers(): {
    orderNumber: string;
    invoiceNumber: string;
    trackingNumber: string;
  } {
    const randomSeed = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const trackingSeed = Math.floor(10000000 + Math.random() * 90000000); // 8 digits

    return {
      orderNumber: `ORD-2026-${randomSeed}`,
      invoiceNumber: `INV-2026-${randomSeed}`,
      trackingNumber: `TRK-${trackingSeed}`,
    };
  }

  /**
   * Build initial timeline steps for an order.
   */
  public buildOrderTimeline(status: OrderStatus = 'placed'): TimelineStep[] {
    const steps: { status: OrderStatus; titleEn: string; titleBn: string; descEn: string; descBn: string }[] = [
      {
        status: 'placed',
        titleEn: 'Order Placed',
        titleBn: 'অর্ডার জমা হয়েছে',
        descEn: 'Your order has been received by mediShop pharmacy team',
        descBn: 'আপনার অর্ডারটি সফলভাবে জমা নেওয়া হয়েছে',
      },
      {
        status: 'confirmed',
        titleEn: 'Order Confirmed',
        titleBn: 'অর্ডার নিশ্চিত হয়েছে',
        descEn: 'Prescription & inventory verified by certified pharmacist',
        descBn: 'অনুমোদিত ফার্মাসিস্ট দ্বারা অর্ডারটি পরীক্ষা করা হয়েছে',
      },
      {
        status: 'packed',
        titleEn: 'Package Packed',
        titleBn: 'প্যাকেজিং সম্পন্ন',
        descEn: 'Items sealed safely in tamper-proof thermal packaging',
        descBn: 'নিরাপদ প্যাকেজিং সম্পন্ন করা হয়েছে',
      },
      {
        status: 'shipped',
        titleEn: 'Handed to Courier',
        titleBn: 'কুরিয়ারে দেওয়া হয়েছে',
        descEn: 'Package dispatched with express logistics partner',
        descBn: 'রাইডার বা কুরিয়ার পার্টনারের নিকট হস্তান্তর করা হয়েছে',
      },
      {
        status: 'out_for_delivery',
        titleEn: 'Out for Delivery',
        titleBn: 'ডেলিভারির জন্য বের হয়েছে',
        descEn: 'Rider is on the way to your delivery address',
        descBn: 'ডেলিভারি রাইডার আপনার গন্তব্যে রওনা দিয়েছে',
      },
      {
        status: 'delivered',
        titleEn: 'Delivered',
        titleBn: 'ডেলিভারি সম্পন্ন',
        descEn: 'Package successfully handed over to recipient',
        descBn: 'পণ্য সফলভাবে আপনার নিকট হস্তান্তর করা হয়েছে',
      },
    ];

    const statusHierarchy: OrderStatus[] = [
      'placed',
      'confirmed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];

    const currentIndex = statusHierarchy.indexOf(status);

    return steps.map((s, idx) => ({
      status: s.status,
      titleEn: s.titleEn,
      titleBn: s.titleBn,
      descriptionEn: s.descEn,
      descriptionBn: s.descBn,
      isCompleted: idx <= currentIndex,
      isCurrent: idx === currentIndex,
      timestamp: idx <= currentIndex ? new Date(Date.now() - (currentIndex - idx) * 3600000).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
    }));
  }

  /**
   * Create a new mock order asynchronously.
   */
  public async createOrder(params: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    summary: CartSummary;
    notes?: string;
  }): Promise<Order> {
    // Simulate async network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { orderNumber, invoiceNumber, trackingNumber } = this.generateOrderIdentifiers();
    const now = new Date();

    // Determine estimated delivery date
    const deliveryDays = params.shippingAddress.division === 'Dhaka' ? 1 : 3;
    const estDate = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

    const newOrder: Order = {
      id: `ord-internal-${Date.now()}`,
      orderNumber,
      invoiceNumber,
      trackingNumber,
      items: params.items,
      shippingAddress: params.shippingAddress,
      deliveryMethod: params.deliveryMethod,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod.id === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      summary: params.summary,
      createdAt: now.toISOString(),
      estimatedDeliveryDate: estDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      notes: params.notes,
      timeline: this.buildOrderTimeline('placed'),
    };

    const existingOrders = await this.getOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    this.saveOrdersToStorage(updatedOrders);

    return newOrder;
  }

  /**
   * Fetch all orders from storage.
   */
  public async getOrders(): Promise<Order[]> {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    }
    return [];
  }

  /**
   * Fetch single order by order ID or Order Number.
   */
  public async getOrderById(idOrOrderNum: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return (
      orders.find(
        (o) => o.id === idOrOrderNum || o.orderNumber === idOrOrderNum
      ) || null
    );
  }

  /**
   * Cancel order stub.
   */
  public async cancelOrder(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!target) return null;

    target.orderStatus = 'cancelled';
    target.timeline = target.timeline.map((t) => ({
      ...t,
      isCurrent: false,
    }));

    this.saveOrdersToStorage(orders);
    return target;
  }

  private saveOrdersToStorage(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to storage:', e);
    }
  }
}

export const orderService = new OrderService();
