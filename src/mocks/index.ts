import { NavCategory, TrustBadge, NavigationLink } from '@/types';

export const MOCK_CATEGORIES: NavCategory[] = [
  {
    id: 'c-1',
    slug: 'prescription-medicines',
    nameEn: 'Prescription Medicines',
    nameBn: 'প্রেসক্রিপশন ওষুধ',
    iconName: 'Pill',
    isPopular: true,
  },
  {
    id: 'c-2',
    slug: 'otc-medicines',
    nameEn: 'OTC Medicines',
    nameBn: 'ওটিসি (সাধারণ) ওষুধ',
    iconName: 'Stethoscope',
    isPopular: true,
  },
  {
    id: 'c-3',
    slug: 'diabetic-care',
    nameEn: 'Diabetic Care',
    nameBn: 'ডায়াবেটিস কেয়ার',
    iconName: 'Activity',
    isPopular: true,
  },
  {
    id: 'c-4',
    slug: 'women-care',
    nameEn: "Women's Choice",
    nameBn: 'উইমেনস কেয়ার',
    iconName: 'Heart',
    isPopular: true,
  },
  {
    id: 'c-5',
    slug: 'baby-care',
    nameEn: 'Baby Care',
    nameBn: 'বেবি কেয়ার',
    iconName: 'Baby',
    isPopular: true,
  },
  {
    id: 'c-6',
    slug: 'healthcare-devices',
    nameEn: 'Healthcare Devices',
    nameBn: 'হেলথকেয়ার ডিভাইস',
    iconName: 'ShieldPlus',
  },
  {
    id: 'c-7',
    slug: 'personal-care',
    nameEn: 'Personal Care',
    nameBn: 'পার্সোনাল কেয়ার',
    iconName: 'Sparkles',
  },
  {
    id: 'c-8',
    slug: 'supplements',
    nameEn: 'Vitamins & Supplements',
    nameBn: 'ভিটামিন ও সাপ্লিমেন্ট',
    iconName: 'Apple',
  },
];

export const MOCK_TRUST_BADGES: TrustBadge[] = [
  {
    id: 'tb-1',
    titleBn: 'ডিজিডিএ অনুমোদিত লাইসেন্স',
    titleEn: 'DGDA Licensed Pharmacy',
    descriptionBn: 'লাইসেন্স নং: DAR-2026-BD',
    descriptionEn: 'Govt. Reg. #DAR-2026-BD',
    iconName: 'ShieldCheck',
  },
  {
    id: 'tb-2',
    titleBn: '১০০% আসল ওষুধ',
    titleEn: '100% Authentic Medicines',
    descriptionBn: 'সরাসরি প্রস্তুতকারক থেকে সংগৃহীত',
    descriptionEn: 'Directly sourced from top brands',
    iconName: 'Award',
  },
  {
    id: 'tb-3',
    titleBn: 'সেম-ডে ঢাকা ডেলিভারি',
    titleEn: 'Same-Day Dhaka Express',
    descriptionBn: 'ঢাকার ভেতর ৪-৬ ঘণ্টায় ডেলিভারি',
    descriptionEn: 'Delivered in 4-6 hours in Dhaka',
    iconName: 'Truck',
  },
  {
    id: 'tb-4',
    titleBn: '২৪/৭ গ্র্যাজুয়েট ফার্মাসিস্ট',
    titleEn: '24/7 Pharmacist Support',
    descriptionBn: 'বিনামূল্যে ওষুধ পরামর্শ ও সহায়তা',
    descriptionEn: 'Free medicine consultation',
    iconName: 'Headphones',
  },
];

export const MOCK_FOOTER_NAV = {
  about: [
    { labelBn: 'আমাদের সম্পর্কে', labelEn: 'About mediShop', href: '/about' },
    { labelBn: 'যোগাযোগ করুন', labelEn: 'Contact Us', href: '/contact' },
    { labelBn: 'ডিজিডিএ লাইসেন্স', labelEn: 'DGDA License', href: '/about#license' },
    { labelBn: 'ফার্মাসিস্ট টিম', labelEn: 'Pharmacist Team', href: '/about#team' },
    { labelBn: 'ক্যারিয়ার', labelEn: 'Careers', href: '/about#careers' },
  ],
  categories: [
    { labelBn: 'প্রেসক্রিপশন ওষুধ', labelEn: 'Prescription Medicines', href: '/category/prescription-medicines' },
    { labelBn: 'ডায়াবেটিস কেয়ার', labelEn: 'Diabetic Care', href: '/category/diabetic-care' },
    { labelBn: 'উইমেনস কেয়ার', labelEn: "Women's Care", href: '/category/women-care' },
    { labelBn: 'বেবি কেয়ার', labelEn: 'Baby Care', href: '/category/baby-care' },
    { labelBn: 'ভিটামিন ও সাপ্লিমেন্ট', labelEn: 'Vitamins & Supplements', href: '/category/supplements' },
  ],
  support: [
    { labelBn: 'সাহায্য ও প্রশ্ন (FAQ)', labelEn: 'Help & FAQ', href: '/faq' },
    { labelBn: 'প্রেসক্রিপশন আপলোড', labelEn: 'Upload Prescription', href: '/upload-prescription' },
    { labelBn: 'ডেলিভারি নীতি', labelEn: 'Delivery Policy', href: '/delivery-policy' },
    { labelBn: 'ফেরত ও রিফান্ড নীতি', labelEn: 'Return & Refund Policy', href: '/refund-policy' },
    { labelBn: 'গোপনীয়তা নীতি', labelEn: 'Privacy Policy', href: '/privacy' },
    { labelBn: 'ব্যবহারের শর্তাবলী', labelEn: 'Terms & Conditions', href: '/terms' },
  ],
};
