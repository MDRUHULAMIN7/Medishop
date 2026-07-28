'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';

export function useRelatedProducts(productId: string, categoryId: string) {
  return useQuery({
    queryKey: ['related-products', productId, categoryId],
    queryFn: () => ProductService.getRelatedProducts(productId, categoryId),
    enabled: !!productId && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}
