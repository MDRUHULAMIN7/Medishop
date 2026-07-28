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
  ChevronRight,
  FlaskConical,
  Smile,
  Leaf,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { CategorySkeleton } from './CategorySkeleton';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

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

export function CategorySidebar() {
  const { data: categories, isLoading } = useCategories();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (isLoading || !categories) {
    return (
      <aside className="hidden md:block w-[220px] lg:w-[240px] shrink-0 sticky top-24">
        <CategorySkeleton />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Category Navigation"
      className="hidden md:block w-[240px] lg:w-[270px] shrink-0 rounded-2xl border border-border bg-background p-3.5 shadow-xs sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      <div className="mb-3.5 px-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {isBn ? 'ক্যাটাগরি সমূহ' : 'Product Categories'}
        </h3>
      </div>

      <nav className="flex flex-col gap-1">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={cn(
              'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm lg:text-[15px] font-semibold text-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary'
            )}
          >
            <div className="flex items-center gap-2.5 lg:gap-3 truncate">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors shrink-0">
                {CATEGORY_ICONS[cat.iconName] || <Pill className="h-4.5 w-4.5 text-primary" />}
              </span>
              <span className="truncate">{isBn ? cat.nameBn : cat.nameEn}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
