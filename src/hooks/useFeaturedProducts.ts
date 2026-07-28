import { useQuery } from '@tanstack/react-query';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { Product } from '@/types/home';

export function useFeaturedProducts(tag?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', tag || 'all'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (tag) {
        return MOCK_PRODUCTS.filter((p) => p.tags.includes(tag));
      }
      return MOCK_PRODUCTS;
    },
    staleTime: 5 * 60 * 1000,
  });
}
