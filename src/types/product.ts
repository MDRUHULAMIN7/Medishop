import { Product } from '@/types/home';

export type SortOption =
  | 'popularity'
  | 'price-asc'
  | 'price-desc'
  | 'discount-desc'
  | 'newest'
  | 'name-asc';

export type PrescriptionFilterValue = 'all' | 'required' | 'otc';

export interface ProductFilterState {
  categorySlug?: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  discounts: number[];
  inStockOnly: boolean;
  prescriptionReq: PrescriptionFilterValue;
  searchQuery?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductListingData {
  products: Product[];
  totalCount: number;
  availableBrands: Brand[];
  priceRange: { min: number; max: number };
}
