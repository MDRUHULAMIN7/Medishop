'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';

export function useProductDetails(slug: string) {
  return useQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => ProductService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
