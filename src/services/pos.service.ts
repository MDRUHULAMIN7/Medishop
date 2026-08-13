import { apiClient } from '@/lib/apiClient';

export interface PosItemInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
}

export interface ProcessPosSalePayload {
  storeId?: string;
  customerName?: string;
  customerPhone?: string;
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
}

export interface PosSaleRecord {
  id: string;
  invoiceNumber: string;
  store?: any;
  storeName?: string;
  seller?: any;
  sellerName?: string;
  customerName?: string;
  customerPhone?: string;
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

export const PosService = {
  async getInventory(): Promise<any[]> {
    return apiClient<any[]>('/pos/inventory', { method: 'GET' });
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
    return apiClient<PosSaleRecord>('/pos/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPosSales(): Promise<PosSaleRecord[]> {
    return apiClient<PosSaleRecord[]>('/pos/sales', { method: 'GET' });
  },

  async getInvoice(invoiceNumber: string): Promise<PosSaleRecord> {
    return apiClient<PosSaleRecord>(`/pos/sales/invoice/${invoiceNumber}`, { method: 'GET' });
  },

  async voidPosSale(invoiceNumber: string): Promise<PosSaleRecord> {
    return apiClient<PosSaleRecord>(`/pos/sales/invoice/${invoiceNumber}/void`, { method: 'POST' });
  },
};

export const posService = PosService;
