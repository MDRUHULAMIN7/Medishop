'use client';

import React from 'react';

export function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Bar Skeleton */}
      <div className="h-12 w-full rounded-2xl bg-muted/60 animate-pulse" />

      {/* List Item Skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-background p-5 animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded-md bg-muted" />
              <div className="h-3 w-24 rounded-md bg-muted" />
            </div>
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 rounded-md bg-muted" />
              <div className="h-3 w-32 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
