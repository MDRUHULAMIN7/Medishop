import { MOCK_PRODUCTS } from '@/mocks/products';
import { AutocompleteResult } from '@/types/search';

export const SearchService = {
  async autocomplete(query: string): Promise<AutocompleteResult> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (!query || query.trim() === '') {
      return { query: '', suggestions: [], totalMatches: 0 };
    }

    const q = query.toLowerCase().trim();
    const matches = MOCK_PRODUCTS.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.brand.toLowerCase().includes(q)
    );

    return {
      query,
      suggestions: matches.slice(0, 5),
      totalMatches: matches.length,
    };
  },
};
