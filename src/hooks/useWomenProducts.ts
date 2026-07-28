import { useFeaturedProducts } from './useFeaturedProducts';
import { SECTION_TAGS } from '@/lib/constants';

export function useWomenProducts() {
  return useFeaturedProducts(SECTION_TAGS.WOMEN_CHOICE);
}
