'use client';

import React from 'react';
import Link from 'next/link';
import {
  Upload,
  ShieldCheck,
  Award,
  Truck,
  Headphones,
  Search,
  Pill,
  ArrowRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openAuthModal } from '@/store/slices/authSlice';
import { addToCart, openCartDrawer } from '@/store/slices/cartSlice';
import { toast } from 'sonner';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const handleDemoAddToCart = () => {
    dispatch(
      addToCart({
        productId: 'demo-p1',
        nameEn: 'Sergel 20mg Capsule (Esomeprazole)',
        nameBn: 'সার্জেল ২০ মি.গ্রা. ক্যাপসুল (এসোমিপ্রাজল)',
        price: 70,
        mrp: 80,
        image: 'https://placehold.co/200x200/1D4ED8/FFFFFF?text=Sergel+20',
        quantity: 1,
      })
    );
    toast.success(
      isBn
        ? 'সার্জেল ২০ কার্টে যোগ করা হয়েছে!'
        : 'Sergel 20 added to cart successfully!'
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Welcome Banner (Phase 1 Shell Placeholder) */}
      <section className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 text-accent" />
                {isBn
                  ? 'ডিজিডিএ অনুমোদিত অনলাইন ফার্মেসি'
                  : 'DGDA Approved Digital Pharmacy'}
              </span>
              <h1 className="font-serif-title text-2xl font-bold leading-tight sm:text-4xl">
                {isBn
                  ? 'আপনার প্রয়োজনের ১০০% আসল ওষুধ ঘরে বসেই পান'
                  : 'Get 100% Authentic Medicines Delivered to Your Doorstep'}
              </h1>
              <p className="text-sm text-white/90 sm:text-base leading-relaxed">
                {isBn
                  ? 'ঢাকা শহরে সেম-ডে এক্সপ্রেস ডেলিভারি ও দ্রুততম প্রেসক্রিপশন ভেরিফিকেশন। অভিজ্ঞ ফার্মাসিস্টদের পরামর্শে নিরাপদ স্বাস্থ্যসেবা।'
                  : 'Same-day express delivery in Dhaka city with fast pharmacist verification.'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/upload-prescription"
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-foreground shadow-md transition-transform hover:bg-accent-dark hover:scale-102"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {isBn ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription'}
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(openAuthModal('signin'))}
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                >
                  <span>{isBn ? 'লগইন / সাইন আপ' : 'Login / Register'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Feature Cards Demo */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-white">
                {isBn ? 'ফেজ-১ আর্কিটেকচার ডেমো' : 'Phase 1 Architecture Demo'}
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDemoAddToCart}
                  className="flex items-center justify-between rounded-xl bg-white/90 p-3 text-left font-semibold text-foreground hover:bg-white"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                    <Pill className="h-4 w-4 text-primary" />
                    {isBn
                      ? 'টেস্ট আইটেম কার্টে যোগ করুন (সার্জেল ২০)'
                      : 'Add Test Item to Cart (Sergel 20)'}
                  </span>
                  <span className="rounded-lg bg-primary px-2.5 py-1 text-xs text-white">
                    ৳৭০
                  </span>
                </button>
                <button
                  onClick={() => dispatch(openCartDrawer())}
                  className="flex items-center justify-between rounded-xl bg-white/90 p-3 text-left font-semibold text-foreground hover:bg-white"
                >
                  <span className="text-xs sm:text-sm">
                    {isBn ? 'কার্ট ড্রেয়ার টেস্ট করুন' : 'Open Cart Drawer'}
                  </span>
                  <span className="text-xs text-primary font-bold">
                    {isBn ? 'ড্রয়ার দেখুন' : 'View Drawer'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
