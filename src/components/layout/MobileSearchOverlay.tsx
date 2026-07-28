'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, History } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMobileSearch, setSearchQuery } from '@/store/slices/uiSlice';

export function MobileSearchOverlay() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isOpen = useAppSelector((state) => state.ui.isMobileSearchOpen);
  const query = useAppSelector((state) => state.ui.searchQuery);
  const language = useAppSelector((state) => state.ui.language);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => dispatch(setMobileSearch(false));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const POPULAR_SEARCHES = [
    { bn: 'নাপা এক্সট্রা (Napa Extra)', en: 'Napa Extra' },
    { bn: 'সেফ-৩ (Cef-3)', en: 'Cef-3' },
    { bn: 'সার্জেল ২০ (Sergel 20)', en: 'Sergel 20' },
    { bn: 'ফ্লেক্সো (Flexi)', en: 'Flexi 50' },
    { bn: 'ইনসুলিন (Insulin)', en: 'Insulin' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? 'অনুসন্ধান করুন' : 'Search Medicines'}
          className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
        >
          {/* Top Search Bar Header */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-3">
            <button
              onClick={handleClose}
              aria-label={isBn ? 'ফিরে যান' : 'Go back'}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="relative flex flex-1 items-center"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder={
                  isBn
                    ? 'ওষুধ বা স্বাস্থ্য সামগ্রী খুঁজুন...'
                    : 'Search medicines or health products...'
                }
                className="w-full rounded-full border border-border bg-muted/50 py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Search Content / Popular Suggestions */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <History className="h-3.5 w-3.5" />
                {isBn ? 'জনপ্রিয় অনুসন্ধানসমূহ' : 'Popular Searches'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      dispatch(setSearchQuery(isBn ? item.bn : item.en));
                      handleClose();
                      router.push(
                        `/search?q=${encodeURIComponent(
                          isBn ? item.bn : item.en
                        )}`
                      );
                    }}
                    className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:bg-primary/5"
                  >
                    {isBn ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
