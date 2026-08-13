import { apiClient } from '@/lib/apiClient';

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFeedMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  unreadCount: number;
}

export interface NotificationFeedResponse {
  notifications: NotificationItem[];
  meta: NotificationFeedMeta;
}

export const notificationService = {
  /**
   * Get user's notifications feed
   */
  async getMyNotifications(page = 1, limit = 20): Promise<NotificationFeedResponse> {
    try {
      const res = await apiClient<any>(`/notifications/my?page=${page}&limit=${limit}`);
      const list = Array.isArray(res) ? res : res?.notifications || [];
      const meta = res?.meta || { page, limit, total: list.length, pages: 1, unreadCount: 0 };
      return {
        notifications: list,
        meta,
      };
    } catch {
      return {
        notifications: [],
        meta: { page, limit, total: 0, pages: 1, unreadCount: 0 },
      };
    }
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient<any>('/notifications/unread-count');
      return typeof res === 'number' ? res : res?.unreadCount || 0;
    } catch {
      return 0;
    }
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string): Promise<NotificationItem> {
    return apiClient<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
