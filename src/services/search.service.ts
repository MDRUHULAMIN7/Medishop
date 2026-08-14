import { ProductService, Product } from '@/services/product.service';
import { AutocompleteResult } from '@/types/search';

export const SearchService = {
  async autocomplete(query: string): Promise<AutocompleteResult> {
    if (!query || query.trim() === '') {
      return { query: '', suggestions: [], totalMatches: 0 };
    }

    const trimmed = query.trim();

    try {
      // Fetch full matching products with image, price, and details
      const searchRes = await ProductService.getProducts({ search: trimmed, limit: 8 });
      return {
        query: trimmed,
        suggestions: searchRes.products as any[],
        totalMatches: searchRes.pagination?.total || searchRes.products.length,
      };
    } catch {
      return {
        query: trimmed,
        suggestions: [],
        totalMatches: 0,
      };
    }
  },
};
