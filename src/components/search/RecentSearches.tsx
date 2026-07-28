'use client';

import React from 'react';
import { History, X, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearSearchHistory, removeSearchItem } from '@/store/slices/searchSlice';
import { setSearchQuery } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';

interface RecentSearchesProps {
  onSelect: () => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const history = useAppSelector((state) => state.search.history);
  const language = useAppSelector((state) => state.ui.language);

  const isBn = language === 'bn';

  if (!history || history.length === 0) return null;

  const handleSelectQuery = (query: string) => {
    dispatch(setSearchQuery(query));
    onSelect();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-background border-b border-border">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
          <History className="h-3.5 w-3.5" />
          {isBn ? 'সাম্প্রতিক অনুসন্ধানসমূহ' : 'Recent Searches'}
        </span>
        <button
          type="button"
          onClick={() => dispatch(clearSearchHistory())}
          className="flex items-center gap-1 text-[11px] font-semibold text-danger hover:underline"
        >
          <Trash2 className="h-3 w-3" />
          <span>{isBn ? 'মুছে ফেলুন' : 'Clear All'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground hover:border-primary"
          >
            <button
              type="button"
              onClick={() => handleSelectQuery(item.query)}
              className="hover:text-primary truncate max-w-[140px]"
            >
              {item.query}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeSearchItem(item.id));
              }}
              className="text-muted-foreground hover:text-danger rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
