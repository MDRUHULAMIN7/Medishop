'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductService, Product } from '@/services/product.service';
import { ProductCard } from '@/components/home/ProductCard';

interface RecommendedProductsProps {
  isBn?: boolean;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Napa Extra 500mg',
    nameEn: 'Napa Extra 500mg',
    nameBn: 'নাপা এক্সট্রা ৫০০ মি.গ্রা.',
    slug: 'napa-extra',
    dosageForm: 'Tablet',
    unitType: 'Tablet',
    unit: '10 Tablets Strip',
    unitPrices: [{ unit: 'Tablet', price: 25, mrp: 30, stock: 100, isDefault: true }],
    price: 25,
    mrpPrice: 30,
    stockCount: 100,
    inStock: true,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 24,
    brandName: 'Beximco Pharmaceuticals',
  } as any,
  {
    id: 'prod_2',
    name: 'Sergel 20mg',
    nameEn: 'Sergel 20mg',
    nameBn: 'সারজেল ২০ মি.গ্রা.',
    slug: 'sergel-20mg',
    dosageForm: 'Capsule',
    unitType: 'Capsule',
    unit: '10 Capsules Strip',
    unitPrices: [{ unit: 'Capsule', price: 70, mrp: 80, stock: 100, isDefault: true }],
    price: 70,
    mrpPrice: 80,
    stockCount: 100,
    inStock: true,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 38,
    brandName: 'Healthcare Pharmaceuticals',
  } as any,
  {
    id: 'prod_3',
    name: 'Monas 10mg',
    nameEn: 'Monas 10mg',
    nameBn: 'মোনাস ১০ মি.গ্রা.',
    slug: 'monas-10mg',
    dosageForm: 'Tablet',
    unitType: 'Tablet',
    unit: '15 Tablets Box',
    unitPrices: [{ unit: 'Tablet', price: 260, mrp: 280, stock: 100, isDefault: true }],
    price: 260,
    mrpPrice: 280,
    stockCount: 100,
    inStock: true,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1550572017-edf9955a5510?w=300&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 19,
    brandName: 'Acme Laboratories',
  } as any,
  {
    id: 'prod_4',
    name: 'Ceevit 250mg',
    nameEn: 'Ceevit 250mg',
    nameBn: 'সিভিট ২৫০ মি.গ্রা.',
    slug: 'ceevit-250mg',
    dosageForm: 'Chewable Tablet',
    unitType: 'Tablet',
    unit: '10 Tablets Strip',
    unitPrices: [{ unit: 'Tablet', price: 18, mrp: 20, stock: 100, isDefault: true }],
    price: 18,
    mrpPrice: 20,
    stockCount: 100,
    inStock: true,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 42,
    brandName: 'Square Pharmaceuticals',
  } as any,
];

export function RecommendedProducts({ isBn = true }: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await ProductService.getProducts({ limit: 8 });
        if (isMounted && res.products && res.products.length > 0) {
          setProducts(res.products);
        } else if (isMounted) {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        if (isMounted) setProducts(FALLBACK_PRODUCTS);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>{isBn ? 'আপনার জন্য প্রস্তাবিত' : 'Recommended For You'}</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            {isBn ? '১০০% অরিজিনাল' : '100% Genuine'}
          </span>
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

        {/* Scrollable Container with NO Scrollbar visible */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayList.map((product) => (
            <div key={product.id || product.slug} className="w-56 shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
