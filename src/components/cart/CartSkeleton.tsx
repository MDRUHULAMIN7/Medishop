'use client';

import React from 'react';

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
      {/* Left Column: Cart Items Skeleton */}
      <div className="lg:col-span-8 space-y-4">
        {/* Free Delivery Bar Skeleton */}
        <div className="h-16 w-full rounded-2xl bg-muted/60 animate-pulse" />

        {/* List Skeleton */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-background rounded-2xl border border-border animate-pulse"
          >
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="h-20 w-20 rounded-xl bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 rounded-md bg-muted" />
                <div className="h-4 w-3/4 rounded-md bg-muted" />
                <div className="h-3 w-16 rounded-md bg-muted" />
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="h-9 w-28 rounded-xl bg-muted" />
              <div className="h-5 w-16 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Order Summary Skeleton */}
      <div className="lg:col-span-4 space-y-4">
        <div className="h-96 w-full rounded-2xl bg-muted/60 animate-pulse" />
      </div>
    </div>
  );
}
