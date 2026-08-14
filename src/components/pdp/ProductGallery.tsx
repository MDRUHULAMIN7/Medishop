'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images?: string[];
  title: string;
}

export function ProductGallery({ images = [], title }: ProductGalleryProps) {
  const cleanImages =
    images.filter((img) => img && img.trim() !== '').length > 0
      ? images.filter((img) => img && img.trim() !== '')
      : [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
      ];

  const [selectedImage, setSelectedImage] = useState(cleanImages[0]);

  useEffect(() => {
    if (cleanImages.length > 0 && !cleanImages.includes(selectedImage)) {
      setSelectedImage(cleanImages[0]);
    }
  }, [cleanImages, selectedImage]);

  return (
    <div className="flex flex-col gap-3 w-full ">
      {/* Main Image View (Restored to clean original layout) */}
      <div className="relative w-full aspect-square max-h-[440px] rounded-3xl border border-border bg-muted/20 overflow-hidden shadow-xs">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          className="object-cover object-center transition-all duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>

      {/* Thumbnail Gallery Strip (Shows all available product images) */}
      <div className="flex items-center gap-2.5 overflow-x-auto  p-1 no-scrollbar">
        {cleanImages.map((img, idx) => {
          const isSelected = selectedImage === img;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={cn(
                'relative h-16 w-16 shrink-0 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer bg-background',
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm'
                  : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
