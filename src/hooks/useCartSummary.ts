import { useAppSelector } from '@/store';
import {
  selectCartSummary,
  selectFreeDeliveryProgress,
} from '@/store/slices/cartSlice';

export function useCartSummary() {
  const summary = useAppSelector(selectCartSummary);
  const freeDeliveryProgress = useAppSelector(selectFreeDeliveryProgress);
  const language = useAppSelector((state) => state.ui.language);

  return {
    ...summary,
    freeDeliveryProgress,
    isBn: language === 'bn',
  };
}
