'use client';

import React, { useState, useEffect } from 'react';
import { Search, FolderTree } from 'lucide-react';
import { CategoryService, Category } from '@/services/category.service';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export function CategoryFilter({ selectedCategories, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const list = await CategoryService.getAllCategories(false);
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories for filter:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nameBn && c.nameBn.toLowerCase().includes(search.toLowerCase())) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleCategory = (slugOrName: string) => {
    if (selectedCategories.includes(slugOrName)) {
      onChange(selectedCategories.filter((c) => c !== slugOrName));
    } else {
      onChange([...selectedCategories, slugOrName]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <FolderTree className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{isBn ? 'ক্যাটাগরি নির্ধারণ' : 'Categories'}</span>
        </h4>
        {selectedCategories.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {selectedCategories.length}
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? 'ক্যাটাগরি খুঁজুন...' : 'Search categories...'}
          className="w-full rounded-xl border border-border bg-muted/20 py-1.5 pl-8 pr-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
        />
      </div>

      {/* Category Checkbox List */}
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 no-scrollbar">
        {loading ? (
          <div className="py-3 text-center text-xs text-muted-foreground">
            {isBn ? 'ক্যাটাগরি লোড হচ্ছে...' : 'Loading categories...'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-2 text-center text-xs text-muted-foreground">
            {isBn ? 'কোনো ক্যাটাগরি পাওয়া যায়নি' : 'No categories found'}
          </div>
        ) : (
          filtered.map((cat) => {
            const val = cat.slug || cat.name;
            const isChecked = selectedCategories.includes(val) || selectedCategories.includes(cat.name);
            return (
              <label
                key={cat.id}
                className={cn(
                  'flex items-center justify-between text-xs cursor-pointer select-none py-1.5 px-2 rounded-xl transition-all',
                  isChecked
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground hover:bg-muted/50 font-semibold'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(val)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 shrink-0"
                  />
                  <span className="truncate">{isBn ? cat.nameBn || cat.name : cat.nameEn || cat.name}</span>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
