import { useQuery } from '@tanstack/react-query';
import { ProductService, Product } from '@/services/product.service';

export function useFeaturedProducts(tag?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', tag || 'all'],
    queryFn: async () => {
      if (tag) {
        const searchRes = await ProductService.getProducts({ search: tag, limit: 8 });
        if (searchRes.products && searchRes.products.length > 0) {
          return searchRes.products;
        }
      }

      // If no tag match or no tag specified, get featured products or catalog list
      const featured = await ProductService.getFeaturedProducts(8);
      if (featured && featured.length > 0) {
        return featured;
      }

      const allRes = await ProductService.getProducts({ limit: 8 });
      return allRes.products || [];
    },
    staleTime: 0,
  });
}
