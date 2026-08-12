import { ProductService, Product } from '@/services/product.service';
import { AutocompleteResult } from '@/types/search';

export const SearchService = {
  async autocomplete(query: string): Promise<AutocompleteResult> {
    if (!query || query.trim() === '') {
      return { query: '', suggestions: [], totalMatches: 0 };
    }

    const trimmed = query.trim();

    try {
      // 1. Try fast backend search suggestions API
      const suggestions = await ProductService.getSuggestions(trimmed, 8);
      if (suggestions && suggestions.length > 0) {
        return {
          query: trimmed,
          suggestions: suggestions as any[],
          totalMatches: suggestions.length,
        };
      }

      // 2. Fallback to full products text search query
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
