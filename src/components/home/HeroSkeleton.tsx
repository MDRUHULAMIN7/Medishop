import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] rounded-2xl bg-muted overflow-hidden animate-pulse">
      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl gap-4">
        <div className="h-5 w-36 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="h-8 sm:h-10 w-full rounded-lg bg-slate-300 dark:bg-slate-700" />
        <div className="h-4 w-3/4 rounded-md bg-slate-300 dark:bg-slate-700" />
        <div className="h-10 w-40 rounded-xl bg-slate-300 dark:bg-slate-700 mt-2" />
      </div>
    </div>
  );
}
