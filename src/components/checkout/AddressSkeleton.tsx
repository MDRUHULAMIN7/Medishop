'use client';

import React from 'react';

export function AddressSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-36 w-full rounded-2xl border border-border bg-muted/40 animate-pulse p-4 space-y-3"
        >
          <div className="flex justify-between">
            <div className="h-5 w-20 rounded-md bg-muted" />
            <div className="h-5 w-5 rounded-full bg-muted" />
          </div>
          <div className="h-4 w-32 rounded-md bg-muted" />
          <div className="h-3 w-48 rounded-md bg-muted" />
        </div>
      ))}
    </div>
  );
}
