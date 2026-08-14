'use client';

import React from 'react';
import { History, X, Trash2, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearSearchHistory, removeSearchItem } from '@/store/slices/searchSlice';
import { setSearchQuery } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

interface RecentSearchesProps {
  onSelect: () => void;
}

const POPULAR_SEARCHES = ['Napa Extra', 'Sergel 20', 'Ace 500mg', 'Seclo 20', 'Maxpro 20', 'Ceevit'];

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const history = useAppSelector((state) => state.search.history);
  const language = useAppSelector((state) => state.ui.language);

  const isBn = language === 'bn';

  const handleSelectQuery = (query: string) => {
    dispatch(setSearchQuery(query));
    onSelect();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 bg-background border-b border-border">
      {/* Recent Searches */}
      {history && history.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              <History className="h-3.5 w-3.5 text-primary" />
              {isBn ? 'সাম্প্রতিক অনুসন্ধান' : 'Recent Searches'}
            </span>
            <button
              type="button"
              onClick={() => dispatch(clearSearchHistory())}
              className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>{isBn ? 'সব মুছে ফেলুন' : 'Clear All'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground hover:border-primary transition-all"
              >
                <button
                  type="button"
                  onClick={() => handleSelectQuery(item.query)}
                  className="hover:text-primary truncate max-w-[140px] cursor-pointer"
                >
                  {item.query}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeSearchItem(item.id));
                  }}
                  className="text-muted-foreground hover:text-rose-600 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
          <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
          {isBn ? 'জনপ্রিয় ওষুধসমূহ' : 'Popular Searches'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectQuery(term)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
