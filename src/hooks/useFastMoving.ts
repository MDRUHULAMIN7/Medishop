import { useFeaturedProducts } from './useFeaturedProducts';
import { SECTION_TAGS } from '@/lib/constants';

export function useFastMoving() {
  return useFeaturedProducts(SECTION_TAGS.FAST_MOVING_OTC);
}
