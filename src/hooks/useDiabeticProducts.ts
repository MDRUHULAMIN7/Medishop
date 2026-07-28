import { useFeaturedProducts } from './useFeaturedProducts';
import { SECTION_TAGS } from '@/lib/constants';

export function useDiabeticProducts() {
  return useFeaturedProducts(SECTION_TAGS.DIABETIC_CARE);
}
