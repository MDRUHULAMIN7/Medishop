import { apiClient, getAccessToken } from '@/lib/apiClient';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
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
    input: { status: 'approved' | 'rejected'; rejectionReason?: string } | 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<PrescriptionItem> {
    const payload = typeof input === 'object' ? input : { status: input, rejectionReason };
    return apiClient<PrescriptionItem>(`/prescriptions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

export const prescriptionService = PrescriptionService;
