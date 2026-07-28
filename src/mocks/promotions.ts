import { PrescriptionStep, PromotionBanner } from '@/types/home';

export const MOCK_PRESCRIPTION_STEPS: PrescriptionStep[] = [
  {
    stepNumber: 1,
    titleBn: 'প্রেসক্রিপশনের ছবি তুলুন',
    titleEn: 'Capture clear photo of your prescription.',
    descriptionBn: 'আপনার ডাক্তার প্রদত্ত প্রেসক্রিপশনের স্পষ্ট ছবি তুলুন।',
    descriptionEn: 'Take a clear photo of your prescription.',
    iconName: 'Camera',
  },
  {
    stepNumber: 2,
    titleBn: 'ছবি আপলোড করুন',
    titleEn: 'Login to upload the photo.',
    descriptionBn: 'সহজে ওয়েবসাইট বা অ্যাপে প্রেসক্রিপশন আপলোড করুন।',
    descriptionEn: 'Upload the photo easily on website or app.',
    iconName: 'Upload',
  },
  {
    stepNumber: 3,
    titleBn: 'ফার্মাসিস্ট ভেরিফিকেশন',
    titleEn: 'Our expert pharmacists will verify.',
    descriptionBn: 'আমাদের গ্র্যাজুয়েট ফার্মাসিস্ট ওষুধ যাচাই করবে।',
    descriptionEn: 'Our licensed pharmacists check all medicines.',
    iconName: 'ShieldCheck',
  },
  {
    stepNumber: 4,
    titleBn: 'কল কনফার্মেশন ও ডেলিভারি',
    titleEn: 'Customer agent calls to confirm order.',
    descriptionBn: 'ফোন কলে আপনার অর্ডার কনফার্ম করে দ্রুত ডেলিভারি দেওয়া হবে।',
    descriptionEn: 'Confirmation via call and fast home delivery.',
    iconName: 'PhoneCall',
  },
];

export const MOCK_APP_DOWNLOAD_BANNER: PromotionBanner = {
  id: 'promo-1',
  titleBn: 'কিভাবে ওষুধ অর্ডার করবেন?',
  titleEn: 'How to Order Medicines?',
  subtitleBn: '১. প্রেসক্রিপশন ছবি আপলোড করুন অথবা ওষুধ সার্চ করে কিনুন।\n২. আমাদের ফার্মাসিস্ট ফোন করে অর্ডার কনফার্ম করবে।\n৩. ১২-২৪ ঘণ্টার মধ্যে ডেলিভারি বুঝে নিন।',
  subtitleEn: '1. Upload prescription or search medicines.\n2. Pharmacist verifies and calls to confirm.\n3. Receive delivery within 12-24 hours.',
  ctaTextBn: 'অ্যাপ ডাউনলোড করুন',
  ctaTextEn: 'Download App',
  ctaLink: '#download',
  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
};
