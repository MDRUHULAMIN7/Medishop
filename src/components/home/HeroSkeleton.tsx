import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[190px] xs:h-[220px] sm:h-[300px] md:h-[380px] rounded-2xl bg-muted overflow-hidden animate-pulse">
      <div className="absolute inset-0 p-4 sm:p-10 flex flex-col justify-center max-w-xl gap-3">
        <div className="h-4 w-28 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="h-6 sm:h-10 w-full rounded-lg bg-slate-300 dark:bg-slate-700" />
        <div className="h-3.5 w-3/4 rounded-md bg-slate-300 dark:bg-slate-700" />
        <div className="h-8 w-32 rounded-xl bg-slate-300 dark:bg-slate-700 mt-1" />
      </div>
    </div>
  );
}
