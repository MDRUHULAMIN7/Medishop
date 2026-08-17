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
    <div className="relative w-full h-[190px] xs:h-[220px] sm:h-[300px] md:h-[380px] rounded-2xl overflow-hidden shadow-md">
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
        className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} flex flex-col justify-center p-4 xs:p-5 sm:p-8 md:p-12`}
      >
        <div className="max-w-xl flex flex-col gap-1.5 sm:gap-3.5">
          {/* Badge */}
          {(slide.badgeBn || slide.badgeEn) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center w-fit rounded-full bg-accent px-3 py-0.5 text-[10px] sm:text-xs font-black text-slate-900 shadow-2xs"
            >
              <span>{isBn ? slide.badgeBn : slide.badgeEn}</span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-serif-title text-base xs:text-xl sm:text-3xl md:text-4xl font-bold leading-snug text-white"
          >
            {isBn ? slide.titleBn : slide.titleEn}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[11px] sm:text-sm md:text-base text-white/90 leading-relaxed line-clamp-1 sm:line-clamp-2"
          >
            {isBn ? slide.subtitleBn : slide.subtitleEn}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-1 sm:mt-2"
          >
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-primary px-3.5 py-1.5 sm:px-5 sm:py-3 text-[11px] sm:text-xs md:text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:gap-3 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{isBn ? slide.ctaTextBn : slide.ctaTextEn}</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
