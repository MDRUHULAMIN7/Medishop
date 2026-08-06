import { apiClient } from '@/lib/apiClient';
import { User } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
}

export const UserProfileService = {
  /**
   * Fetch authenticated user profile details from backend API (/users/me).
   */
  async getProfile(): Promise<User> {
    return apiClient<User>('/users/me', {
      method: 'GET',
    });
  },

  /**
   * Update user profile details (Name, Email, Phone, Avatar) via backend API (PATCH /users/me).
   * Validates avatar size limit (max 5MB).
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    if (payload.avatar && payload.avatar.length > 5 * 1024 * 1024 * 1.35) {
      throw new Error('Profile picture size exceeds 5MB limit. Please upload a smaller image.');
    }

    return apiClient<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
