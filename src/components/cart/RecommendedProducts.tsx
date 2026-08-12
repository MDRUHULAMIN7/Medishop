'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/cart';
import { toast } from 'sonner';

interface RecommendedProductsProps {
  isBn?: boolean;
}

const RECOMMENDED_ITEMS = [
  {
    id: 'rec_1',
    nameEn: 'Napa Extra',
    nameBn: 'নাপা এক্সট্রা',
    dosageForm: 'Tablet',
    price: 240,
    mrp: 260,
    image: '/images/products/napa-extra.png',
    brand: 'BEXIMCO',
    unit: 'Tablet',
  },
  {
    id: 'rec_2',
    nameEn: 'Sergel',
    nameBn: 'সারজেল',
    dosageForm: 'Tablet',
    price: 130,
    mrp: 140,
    image: '/images/products/sergel.png',
    brand: 'HEALTHCARE',
    unit: 'Tablet',
  },
  {
    id: 'rec_3',
    nameEn: 'Vitamin D3 1000 IU',
    nameBn: 'ভিটামিন ডি৩ ১০০০ আইইউ',
    dosageForm: 'Capsule',
    price: 210,
    mrp: 230,
    image: '/images/products/vitamin-d3.png',
    brand: 'SQUARE',
    unit: 'Capsule',
  },
  {
    id: 'rec_4',
    nameEn: 'Panadol Extra',
    nameBn: 'প্যানাডল এক্সট্রা',
    dosageForm: 'Tablet',
    price: 180,
    mrp: 200,
    image: '/images/products/panadol-extra.png',
    brand: 'GSK',
    unit: 'Tablet',
  },
];

export function RecommendedProducts({ isBn = true }: RecommendedProductsProps) {
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (item: typeof RECOMMENDED_ITEMS[0]) => {
    addToCart({
      id: item.id,
      productId: item.id,
      nameEn: item.nameEn,
      nameBn: item.nameBn,
      slug: item.nameEn.toLowerCase().replace(/\s+/g, '-'),
      brand: item.brand,
      sellingPrice: item.price,
      mrp: item.mrp,
      price: item.price,
      image: item.image,
      images: [item.image],
      unit: item.unit,
      dosageForm: item.dosageForm,
      prescriptionRequired: false,
      stock: 100,
      quantity: 1,
    } as any);

    toast.success(
      isBn
        ? `"${item.nameBn}" কার্টে যুক্ত করা হয়েছে!`
        : `"${item.nameEn}" added to cart!`
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">
          {isBn ? 'আপনার জন্য প্রস্তাবিত' : 'Recommended For You'}
        </h3>
        <button
          type="button"
          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
        >
          {isBn ? 'সব দেখুন' : 'View All'}
        </button>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative group">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-gray-50 opacity-90 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-gray-50 opacity-90 transition-opacity cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto custom-scrollbar scroll-smooth py-1 px-1"
        >
          {RECOMMENDED_ITEMS.map((item) => (
            <div
              key={item.id}
              className="w-52 shrink-0 rounded-2xl border border-gray-200 bg-white p-4 flex flex-col justify-between hover:border-blue-600 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="h-28 w-full rounded-xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="text-center space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {isBn ? item.nameBn : item.nameEn}
                  </h4>
                  <p className="text-xs text-gray-400">{item.dosageForm}</p>
                  <p className="text-sm font-bold text-blue-600">
                    {formatPrice(item.price, isBn ? 'bn' : 'en')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
