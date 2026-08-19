import { apiClient, getAccessToken } from '@/lib/apiClient';

export interface PosItemInput {
  productId: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
}

export interface ProcessPosSalePayload {
  storeId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerUser?: string;
  items: PosItemInput[];
  paidAmount: number;
  paymentMethod?: 'cash' | 'card' | 'bkash' | 'nagad';
  discountAmount?: number;
  taxAmount?: number;
  note?: string;
}

export interface AdjustStockPayload {
  productId: string;
  storeId?: string;
  quantityChange: number;
  reason: 'purchase_restock' | 'manual_adjustment' | 'damage_expiry_writeoff' | 'pos_sale' | 'pos_return';
  note?: string;
}

export interface StockLedgerEntry {
  id: string;
  productId: any;
  productName?: string;
  storeId?: any;
  previousStock: number;
  quantityChange: number;
  newStock: number;
  reason: string;
  referenceId?: string;
  performedBy?: any;
  performedByName?: string;
  note?: string;
  createdAt: string;
}

export interface PosSaleItem {
  product: any;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
}

export interface PosSaleRecord {
  id?: string;
  _id?: string;
  invoiceNumber: string;
  store?: any;
  storeName?: string;
  seller?: any;
  sellerName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerUser?: any;
  items: PosSaleItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: string;
  status: 'completed' | 'voided';
  voidedAt?: string;
  createdAt: string;
}

export interface PosTodayStats {
  todayTotalRevenue: number;
  todayInvoiceCount: number;
  totalItemsSold: number;
  avgBillValue: number;
  paymentBreakdown: {
    cash: number;
    bkash: number;
    nagad: number;
    card: number;
  };
  myTodaySales: number;
  myInvoiceCount: number;
  recentSales: PosSaleRecord[];
}

export const PosService = {
  formatSale(raw: any): PosSaleRecord {
    return {
      ...raw,
      id: raw.id || raw._id,
      sellerName: raw.sellerName || raw.soldBy?.name || raw.seller?.name || 'Staff',
      customerName: raw.customerName || raw.customerUser?.name || 'Walk-in Customer',
      customerPhone: raw.customerPhone || raw.customerUser?.phone || '',
      customerEmail: raw.customerEmail || raw.customerUser?.email || '',
      discountAmount: Number(raw.discountAmount ?? raw.discountTotal ?? 0),
      items: Array.isArray(raw.items) ? raw.items.map((item: any) => ({
        ...item,
        productName: item.productName || item.name || item.product?.name || 'Medicine Item',
        unit: item.unit || item.unitType,
        unitPrice: Number(item.unitPrice || 0),
        quantity: Number(item.quantity || 0),
        totalPrice: Number(item.totalPrice || 0),
      })) : [],
    } as PosSaleRecord;
  },
  async getInventory(): Promise<any[]> {
    return apiClient<any[]>('/pos/inventory', { method: 'GET' });
  },

  async getTodayStats(): Promise<PosTodayStats> {
    return apiClient<PosTodayStats>('/pos/stats/today', { method: 'GET' });
  },

  async adjustStock(payload: AdjustStockPayload): Promise<any> {
    return apiClient<any>('/pos/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getStockLedger(productId?: string): Promise<StockLedgerEntry[]> {
    const query = productId ? `?productId=${productId}` : '';
    return apiClient<StockLedgerEntry[]>(`/pos/inventory/ledger${query}`, { method: 'GET' });
  },

  async processPosSale(payload: ProcessPosSalePayload): Promise<PosSaleRecord> {
    const sale = await apiClient<any>('/pos/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return PosService.formatSale(sale);
  },

  async getPosSales(): Promise<PosSaleRecord[]> {
    const sales = await apiClient<any[]>('/pos/sales', { method: 'GET' });
    return (sales || []).map(PosService.formatSale);
  },

  async getInvoice(invoiceNumber: string): Promise<PosSaleRecord> {
    const sale = await apiClient<any>(`/pos/sales/invoice/${invoiceNumber}`, { method: 'GET' });
    return PosService.formatSale(sale);
  },

  async voidPosSale(invoiceNumber: string): Promise<PosSaleRecord> {
    const sale = await apiClient<any>(`/pos/sales/invoice/${invoiceNumber}/void`, { method: 'POST' });
    return PosService.formatSale(sale);
  },

  async getMyPurchases(): Promise<PosSaleRecord[]> {
    const sales = await apiClient<any[]>('/pos/my-purchases', { method: 'GET' });
    return (sales || []).map(PosService.formatSale);
  },

  async downloadInvoice(invoiceNumber: string): Promise<Blob> {
    const token = getAccessToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/pos/sales/invoice/${encodeURIComponent(invoiceNumber)}/download`, {
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) throw new Error('Receipt download failed');
    return response.blob();
  },
};

export const posService = PosService;

