'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { useAppDispatch, useAppSelector } from '@/store';
import { addSearchHistory } from '@/store/slices/searchSlice';
import { SearchSuggestionItem } from './SearchSuggestionItem';
import { RecentSearches } from './RecentSearches';

interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SearchAutocomplete({
  query,
  isOpen,
  onClose,
}: SearchAutocompleteProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { data, isLoading } = useAutocomplete(query, 300);

  if (!isOpen) return null;

  const handleSelectProduct = () => {
    if (query.trim()) {
      dispatch(addSearchHistory(query.trim()));
    }
    onClose();
  };

  const handleSeeAll = () => {
    if (query.trim()) {
      dispatch(addSearchHistory(query.trim()));
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl ring-1 ring-black/5">
      {/* Show Recent Searches if query is empty */}
      {!query.trim() ? (
        <RecentSearches onSelect={onClose} />
      ) : (
        <div className="flex flex-col">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{isBn ? 'খুঁজছে...' : 'Searching products...'}</span>
            </div>
          )}

          {/* Product Suggestions List */}
          {data && data.suggestions.length > 0 && (
            <div className="p-2 flex flex-col">
              <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase">
                {isBn ? 'পণ্যসমূহ' : 'Matching Products'}
              </div>
              {data.suggestions.map((product) => (
                <SearchSuggestionItem
                  key={product.id}
                  product={product}
                  onClick={handleSelectProduct}
                />
              ))}
            </div>
          )}

          {/* Empty Suggestions */}
          {data && data.suggestions.length === 0 && !isLoading && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {isBn ? `"${query}" নামের কোনো পণ্য পাওয়া যায়নি` : `No matching products for "${query}"`}
            </div>
          )}

          {/* See All Results Footer Row */}
          {query.trim() && (
            <button
              type="button"
              onClick={handleSeeAll}
              className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <span>
                {isBn
                  ? `"${query}" এর সমস্ত ফলাফল দেখুন (${data?.totalMatches || 0})`
                  : `See all results for "${query}" (${data?.totalMatches || 0})`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
