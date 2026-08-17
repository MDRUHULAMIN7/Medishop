import { apiClient } from '@/lib/apiClient';

export interface UnitPriceOption {
  unit: string;
  unitLabelBn?: string;
  unitLabelEn?: string;
  buyingPrice?: number;
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
  buyingPrice?: number;
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
  buyingPrice?: number;
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
  buyingPrice?: number;
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
  isAdmin?: boolean;
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

    const totalBaseStock = Number(p.stockCount ?? p.stockCached ?? p.stock ?? 0);

    const rawPackaging = Array.isArray(p.packaging) && p.packaging.length > 0
      ? p.packaging.map((pack: any) => {
          const multiplier = Number(pack.baseUnitQty || pack.multiplier || 1);
          return {
            unit: pack.unit || 'pcs',
            unitLabelBn: pack.unitLabelBn || (pack.unit === 'pcs' ? 'পিস' : pack.unit === 'strip' ? 'পাতা' : pack.unit === 'box' ? 'বক্স' : pack.unit === 'bottle' ? 'বোতল' : pack.unit === 'tube' ? 'টিউব' : pack.unit === 'pack' ? 'প্যাক' : pack.unit),
            unitLabelEn: pack.unitLabelEn || pack.unit || 'pcs',
            buyingPrice: pack.buyingPrice !== undefined ? Number(pack.buyingPrice) : (p.buyingPrice ? Number(p.buyingPrice) * multiplier : 0),
            price: Number(pack.price || price),
            mrp: pack.mrp ? Number(pack.mrp) : Number(pack.price || price),
            discountPrice: pack.discountPrice ? Number(pack.discountPrice) : undefined,
            stock: Math.floor(totalBaseStock / multiplier),
            multiplier,
            isDefault: Boolean(pack.isDefault),
          };
        })
      : Array.isArray(p.unitPrices) && p.unitPrices.length > 0
      ? p.unitPrices.map((u: any) => {
          const multiplier = Number(u.multiplier || u.baseUnitQty || 1);
          return {
            unit: u.unit || p.unitType || 'pcs',
            unitLabelBn: u.unitLabelBn || (u.unit === 'pcs' ? 'পিস' : u.unit === 'strip' ? 'পাতা' : u.unit === 'box' ? 'বক্স' : u.unit === 'bottle' ? 'বোতল' : u.unit === 'tube' ? 'টিউব' : u.unit === 'pack' ? 'প্যাক' : u.unit),
            unitLabelEn: u.unitLabelEn || u.unit || 'pcs',
            buyingPrice: u.buyingPrice !== undefined ? Number(u.buyingPrice) : (p.buyingPrice ? Number(p.buyingPrice) * multiplier : 0),
            price: Number(u.price || price),
            mrp: u.mrp ? Number(u.mrp) : Number(u.price || price),
            discountPrice: u.discountPrice ? Number(u.discountPrice) : undefined,
            stock: Math.floor(totalBaseStock / multiplier),
            multiplier,
            isDefault: Boolean(u.isDefault),
          };
        })
      : [
          {
            unit: p.unitType || 'pcs',
            unitLabelBn: p.unitType === 'pcs' ? 'পিস' : p.unitType === 'strip' ? 'পাতা' : p.unitType === 'box' ? 'বক্স' : p.unitType || 'pcs',
            unitLabelEn: p.unitType || 'pcs',
            buyingPrice: Number(p.buyingPrice || 0),
            price,
            mrp,
            discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
            stock: totalBaseStock,
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
      buyingPrice: p.buyingPrice !== undefined ? Number(p.buyingPrice) : 0,
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

    const categoryVal =
      Array.isArray(params.categories) && params.categories.length > 0
        ? params.categories.join(',')
        : params.category || params.categorySlug;
    if (categoryVal) query.append('category', categoryVal);

    const brandVal =
      Array.isArray(params.brands) && params.brands.length > 0
        ? params.brands.join(',')
        : params.brand;
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
    if (params.isAdmin === true) {
      query.append('isAdmin', 'true');
    }

    const response = await apiClient<any>(`/products?${query.toString()}`, {
      method: 'GET',
    });

    let rawProducts: any[] = [];
    let total = 0;
    let page = params.page || 1;
    let limit = params.limit || 12;
    let totalPages = 1;

    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        rawProducts = response;
      } else if (Array.isArray(response.products)) {
        rawProducts = response.products;
      } else if (Array.isArray(response.data)) {
        rawProducts = response.data;
      }

      const meta = response.meta || response.pagination || (Array.isArray(response) ? (response as any).meta : undefined) || (response.total !== undefined ? { total: response.total, page: response.page, limit: response.limit, totalPages: response.totalPages } : undefined);

      if (meta) {
        total = Number(meta.total !== undefined ? meta.total : (meta.totalCount !== undefined ? meta.totalCount : rawProducts.length));
        page = Number(meta.page || params.page || 1);
        limit = Number(meta.limit || params.limit || 10);
        totalPages = Number(meta.totalPages || meta.pages || meta.totalPage || Math.ceil(total / limit) || 1);
      } else {
        total = rawProducts.length;
        totalPages = Math.ceil(total / (params.limit || 10)) || 1;
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
  async getProductByIdOrSlug(idOrSlug: string, isAdmin?: boolean): Promise<Product> {
    const endpoint = isAdmin ? `/products/${idOrSlug}?isAdmin=true` : `/products/${idOrSlug}`;
    const p = await apiClient<any>(endpoint, {
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
