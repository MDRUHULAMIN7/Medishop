import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background p-3 animate-pulse shadow-xs">
      <div className="relative w-full aspect-square rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="mt-2 h-9 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
