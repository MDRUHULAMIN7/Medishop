import { API_BASE_URL, getAccessToken } from '@/lib/apiClient';

export interface UploadResponse {
  url: string;
  thumbnailUrl?: string;
  format: string;
  originalName?: string;
}

export const uploadService = {
  /**
   * Upload single image with Sharp WebP optimization on backend
   */
  async uploadImage(
    file: File,
    type: 'product' | 'banner' | 'avatar' | 'general' = 'general',
    watermark = true
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAccessToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/single?type=${type}&watermark=${watermark}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data.data;
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'avatar', false);
  },

  /**
   * Upload promotional hero banner
   */
  async uploadBanner(file: File): Promise<UploadResponse> {
    return this.uploadImage(file, 'banner', false);
  },

  /**
   * Upload product image with Sharp WebP and watermark
   */
  async uploadProductImage(file: File, watermark = true): Promise<UploadResponse> {
    return this.uploadImage(file, 'product', watermark);
  },
};
