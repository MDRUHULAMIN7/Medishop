import { MOCK_PRODUCTS } from '@/mocks/products';
import { FULL_MOCK_CATEGORIES } from '@/mocks/categories';
import { Product } from '@/types/home';
import { ProductFilterState, SortOption, ProductListingData, Brand } from '@/types/product';

export const ProductService = {
  async getProducts(
    filters: Partial<ProductFilterState> = {},
    sort: SortOption = 'popularity',
    searchQuery?: string
  ): Promise<ProductListingData> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let list = [...MOCK_PRODUCTS];

    // Filter by Search Query
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameBn.includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // Filter by Category Slug
    if (filters.categorySlug) {
      list = list.filter((p) => p.categoryId === filters.categorySlug);
    }

    // Filter by Multi Categories
    if (filters.categories && filters.categories.length > 0) {
      list = list.filter((p) => filters.categories!.includes(p.categoryId));
    }

    // Filter by Brands
    if (filters.brands && filters.brands.length > 0) {
      list = list.filter((p) => filters.brands!.includes(p.brand));
    }

    // Filter by Price Range
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // Filter by In Stock
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Filter by Prescription Requirement
    if (filters.prescriptionReq === 'required') {
      list = list.filter((p) => p.requiresRx);
    } else if (filters.prescriptionReq === 'otc') {
      list = list.filter((p) => !p.requiresRx);
    }

    // Filter by Discount Percentage
    if (filters.discounts && filters.discounts.length > 0) {
      const minDiscount = Math.min(...filters.discounts);
      list = list.filter((p) => p.discountPercent >= minDiscount);
    }

    // Sorting
    list.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'discount-desc':
          return b.discountPercent - a.discountPercent;
        case 'name-asc':
          return a.nameEn.localeCompare(b.nameEn);
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'popularity':
        default:
          return b.rating - a.rating;
      }
    });

    // Available Brands Calculation
    const brandMap: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p) => {
      brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
    });

    const availableBrands: Brand[] = Object.keys(brandMap).map((b) => ({
      id: b.toLowerCase().replace(/\s+/g, '-'),
      name: b,
      slug: b.toLowerCase().replace(/\s+/g, '-'),
      productCount: brandMap[b],
    }));

    return {
      products: list,
      totalCount: list.length,
      availableBrands,
      priceRange: { min: 0, max: 3000 },
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  },

  async getRelatedProducts(
    productId: string,
    categoryId: string
  ): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.filter(
      (p) => p.id !== productId && (p.categoryId === categoryId || p.requiresRx)
    ).slice(0, 4);
  },
};
