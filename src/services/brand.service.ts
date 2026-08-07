import { apiClient } from '@/lib/apiClient';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandPayload {
  name: string;
  slug?: string;
  logo?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateBrandPayload extends Partial<CreateBrandPayload> {}

export const BrandService = {
  /**
   * Fetch all manufacturer brands (Public / Admin).
   */
  async getAllBrands(includeInactive = true): Promise<Brand[]> {
    return apiClient<Brand[]>(`/brands?includeInactive=${includeInactive}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch featured manufacturer brands for homepage.
   */
  async getFeaturedBrands(): Promise<Brand[]> {
    return apiClient<Brand[]>('/brands/featured', {
      method: 'GET',
    });
  },

  /**
   * Get single brand by ID or Slug.
   */
  async getBrandByIdOrSlug(idOrSlug: string): Promise<Brand> {
    return apiClient<Brand>(`/brands/${idOrSlug}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new brand (Admin only).
   */
  async createBrand(payload: CreateBrandPayload): Promise<Brand> {
    return apiClient<Brand>('/brands', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update brand details (Admin only).
   */
  async updateBrand(id: string, payload: UpdateBrandPayload): Promise<Brand> {
    return apiClient<Brand>(`/brands/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Toggle brand isFeatured status (Admin only).
   */
  async toggleFeaturedBrand(id: string): Promise<Brand> {
    return apiClient<Brand>(`/brands/${id}/toggle-feature`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete brand (Admin only).
   */
  async deleteBrand(id: string): Promise<void> {
    return apiClient<void>(`/brands/${id}`, {
      method: 'DELETE',
    });
  },
};
