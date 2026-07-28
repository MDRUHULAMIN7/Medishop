import { useFeaturedProducts } from './useFeaturedProducts';
import { SECTION_TAGS } from '@/lib/constants';

export function useExclusiveDeals() {
  return useFeaturedProducts(SECTION_TAGS.EXCLUSIVE_DEALS);
}
