import { apiClient } from '@/lib/apiClient';

export interface BatchItem {
  _id: string;
  product: any;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  supplier?: any;
  receivedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiveBatchPayload {
  productId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  unit?: string;
  supplier?: string;
  purchaseReferenceId?: string;
}

export interface AdjustStockPayload {
  productId: string;
  batchId: string;
  type: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'DAMAGE' | 'EXPIRED_REMOVAL';
  quantityDelta: number;
  referenceId?: string;
}

export interface BatchSummaryData {
  totalBatches: number;
  activeBatches: number;
  expiringSoonCount: number;
  expiringSoonBatches: BatchItem[];
  expiredCount: number;
  expiredBatches: BatchItem[];
}

export interface AuditLedgerRow {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug?: string;
    price?: number;
    baseUnit?: string;
  };
  batch?: {
    _id: string;
    batchNumber: string;
    expiryDate: string;
  };
  type: string;
  quantity: number;
  baseQtyNeeded?: number;
  unitSold?: string;
  balanceAfter: number;
  referenceId?: string;
  performedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export const InventoryService = {
  async getBatchesSummary(): Promise<BatchSummaryData> {
    return apiClient<BatchSummaryData>('/inventory/batches-summary', { method: 'GET' });
  },

  async getProductBatches(productId: string): Promise<BatchItem[]> {
    return apiClient<BatchItem[]>(`/inventory/batches/${productId}`, { method: 'GET' });
  },

  async receiveBatch(payload: ReceiveBatchPayload): Promise<any> {
    return apiClient<any>('/inventory/receive-batch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async adjustStock(payload: AdjustStockPayload): Promise<any> {
    return apiClient<any>('/inventory/adjust-stock', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateBatch(
    batchId: string,
    payload: { batchNumber?: string; expiryDate?: string; quantity?: number; costPrice?: number; isActive?: boolean }
  ): Promise<any> {
    return apiClient<any>(`/inventory/batch/${batchId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteBatch(batchId: string): Promise<any> {
    return apiClient<any>(`/inventory/batch/${batchId}`, {
      method: 'DELETE',
    });
  },

  async recalculateProductStock(productId: string): Promise<any> {
    return apiClient<any>(`/inventory/recalculate-stock/${productId}`, { method: 'POST' });
  },

  async recalculateAllStock(): Promise<any> {
    return apiClient<any>('/inventory/recalculate-all', { method: 'POST' });
  },

  async getStockLedger(productId?: string, limit = 100): Promise<AuditLedgerRow[]> {
    const query = productId ? `?productId=${productId}&limit=${limit}` : `?limit=${limit}`;
    return apiClient<AuditLedgerRow[]>(`/inventory/ledger${query}`, { method: 'GET' });
  },
};

export const inventoryService = InventoryService;
