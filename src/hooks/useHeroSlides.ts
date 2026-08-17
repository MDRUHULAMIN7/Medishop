import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { MOCK_HERO_SLIDES } from '@/mocks/hero';
import { HeroSlide } from '@/types/home';

export function useHeroSlides() {
  return useQuery<HeroSlide[]>({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      try {
        const publicSettings = await settingsService.getPublicSettings();
        if (
          publicSettings &&
          publicSettings.banners &&
          Array.isArray(publicSettings.banners) &&
          publicSettings.banners.length > 0
        ) {
          const activeBanners = publicSettings.banners
            .filter((b) => b.isActive !== false)
            .sort((a, b) => (Number(a.priority) || 1) - (Number(b.priority) || 1));

          if (activeBanners.length > 0) {
            return activeBanners.map((b) => ({
              id: b.id || `banner-${Math.random()}`,
              titleBn: b.titleBn || b.titleEn,
              titleEn: b.titleEn,
              subtitleBn: b.subtitleBn || b.subtitleEn,
              subtitleEn: b.subtitleEn,
              badgeBn: b.badgeBn || b.badgeEn,
              badgeEn: b.badgeEn,
              ctaTextBn: b.ctaTextBn || 'অর্ডার করুন',
              ctaTextEn: b.ctaTextEn || 'Order Now',
              ctaLink: b.ctaLink || '/products',
              image:
                b.image ||
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
              bgGradient: 'from-slate-950/75 via-slate-900/50 to-primary-dark/80',
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic hero banners from settings:', err);
      }
      return MOCK_HERO_SLIDES;
    },
    staleTime: 60 * 1000,
  });
}
