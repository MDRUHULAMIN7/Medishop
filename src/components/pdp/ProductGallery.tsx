'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
  );

  const galleryImages =
    images.length > 0
      ? images
      : [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=800&auto=format&fit=crop',
        ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main Image View */}
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

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={cn(
              'relative h-16 w-16 shrink-0 rounded-2xl border-2 overflow-hidden transition-all',
              selectedImage === img
                ? 'border-primary ring-2 ring-primary/20 scale-105'
                : 'border-border/80 opacity-70 hover:opacity-100'
            )}
          >
            <Image
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
