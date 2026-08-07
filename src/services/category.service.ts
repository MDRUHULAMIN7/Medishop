import { apiClient } from '@/lib/apiClient';

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  nameBn?: string;
  slug: string;
  iconName?: string;
  parentCategory?: string | null;
  image?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  parentCategory?: string | null;
  image?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export const CategoryService = {
  /**
   * Fetch all categories (Public / Admin).
   */
  async getAllCategories(includeInactive = true): Promise<Category[]> {
    const categories = await apiClient<Category[]>(`/categories?includeInactive=${includeInactive}`, {
      method: 'GET',
    });
    if (Array.isArray(categories)) {
      return categories.map((cat) => ({
        ...cat,
        nameEn: cat.nameEn || cat.name,
        nameBn: cat.nameBn || cat.name,
        iconName: cat.iconName || 'Pill',
      }));
    }
    return [];
  },

  /**
   * Fetch hierarchical category tree structure.
   */
  async getCategoryTree(): Promise<Category[]> {
    return apiClient<Category[]>('/categories/tree', {
      method: 'GET',
    });
  },

  /**
   * Fetch featured categories for homepage.
   */
  async getFeaturedCategories(): Promise<Category[]> {
    return apiClient<Category[]>('/categories/featured', {
      method: 'GET',
    });
  },

  /**
   * Get single category by ID or Slug.
   */
  async getCategoryByIdOrSlug(idOrSlug: string): Promise<Category> {
    return apiClient<Category>(`/categories/${idOrSlug}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new category (Admin only).
   */
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    return apiClient<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update category details (Admin only).
   */
  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    return apiClient<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Toggle category isFeatured status (Admin only).
   */
  async toggleFeaturedCategory(id: string): Promise<Category> {
    return apiClient<Category>(`/categories/${id}/toggle-feature`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete category (Admin only).
   */
  async deleteCategory(id: string): Promise<void> {
    return apiClient<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
