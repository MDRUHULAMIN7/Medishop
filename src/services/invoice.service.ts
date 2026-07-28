import { InvoiceData, Order } from '@/types/order';

export class InvoiceService {
  public generateInvoiceData(order: Order): InvoiceData {
    const issueDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const dueDate = new Date(order.estimatedDeliveryDate).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );

    const fullAddr = `${order.shippingAddress.streetAddress}, ${order.shippingAddress.area}, ${order.shippingAddress.district}, ${order.shippingAddress.division}`;

    return {
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      issueDate,
      dueDate,
      customerName: order.shippingAddress.fullName,
      customerPhone: order.shippingAddress.phone,
      customerAddress: fullAddr,
      items: order.items,
      summary: order.summary,
      paymentMethodName: order.paymentMethod.nameEn,
      paymentStatus: order.paymentStatus,
    };
  }

  public printInvoice(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}

export const invoiceService = new InvoiceService();
