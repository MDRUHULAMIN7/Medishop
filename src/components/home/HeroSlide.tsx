'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroSlide as HeroSlideType } from '@/types/home';
import { useAppSelector } from '@/store';

interface HeroSlideProps {
  slide: HeroSlideType;
  isActive: boolean;
}

export function HeroSlideItem({ slide, isActive }: HeroSlideProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (!isActive) return null;

  return (
    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <Image
        src={slide.image}
        alt={isBn ? slide.titleBn : slide.titleEn}
        fill
        priority
        className="object-cover object-center transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} flex flex-col justify-center p-6 sm:p-10 md:p-12`}
      >
        <div className="max-w-xl flex flex-col gap-2.5 sm:gap-3.5">
          {/* Badge */}
          {(slide.badgeBn || slide.badgeEn) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 w-fit rounded-full bg-accent/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isBn ? slide.badgeBn : slide.badgeEn}</span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-serif-title text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-white"
          >
            {isBn ? slide.titleBn : slide.titleEn}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed line-clamp-2"
          >
            {isBn ? slide.subtitleBn : slide.subtitleEn}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-2"
          >
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:gap-3 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{isBn ? slide.ctaTextBn : slide.ctaTextEn}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
