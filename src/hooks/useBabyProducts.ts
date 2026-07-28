import { useFeaturedProducts } from './useFeaturedProducts';
import { SECTION_TAGS } from '@/lib/constants';

export function useBabyProducts() {
  return useFeaturedProducts(SECTION_TAGS.BABY_CARE);
}
