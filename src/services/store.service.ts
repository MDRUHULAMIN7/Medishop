import { apiClient } from '@/lib/apiClient';

export interface PharmacyStore {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isMainBranch?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateStorePayload {
  name: string;
  code: string;
  address: string;
  phone: string;
  isMainBranch?: boolean;
}

export const StoreService = {
  async getStores(): Promise<PharmacyStore[]> {
    return apiClient<PharmacyStore[]>('/stores', { method: 'GET' });
  },

  async createStore(payload: CreateStorePayload): Promise<PharmacyStore> {
    return apiClient<PharmacyStore>('/stores', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
