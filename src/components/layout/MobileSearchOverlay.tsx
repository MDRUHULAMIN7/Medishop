'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, History, Loader2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMobileSearch, setSearchQuery } from '@/store/slices/uiSlice';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { SearchSuggestionItem } from '../search/SearchSuggestionItem';
import { addSearchHistory } from '@/store/slices/searchSlice';

export function MobileSearchOverlay() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isOpen = useAppSelector((state) => state.ui.isMobileSearchOpen);
  const query = useAppSelector((state) => state.ui.searchQuery);
  const language = useAppSelector((state) => state.ui.language);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';
  const { data, isLoading } = useAutocomplete(query, 250);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleClose = () => dispatch(setMobileSearch(false));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(addSearchHistory(query.trim()));
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = () => {
    if (query.trim()) {
      dispatch(addSearchHistory(query.trim()));
    }
    handleClose();
  };

  const POPULAR_SEARCHES = [
    { bn: 'নাপা এক্সট্রা (Napa Extra)', en: 'Napa Extra' },
    { bn: 'সেফ-৩ (Cef-3)', en: 'Cef-3' },
    { bn: 'সার্জেল ২০ (Sergel 20)', en: 'Sergel 20' },
    { bn: 'ফ্লেক্সি (Flexi)', en: 'Flexi 50' },
    { bn: 'ইনসুলিন (Insulin)', en: 'Insulin' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-50 md:hidden flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-14 sm:top-16 bg-black/50 backdrop-blur-xs"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Full-width Search Drawer */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? 'অনুসন্ধান করুন' : 'Search Medicines'}
            className="relative z-10 w-full border-b border-border bg-background shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex h-14 items-center gap-2 border-b border-border px-3 bg-background">
              <button
                type="button"
                onClick={handleClose}
                aria-label={isBn ? 'ফিরে যান' : 'Close search'}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted cursor-pointer shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative flex flex-1 items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  placeholder={isBn ? 'ওষুধ বা স্বাস্থ্য সামগ্রী খুঁজুন...' : 'Search medicines or health products...'}
                  className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-9 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => dispatch(setSearchQuery(''))}
                    aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                    className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Results / Suggestions Container */}
            <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
              {/* If query has text, show real-time search results */}
              {query.trim() ? (
                <div className="flex flex-col">
                  {isLoading && (
                    <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>{isBn ? 'খুঁজছে...' : 'Searching products...'}</span>
                    </div>
                  )}

                  {data && data.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-1 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {isBn ? 'পণ্যসমূহ' : 'Matching Products'}
                      </div>
                      {data.suggestions.map((product) => (
                        <SearchSuggestionItem
                          key={product.id}
                          product={product}
                          onClick={handleSelectProduct}
                        />
                      ))}

                      {/* See all results button */}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="mt-2 flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <span>
                          {isBn
                            ? `"${query}" এর সব ফলাফল দেখুন (${data.totalMatches || 0})`
                            : `See all results for "${query}" (${data.totalMatches || 0})`}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {data && data.suggestions.length === 0 && !isLoading && (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      {isBn ? `"${query}" নামের কোনো ওষুধ বা পণ্য পাওয়া যায়নি` : `No products found matching "${query}"`}
                    </div>
                  )}
                </div>
              ) : (
                /* Popular Searches */
                <div>
                  <h4 className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <History className="h-3.5 w-3.5" />
                    {isBn ? 'জনপ্রিয় অনুসন্ধানসমূহ' : 'Popular Searches'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const term = isBn ? item.bn.split(' ')[0] : item.en;
                          dispatch(setSearchQuery(term));
                          dispatch(addSearchHistory(term));
                          handleClose();
                          router.push(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        {isBn ? item.bn : item.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
