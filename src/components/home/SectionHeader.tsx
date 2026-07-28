'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store';

interface SectionHeaderProps {
  titleBn: string;
  titleEn: string;
  subtitleBn?: string;
  subtitleEn?: string;
  viewAllLink: string;
  icon?: React.ReactNode;
}

export function SectionHeader({
  titleBn,
  titleEn,
  subtitleBn,
  subtitleEn,
  viewAllLink,
  icon,
}: SectionHeaderProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="flex items-end justify-between border-b border-border/60 pb-3 mb-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h2 className="font-serif-title text-base sm:text-xl font-bold tracking-tight text-foreground">
            {isBn ? titleBn : titleEn}
          </h2>
        </div>
        {(subtitleBn || subtitleEn) && (
          <p className="text-xs text-muted-foreground">
            {isBn ? subtitleBn : subtitleEn}
          </p>
        )}
      </div>

      <Link
        href={viewAllLink}
        className="group flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary-dark hover:underline"
      >
        <span>{isBn ? 'সবগুলো দেখুন' : 'See All'}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
