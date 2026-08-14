import { NavCategory, TrustBadge } from '@/types';

export interface HeroSlide {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn?: string;
  badgeEn?: string;
  ctaTextBn: string;
  ctaTextEn: string;
  ctaLink: string;
  image: string;
  bgGradient: string;
}

export interface Product {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  brand: string;
  categoryId: string;
  price: number;
  mrp: number;
  discountPercent: number;
  image: string;
  images?: string[];
  requiresRx: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  unit: string;
  tags: string[]; // e.g. ['exclusive-deals', 'fast-moving-otc', 'diabetic-care', 'women-choice', 'baby-care']
}

export interface PrescriptionStep {
  stepNumber: number;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: string;
}

export interface PromotionBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaTextBn: string;
  ctaTextEn: string;
  ctaLink: string;
  image: string;
}
