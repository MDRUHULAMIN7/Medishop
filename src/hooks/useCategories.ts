import { useQuery } from '@tanstack/react-query';
import { FULL_MOCK_CATEGORIES } from '@/mocks/categories';
import { NavCategory } from '@/types';

export function useCategories() {
  return useQuery<NavCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return FULL_MOCK_CATEGORIES;
    },
    staleTime: 10 * 60 * 1000,
  });
}
