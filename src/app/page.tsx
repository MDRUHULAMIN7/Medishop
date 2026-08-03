'use client';

import React from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategorySidebar } from '@/components/home/CategorySidebar';
import { ShopByCategory } from '@/components/home/ShopByCategory';
import { PrescriptionCTA } from '@/components/home/PrescriptionCTA';
import { ProductSection } from '@/components/home/ProductSection';
import { WhyMediShop } from '@/components/home/WhyMediShop';
import { HowToOrder } from '@/components/home/HowToOrder';
import { useExclusiveDeals } from '@/hooks/useExclusiveDeals';
import { useFastMoving } from '@/hooks/useFastMoving';
import { useDiabeticProducts } from '@/hooks/useDiabeticProducts';
import { useWomenProducts } from '@/hooks/useWomenProducts';
import { useBabyProducts } from '@/hooks/useBabyProducts';
import { Sparkles, Zap, Activity, Heart, Baby } from 'lucide-react';

export default function HomePage() {
  const exclusiveDealsQuery = useExclusiveDeals();
  const fastMovingQuery = useFastMoving();
  const diabeticQuery = useDiabeticProducts();
  const womenQuery = useWomenProducts();
  const babyQuery = useBabyProducts();

  return (
    <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-8">
      {/* Main Grid: Category Sidebar (Desktop) + Main Feed */}
      <div className="flex items-start gap-6">
        {/* Left Sticky Desktop Category Sidebar */}
        <CategorySidebar />

        {/* Right Main Content Feed */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Hero Slider */}
          <HeroSlider />

          {/* Featured Shop By Category Carousel Section */}
          <ShopByCategory />

          {/* Prescription Upload & Direct Ordering CTA */}
          <PrescriptionCTA />

          {/* Product Section 1: Exclusive Deals */}
          <ProductSection
            titleBn="এক্সক্লুসিভ অফার ও ডিল"
            titleEn="Exclusive Deals & Offers"
            subtitleBn="সীমিত সময়ের জন্য বিশেষ ছাড়ের ওষুধসমূহ"
            subtitleEn="Special discounted items for a limited time"
            viewAllLink="/category/exclusive-deals"
            queryResult={exclusiveDealsQuery}
            icon={<Sparkles className="h-5 w-5 text-accent" />}
          />

          {/* Product Section 2: Fast-Moving OTC Medicines */}
          <ProductSection
            titleBn="জনপ্রিয় ওটিসি ওষুধসমূহ"
            titleEn="Fast-Moving OTC Medicines"
            subtitleBn="প্রেসক্রিপশন ছাড়া দৈনন্দিন প্রয়োজনীয় ওষুধ"
            subtitleEn="Everyday OTC medicines without prescription"
            viewAllLink="/category/otc-medicine"
            queryResult={fastMovingQuery}
            icon={<Zap className="h-5 w-5 text-amber-500" />}
          />

          {/* Product Section 3: Diabetic Care */}
          <ProductSection
            titleBn="ডায়াবেটিস কেয়ার"
            titleEn="Diabetic Care Supplies"
            subtitleBn="গ্লুকোমিটার, টেস্ট স্ট্রিপ ও ডায়াবেটিসের প্রয়োজনীয় সামগ্রী"
            subtitleEn="Glucometers, test strips and diabetes essentials"
            viewAllLink="/category/diabetic-care"
            queryResult={diabeticQuery}
            icon={<Activity className="h-5 w-5 text-primary" />}
          />

          {/* Product Section 4: Women's Choice */}
          <ProductSection
            titleBn="উইমেনস কেয়ার ও পার্সোনাল হাইজিন"
            titleEn="Women's Choice & Personal Hygiene"
            subtitleBn="নারীদের জন্য বিশেষায়িত স্বাস্থ্য ও হাইজিন সামগ্রী"
            subtitleEn="Specialized healthcare and hygiene products for women"
            viewAllLink="/category/women-choice"
            queryResult={womenQuery}
            icon={<Heart className="h-5 w-5 text-rose-500" />}
          />

          {/* Product Section 5: Baby Care */}
          <ProductSection
            titleBn="মা ও শিশুর যত্ন"
            titleEn="Baby & Child Care"
            subtitleBn="বেবি ডায়াপার, ইনফ্যান্ট শ্যাম্পু ও স্কিনকেয়ার সামগ্রী"
            subtitleEn="Baby diapers, baby shampoo and infant skincare"
            viewAllLink="/category/baby-care"
            queryResult={babyQuery}
            icon={<Baby className="h-5 w-5 text-teal-500" />}
          />

          {/* Feature Section 1: Why mediShop Is Bangladesh's Best Online Medicine Shop */}
          <WhyMediShop />

          {/* Feature Section 2: How To Order From mediShop */}
          <HowToOrder />
        </div>
      </div>
    </div>
  );
}
