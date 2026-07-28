'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { HeroSlideItem } from './HeroSlide';
import { HeroSkeleton } from './HeroSkeleton';
import { HERO_SLIDER_AUTOPLAY_INTERVAL } from '@/lib/constants';

export function HeroSlider() {
  const { data: slides, isLoading } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slideCount = slides?.length || 0;

  const nextSlide = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Autoplay Effect
  useEffect(() => {
    if (isPaused || slideCount === 0) return;
    const interval = setInterval(nextSlide, HERO_SLIDER_AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slideCount]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) nextSlide(); // Swiped Left
    if (diffX < -50) prevSlide(); // Swiped Right

    touchStartX.current = null;
    setIsPaused(false);
  };

  if (isLoading || !slides) {
    return <HeroSkeleton />;
  }

  return (
    <div
      role="region"
      aria-label="Hero Banner Carousel"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      className="relative w-full rounded-2xl overflow-hidden focus-visible:ring-2 focus-visible:ring-primary outline-hidden"
    >
      <AnimatePresence mode="wait">
        {slides.map((slide, idx) => (
          <HeroSlideItem key={slide.id} slide={slide} isActive={idx === currentIndex} />
        ))}
      </AnimatePresence>

      {/* Pagination Dot Indicators (Side arrow buttons removed as requested) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/30 px-3.5 py-1.5 backdrop-blur-md">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-7 bg-primary'
                : 'w-2 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
