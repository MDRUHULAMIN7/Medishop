import { apiClient } from '@/lib/apiClient';

export interface UnitPriceOption {
  unit: string;
  unitLabelBn?: string;
  unitLabelEn?: string;
  price: number;
  mrp?: number;
  discountPrice?: number;
  stock: number;
  multiplier?: number;
  baseUnitQty?: number;
  isDefault?: boolean;
}

export interface PackagingTier {
  unit: string;
  baseUnitQty: number;
  price: number;
  mrp?: number;
  discountPrice?: number;
  barcode?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  nameEn: string;
  genericName?: string;
  slug: string;
  dosageForm: string;
  strength?: string;
  unitType: string;
  unitPrices: UnitPriceOption[];
  unit: string;
  packSize?: string;
  description?: string;
  tags: string[];
  category: any;
  brand: any;
  categoryId: string;
  price: number;
  mrp: number;
  discountPrice?: number;
  discountPercent: number;
  stock: number;
  stockCount: number;
  inStock: boolean;
  expiryDate?: string;
  batchNumber?: string;
  requiresPrescription?: boolean;
  requiresRx: boolean;
  isFeatured?: boolean;
  images?: string[];
  image: string;
  rating: number;
  reviewCount: number;
  badgeText?: string;
  brandName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength?: string;
  baseUnit?: string;
  unitType: string;
  unitPrices?: UnitPriceOption[];
  packaging?: PackagingTier[];
  packSize?: string;
  description?: string;
  tags?: string[];
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  expiryDate?: string;
  batchNumber?: string;
  requiresPrescription?: boolean;
  isFeatured?: boolean;
  images?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  dosageForm?: string;
  unitType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  totalCount: number;
  availableBrands: any[];
  availableCategories: any[];
}

export const ProductService = {
  /**
   * Format product object for backward compatibility with frontend consumers.
   */
  formatProduct(p: any): Product {
    const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop';
    const firstImg = (Array.isArray(p.images) && p.images.length > 0 && p.images[0])
      ? p.images[0]
      : (p.image && typeof p.image === 'string' && p.image.trim() !== '' ? p.image : DEFAULT_PRODUCT_IMAGE);

    const brandStr = typeof p.brand === 'object' && p.brand !== null
      ? (p.brand.name || '')
      : (typeof p.brand === 'string' ? p.brand : '');

    const categoryStr = typeof p.category === 'object' && p.category !== null
      ? (p.category.name || '')
      : (typeof p.category === 'string' ? p.category : '');

    const categoryId = typeof p.category === 'object' && p.category !== null
      ? (p.category.id || p.category._id || '')
      : (typeof p.category === 'string' ? p.category : '');

    const price = Number(p.price || 0);
    const mrp = Number(p.mrp || p.price || 0);

    const rawPackaging = Array.isArray(p.packaging) && p.packaging.length > 0
      ? p.packaging.map((pack: any) => ({
          unit: pack.unit || 'pcs',
          unitLabelBn: pack.unitLabelBn || (pack.unit === 'pcs' ? 'পিস' : pack.unit === 'strip' ? 'পাতা' : pack.unit === 'box' ? 'বক্স' : pack.unit === 'bottle' ? 'বোতল' : pack.unit === 'tube' ? 'টিউব' : pack.unit === 'pack' ? 'প্যাক' : pack.unit),
          unitLabelEn: pack.unitLabelEn || pack.unit || 'pcs',
          price: Number(pack.price || price),
          mrp: pack.mrp ? Number(pack.mrp) : Number(pack.price || price),
          discountPrice: pack.discountPrice ? Number(pack.discountPrice) : undefined,
          stock: pack.stock !== undefined ? Number(pack.stock) : Math.floor(Number(p.stockCached || p.stock || 0) / Number(pack.baseUnitQty || 1)),
          multiplier: Number(pack.baseUnitQty || 1),
          isDefault: Boolean(pack.isDefault),
        }))
      : Array.isArray(p.unitPrices) && p.unitPrices.length > 0
      ? p.unitPrices.map((u: any) => ({
          unit: u.unit || p.unitType || 'pcs',
          unitLabelBn: u.unitLabelBn || (u.unit === 'pcs' ? 'পিস' : u.unit === 'strip' ? 'পাতা' : u.unit === 'box' ? 'বক্স' : u.unit === 'bottle' ? 'বোতল' : u.unit === 'tube' ? 'টিউব' : u.unit === 'pack' ? 'প্যাক' : u.unit),
          unitLabelEn: u.unitLabelEn || u.unit || 'pcs',
          price: Number(u.price || price),
          mrp: u.mrp ? Number(u.mrp) : Number(u.price || price),
          discountPrice: u.discountPrice ? Number(u.discountPrice) : undefined,
          stock: u.stock !== undefined ? Number(u.stock) : Number(p.stock || 0),
          multiplier: Number(u.multiplier || 1),
          isDefault: Boolean(u.isDefault),
        }))
      : [
          {
            unit: p.unitType || 'pcs',
            unitLabelBn: p.unitType === 'pcs' ? 'পিস' : p.unitType === 'strip' ? 'পাতা' : p.unitType === 'box' ? 'বক্স' : p.unitType || 'pcs',
            unitLabelEn: p.unitType || 'pcs',
            price,
            mrp,
            discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
            stock: Number(p.stock || 0),
            multiplier: 1,
            isDefault: true,
          },
        ];

    return {
      ...p,
      id: p.id || p._id || '',
      name: p.name || '',
      nameEn: p.nameEn || p.name || '',
      nameBn: p.nameBn || p.name || '',
      image: firstImg,
      unit: p.unit || p.unitType || 'pcs',
      unitType: p.unitType || 'strip',
      unitPrices: rawPackaging,
      dosageForm: p.dosageForm || 'tablet',
      slug: p.slug || '',
      category: categoryStr,
      brand: brandStr,
      tags: Array.isArray(p.tags) ? p.tags : [],
      price,
      mrp,
      discountPercent: p.discountPercent || (p.discountPrice && price ? Math.round(((price - p.discountPrice) / price) * 100) : 0),
      requiresRx: Boolean(p.requiresPrescription || p.requiresRx),
      inStock: typeof p.stock === 'number' ? p.stock > 0 : Boolean(p.inStock),
      stock: typeof p.stock === 'number' ? p.stock : 0,
      stockCount: typeof p.stock === 'number' ? p.stock : p.stockCount || 0,
      rating: p.rating || 4.8,
      reviewCount: p.reviewCount || 12,
      categoryId: categoryId || '',
      brandName: brandStr,
    };
  },

  /**
   * List and search products with query params or flexible filter state.
   */
  async getProducts(
    params: ProductQueryParams | any = {},
    sortArg?: string,
    searchArg?: string
  ): Promise<ProductListResponse> {
    const query = new URLSearchParams();

    let search = typeof params === 'object' ? (params.search || params.searchQuery || params.q) : undefined;
    if (searchArg) search = searchArg;
    if (search && search.trim()) query.append('search', search.trim());

    let sort = typeof params === 'object' ? params.sort : undefined;
    if (sortArg) sort = sortArg;
    if (sort) query.append('sort', sort);

    const categoryVal = params.category || params.categorySlug || (Array.isArray(params.categories) && params.categories.length > 0 ? params.categories[0] : undefined);
    if (categoryVal) query.append('category', categoryVal);

    const brandVal = params.brand || (Array.isArray(params.brands) && params.brands.length > 0 ? params.brands.join(',') : undefined);
    if (brandVal) query.append('brand', brandVal);

    if (params.dosageForm) query.append('dosageForm', params.dosageForm);
    if (params.unitType) query.append('unitType', params.unitType);
    if (params.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    if (params.includeInactive === true) {
      query.append('includeInactive', 'true');
    }

    const response = await apiClient<any>(`/products?${query.toString()}`, {
      method: 'GET',
    });

    let rawProducts: any[] = [];
    let total = 0;
    let page = params.page || 1;
    let limit = params.limit || 10;
    let totalPages = 1;

    if (Array.isArray(response)) {
      rawProducts = response;
      total = response.length;
    } else if (response && typeof response === 'object') {
      if (Array.isArray(response.products)) {
        rawProducts = response.products;
      } else if (Array.isArray(response.data)) {
        rawProducts = response.data;
      }

      if (response.meta) {
        total = response.meta.total || rawProducts.length;
        page = response.meta.page || page;
        limit = response.meta.limit || limit;
        totalPages = response.meta.totalPage || response.meta.totalPages || Math.ceil(total / limit) || 1;
      } else if (response.pagination) {
        total = response.pagination.total || rawProducts.length;
        page = response.pagination.page || page;
        limit = response.pagination.limit || limit;
        totalPages = response.pagination.totalPages || Math.ceil(total / limit) || 1;
      } else {
        total = rawProducts.length;
      }
    }

    const products = rawProducts.map((p) => this.formatProduct(p));

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      totalCount: total,
      availableBrands: [],
      availableCategories: [],
    };
  },

  /**
   * Get search suggestions.
   */
  async getSuggestions(q: string, limit = 8): Promise<Product[]> {
    const raw = await apiClient<any[]>(`/products/search/suggestions?q=${encodeURIComponent(q)}&limit=${limit}`, {
      method: 'GET',
    });
    return (raw || []).map((p) => this.formatProduct(p));
  },

  /**
   * Get featured products.
   */
  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    const raw = await apiClient<any[]>(`/products/featured?limit=${limit}`, {
      method: 'GET',
    });
    return (raw || []).map((p) => this.formatProduct(p));
  },

  /**
   * Get single product by ID or Slug.
   */
  async getProductByIdOrSlug(idOrSlug: string): Promise<Product> {
    const p = await apiClient<any>(`/products/${idOrSlug}`, {
      method: 'GET',
    });
    return this.formatProduct(p);
  },

  /**
   * Alias for getProductByIdOrSlug for slug routes.
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return this.getProductByIdOrSlug(slug);
  },

  /**
   * Alias for related products.
   */
  async getRelatedProducts(idOrSlug: string): Promise<Product[]> {
    const res = await this.getProducts({ limit: 4 });
    return res.products || [];
  },

  /**
   * Create a new product (Admin only).
   */
  async createProduct(payload: CreateProductPayload): Promise<Product> {
    return apiClient<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update product (Admin only).
   */
  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    return apiClient<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Toggle product isFeatured status (Admin only).
   */
  async toggleFeaturedProduct(id: string): Promise<Product> {
    return apiClient<Product>(`/products/${id}/toggle-feature`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete product (Admin only).
   */
  async deleteProduct(id: string): Promise<void> {
    return apiClient<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
