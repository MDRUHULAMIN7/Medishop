import { apiClient } from '@/lib/apiClient';
import { User } from '@/types';

export interface StaffInvitation {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName?: string;
  targetRole: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  notes?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendStaffInvitationInput {
  identifier: string;
  targetRole: string;
  notes?: string;
}

export interface SearchedCustomer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  avatar?: string;
  addresses?: any[];
  createdAt?: string;
}

export const StaffInvitationService = {
  async sendInvitation(payload: SendStaffInvitationInput): Promise<StaffInvitation> {
    return apiClient<StaffInvitation>('/users/staff-invitations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getSentInvitations(status?: string, page = 1): Promise<StaffInvitation[]> {
    const query = new URLSearchParams();
    if (status && status !== 'all') query.set('status', status);
    query.set('page', String(page));
    query.set('limit', '50');
    return apiClient<StaffInvitation[]>(`/users/staff-invitations?${query.toString()}`, {
      method: 'GET',
    });
  },

  async cancelInvitation(invitationId: string): Promise<any> {
    return apiClient<any>(`/users/staff-invitations/${invitationId}`, {
      method: 'DELETE',
    });
  },

  async getMyInvitations(): Promise<StaffInvitation[]> {
    return apiClient<StaffInvitation[]>('/users/me/staff-invitations', {
      method: 'GET',
    });
  },

  async acceptInvitation(invitationId: string): Promise<{ user: User; accessToken: string; message: string }> {
    return apiClient<{ user: User; accessToken: string; message: string }>(
      `/users/me/staff-invitations/${invitationId}/accept`,
      {
        method: 'POST',
      }
    );
  },

  async declineInvitation(invitationId: string): Promise<{ declined: boolean }> {
    return apiClient<{ declined: boolean }>(
      `/users/me/staff-invitations/${invitationId}/decline`,
      {
        method: 'POST',
      }
    );
  },

  async searchCustomers(query: string): Promise<SearchedCustomer[]> {
    return apiClient<SearchedCustomer[]>(`/users/customer-search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },
};

export const staffInvitationService = StaffInvitationService;
