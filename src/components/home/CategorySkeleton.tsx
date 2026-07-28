import React from 'react';

export function CategorySkeleton() {
  return (
    <div className="w-full flex flex-col gap-2.5 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/60"
        >
          <div className="h-5 w-5 rounded-md bg-slate-300 dark:bg-slate-700 shrink-0" />
          <div className="h-4 flex-1 rounded-md bg-slate-300 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
