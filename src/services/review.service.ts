import { apiClient } from '@/lib/apiClient';

export interface ReviewUser {
  id: string;
  name: string;
}

export interface ReviewItem {
  id: string;
  product: string;
  user: ReviewUser;
  order: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ReviewListResponse {
  reviews: ReviewItem[];
  meta: ReviewListMeta;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export const reviewService = {
  /**
   * Get public reviews for a product
   */
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<ReviewListResponse> {
    try {
      const res = await apiClient<any>(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
      const list = Array.isArray(res) ? res : res?.reviews || [];
      const meta = res?.meta || { page, limit, total: list.length, pages: 1 };
      return {
        reviews: list,
        meta,
      };
    } catch {
      return {
        reviews: [],
        meta: { page, limit, total: 0, pages: 1 },
      };
    }
  },

  /**
   * Submit a verified purchase review for a product
   */
  async createReview(productId: string, input: CreateReviewInput): Promise<ReviewItem> {
    return apiClient<ReviewItem>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
