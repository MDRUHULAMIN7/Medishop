'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ShieldPlus,
  Heart,
  Baby,
  Apple,
  Sparkles,
  ShieldCheck,
  Pill,
  Stethoscope,
  FlaskConical,
  Smile,
  Leaf,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useAppSelector } from '@/store';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Activity: <Activity className="h-4 w-4 text-primary" />,
  ShieldPlus: <ShieldPlus className="h-4 w-4 text-primary" />,
  Heart: <Heart className="h-4 w-4 text-primary" />,
  Baby: <Baby className="h-4 w-4 text-primary" />,
  Apple: <Apple className="h-4 w-4 text-primary" />,
  Sparkles: <Sparkles className="h-4 w-4 text-primary" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4 text-primary" />,
  Pill: <Pill className="h-4 w-4 text-primary" />,
  Stethoscope: <Stethoscope className="h-4 w-4 text-primary" />,
  FlaskConical: <FlaskConical className="h-4 w-4 text-primary" />,
  Smile: <Smile className="h-4 w-4 text-primary" />,
  Leaf: <Leaf className="h-4 w-4 text-primary" />,
};

export function CategoryChips() {
  const { data: categories, isLoading } = useCategories();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (isLoading || !categories) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 lg:hidden no-scrollbar">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-28 shrink-0 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="lg:hidden w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isBn ? 'ক্যাটাগরি সমূহ' : 'Product Categories'}
        </h3>
        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline"
        >
          {isBn ? 'সবগুলো দেখুন' : 'See All'}
        </Link>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs transition-transform active:scale-95 hover:border-primary hover:bg-primary/5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              {CATEGORY_ICONS[cat.iconName] || <Pill className="h-3.5 w-3.5 text-primary" />}
            </span>
            <span className="whitespace-nowrap">{isBn ? cat.nameBn : cat.nameEn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
