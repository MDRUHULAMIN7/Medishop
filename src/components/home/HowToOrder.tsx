'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '@/store';
import Link from 'next/link';

export function HowToOrder() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <section className="w-full pt-4 pb-2">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          {isBn ? 'মেডিশপ থেকে অর্ডার করার সহজ নিয়ম' : 'How To Order From mediShop'}
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Brand Story & Trust Statement */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {isBn
              ? 'বাংলাদেশের নির্ভরযোগ্য ডিজিডিএ অনুমোদিত অনলাইন ফার্মেসি'
              : 'Trusted Online Pharmacy & Medicine Store in Bangladesh'}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isBn
              ? 'মেডিশপ হলো বাংলাদেশের বিশ্বস্ত অনলাইন প্ল্যাটফর্ম, যেখান থেকে আপনার প্রয়োজনীয় ১০০% আসল ওষুধ ও স্বাস্থ্য সামগ্রী সহজের ঘরে বসে পেয়ে যাবেন। আপনার প্রেসক্রিপশন ওষুধ, ওটিসি ড্রাগ, পার্সোনাল কেয়ার কিংবা নিত্যদিনের স্বাস্থ্য সামগ্রী—সবই এক ক্লিকে অর্ডার করার সুবিধা রয়েছে। আমাদের ভেরিফাইড এ-গ্রেড ফার্মাসিস্ট টিম প্রতিটি অর্ডার সতর্কতার সাথে চেক করে ডেলিভারি নিশ্চিত করেন।'
              : 'Order medicines online from mediShop, your trusted online pharmacy in Bangladesh, and have genuine healthcare products delivered safely to your doorstep. Whether you need prescription medicines, OTC drugs, wellness products, or daily healthcare essentials, our platform offers a simple, secure, and hassle-free shopping experience. Browse thousands of authentic products, upload prescriptions with ease, and enjoy competitive prices backed by verified A-Grade pharmacists.'}
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">
            {isBn
              ? 'সারাদেশে এক্সপ্রেস ডেলিভারি, নিরাপদ পেমেন্ট অপশন এবং ডেডিকেটেড কাস্টমার কেয়ার সাপোর্ট নিয়ে আমরা আপনার ও আপনার পরিবারের স্বাস্থ্য সেবায় সর্বদা নিয়োজিত। মেডিশপের সাথে আপনার ও আপনার পরিবারের ডিজিটাল স্বাস্থ্য সেবাকে আরও সহজ ও নির্ভরযোগ্য করুন।'
              : 'With fast nationwide delivery, secure payment options, and dedicated customer support, we are committed to making quality healthcare accessible, convenient, and reliable for every family across Bangladesh. Experience a smarter way to manage your health with mediShop, where your well-being is always our priority.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/upload-prescription"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-all"
            >
              <span>{isBn ? 'প্রেসক্রিপশন দিয়ে অর্ডার করুন' : 'Order With Prescription'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 text-xs font-semibold text-success">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{isBn ? '১০০% আসল ওষুধের গ্যারান্টি' : '100% Authentic Guarantee'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Easy Steps Card */}
        <div className="lg:col-span-5 flex">
          <div className="w-full rounded-3xl border border-border bg-background p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-foreground">
                {isBn ? 'মাত্র ৩টি সহজ ধাপে ওষুধ অর্ডার করুন' : 'Order Medicine in 3 Easy Steps'}
              </h4>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {isBn
                  ? 'স্বচ্ছ মূল্য। ভেরিফাইড ফার্মাসিস্ট। জিরো ঝামেলা।'
                  : 'Transparent pricing. Verified pharmacists. Zero hassle.'}
              </p>

              {/* Steps List */}
              <div className="mt-6 flex flex-col gap-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-3.5 sm:p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-xs text-white shadow-xs">
                    01
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-foreground">
                      {isBn ? 'ওষুধ বা হেলথ প্রোডাক্ট খুঁজুন' : 'Search Medicines'}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal">
                      {isBn
                        ? 'আমাদের ক্যাটালগ থেকে প্রয়োজনীয় ওষুধ ও স্বাস্থ্য সামগ্রী সিলেক্ট করুন।'
                        : 'Find your required medicines or healthcare products from our online catalog.'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-3.5 sm:p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-xs text-white shadow-xs">
                    02
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-foreground">
                      {isBn ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription'}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal">
                      {isBn
                        ? 'প্রেসক্রিপশন ভিত্তিক ওষুধের জন্য পরিষ্কার প্রেসক্রিপশন ছবি যুক্ত করুন।'
                        : 'Upload a valid prescription for prescription-based medicines during checkout.'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-3.5 sm:p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-xs text-white shadow-xs">
                    03
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-foreground">
                      {isBn ? 'ঘরে বসেই বুঝে নিন ডেলিভারি' : 'Get Home Delivery'}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal">
                      {isBn
                        ? 'অর্ডার কনফার্ম করুন এবং বাংলাদেশের যেকোনো প্রান্তে দ্রুততম সময়ে গ্রহণ করুন।'
                        : 'Confirm your order and receive medicines safely at your doorstep anywhere in BD.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
