'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: ProductPaginationProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (totalCount <= 0) return null;

  const startItem = Math.max(1, (currentPage - 1) * limit + 1);
  const endItem = Math.min(currentPage * limit, totalCount);

  // Generate page numbers range
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;
    const total = Math.max(1, totalPages);

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < total)
      ) {
        pages.push('...');
      }
    }
    return pages.filter((item, index, self) => self.indexOf(item) === index);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-background p-4 shadow-2xs w-full mt-8">
      {/* Range Info */}
      <div className="text-xs text-muted-foreground font-semibold text-center sm:text-left">
        {isBn
          ? `মোট ${totalCount} টি পণ্যের মধ্যে ${startItem} - ${endItem} টি দেখানো হচ্ছে`
          : `Showing ${startItem}–${endItem} of ${totalCount} medicines`}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label={isBn ? 'পূর্ববর্তী পৃষ্ঠা' : 'Previous page'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((num, idx) => {
            if (typeof num === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs font-bold text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = num === currentPage;
            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  onPageChange(num);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  'flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-extrabold transition-all cursor-pointer',
                  isActive
                    ? 'bg-primary text-white shadow-xs scale-105'
                    : 'border border-border bg-background text-foreground hover:bg-muted hover:border-primary/50'
                )}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={currentPage >= Math.max(1, totalPages)}
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label={isBn ? 'পরবর্তী পৃষ্ঠা' : 'Next page'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
