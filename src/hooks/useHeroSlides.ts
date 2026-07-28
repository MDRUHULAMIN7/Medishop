import { useQuery } from '@tanstack/react-query';
import { MOCK_HERO_SLIDES } from '@/mocks/hero';
import { HeroSlide } from '@/types/home';

export function useHeroSlides() {
  return useQuery<HeroSlide[]>({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      // Simulate light async fetch delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_HERO_SLIDES;
    },
    staleTime: 5 * 60 * 1000,
  });
}
