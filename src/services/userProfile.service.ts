import { apiClient, getAccessToken } from '@/lib/apiClient';
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
    const user = await apiClient<User>('/users/me', {
      method: 'GET',
    });
    if (user) {
      user.avatarUrl = user.avatar || undefined;
    }
    return user;
  },

  /**
   * Update user profile details (Name, Email, Phone, Avatar) via backend API (PATCH /users/me).
   * Validates avatar size limit (max 5MB) and normalizes input fields.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const cleanPayload: Record<string, any> = {};

    if (payload.name !== undefined && payload.name.trim() !== '') {
      cleanPayload.name = payload.name.trim();
    }

    if (payload.email !== undefined && payload.email.trim() !== '') {
      cleanPayload.email = payload.email.trim().toLowerCase();
    }

    if (payload.phone !== undefined && payload.phone.trim() !== '') {
      cleanPayload.phone = payload.phone.trim().replace(/[\s-]/g, '');
    }

    if (payload.avatar !== undefined) {
      cleanPayload.avatar = payload.avatar ? payload.avatar.trim() : null;
      if (cleanPayload.avatar && cleanPayload.avatar.length > 5 * 1024 * 1024 * 1.35) {
        throw new Error('Profile picture size exceeds 5MB limit. Please upload a smaller image.');
      }
    }

    const updatedUser = await apiClient<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(cleanPayload),
    });

    if (updatedUser) {
      updatedUser.avatarUrl = updatedUser.avatar || undefined;
    }

    return updatedUser;
  },

  /**
   * Direct avatar upload via multipart FormData to Sharp pipeline
   */
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = getAccessToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Avatar upload failed');
    }

    const user = data.data.user;
    if (user) {
      user.avatarUrl = user.avatar || undefined;
    }
    return user;
  },
};
