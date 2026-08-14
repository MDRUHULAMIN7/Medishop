import { InvoiceData, Order } from '@/types/order';

export class InvoiceService {
  public generateInvoiceData(order: Order): InvoiceData {
    let issueDate = 'N/A';
    try {
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        if (!isNaN(d.getTime())) {
          issueDate = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
    } catch {}

    let dueDate = order.estimatedDeliveryDate || '2-3 Working Days';
    try {
      if (order.estimatedDeliveryDate) {
        const d = new Date(order.estimatedDeliveryDate);
        if (!isNaN(d.getTime())) {
          dueDate = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
    } catch {}

    const fullAddr = `${order.shippingAddress?.streetAddress || ''}, ${order.shippingAddress?.area || ''}, ${order.shippingAddress?.district || ''}, ${order.shippingAddress?.division || ''}`.replace(/^, |, $/g, '');

    return {
      invoiceNumber: order.invoiceNumber || `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      issueDate,
      dueDate,
      customerName: order.shippingAddress?.fullName || 'Customer',
      customerPhone: order.shippingAddress?.phone || 'N/A',
      customerAddress: fullAddr || 'N/A',
      items: order.items || [],
      summary: order.summary || {
        subtotal: Number(order.subtotal) || 0,
        mrpDiscount: Number(order.discountTotal) || 0,
        couponDiscount: Number(order.couponDiscount) || 0,
        deliveryCharge: Number(order.deliveryCharge) || 60,
        grandTotal: Number(order.grandTotal) || 0,
      },
      paymentMethodName: order.paymentMethod?.nameEn || 'Cash on Delivery',
      paymentStatus: order.paymentStatus || 'pending',
    };
  }

  public downloadInvoice(elementId: string = 'printable-invoice', invoiceNumber: string = 'TAX-INVOICE'): void {
    if (typeof window === 'undefined') return;

    const elem = document.getElementById(elementId);
    if (!elem) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=1000');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = elem.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice_${invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 32px;
              background: #ffffff;
              color: #0f172a;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            th { background-color: #f8fafc; font-weight: 700; color: #475569; text-transform: uppercase; }
            img { max-width: 100%; height: auto; }
            @page { size: A4; margin: 15mm; }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${htmlContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  public printInvoice(): void {
    this.downloadInvoice('printable-invoice');
  }
}

export const invoiceService = new InvoiceService();
