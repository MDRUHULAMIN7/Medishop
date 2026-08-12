import { apiClient } from '@/lib/apiClient';

export interface PrescriptionItem {
  id: string;
  images: string[];
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export const PrescriptionService = {
  /**
   * Upload prescription image(s) and optional note
   */
  async uploadPrescription(formData: FormData): Promise<PrescriptionItem> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch('/api/v1/prescriptions', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload prescription');
    }
    return data.data || data;
  },

  /**
   * Get authenticated user's uploaded prescriptions
   */
  async getMyPrescriptions(): Promise<PrescriptionItem[]> {
    return apiClient<PrescriptionItem[]>('/prescriptions/my', {
      method: 'GET',
    });
  },

  /**
   * Get specific prescription details by ID
   */
  async getMyPrescriptionById(id: string): Promise<PrescriptionItem> {
    return apiClient<PrescriptionItem>(`/prescriptions/my/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Pharmacist / Admin Review Queue
   */
  async getPrescriptionQueue(status?: string): Promise<PrescriptionItem[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient<PrescriptionItem[]>(`/prescriptions${query}`, {
      method: 'GET',
    });
  },

  /**
   * Approve or Reject prescription (Pharmacist / Admin)
   */
  async reviewPrescription(
    id: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<PrescriptionItem> {
    return apiClient<PrescriptionItem>(`/prescriptions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    });
  },
};
