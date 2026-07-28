'use client';

import React from 'react';
import { ShieldCheck, Award, Truck, Headphones } from 'lucide-react';
import { TrustBadge } from '@/types';
import { useAppSelector } from '@/store';

interface TrustBadgeCardProps {
  badge: TrustBadge;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />,
  Award: <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />,
  Truck: <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />,
  Headphones: <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />,
};

export function TrustBadgeCard({ badge }: TrustBadgeCardProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="group flex items-center sm:items-start gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-border/80 bg-background p-2.5 sm:p-4 shadow-2xs transition-all duration-200 hover:border-primary/50 hover:shadow-md">
      <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary">
        {ICON_MAP[badge.iconName] || <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />}
      </div>
      <div className="flex flex-col min-w-0">
        <h4 className="text-[11px] sm:text-sm font-bold text-foreground transition-colors group-hover:text-primary leading-tight truncate sm:whitespace-normal">
          {isBn ? badge.titleBn : badge.titleEn}
        </h4>
        <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground leading-tight truncate sm:whitespace-normal">
          {isBn ? badge.descriptionBn : badge.descriptionEn}
        </p>
      </div>
    </div>
  );
}
