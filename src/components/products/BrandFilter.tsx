'use client';

import React, { useState, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';
import { Brand as BrandType } from '@/types/product';
import { BrandService, Brand as ApiBrand } from '@/services/brand.service';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

interface BrandFilterProps {
  brands: BrandType[];
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({
  brands,
  selectedBrands,
  onChange,
}: BrandFilterProps) {
  const [search, setSearch] = useState('');
  const [allBrands, setAllBrands] = useState<Array<{ id: string; name: string; count?: number }>>([]);
  const [loading, setLoading] = useState(false);

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  useEffect(() => {
    if (brands && brands.length > 0) {
      setAllBrands(brands.map((b) => ({ id: b.id, name: b.name, count: b.productCount })));
    } else {
      async function loadBrands() {
        setLoading(true);
        try {
          const list = await BrandService.getAllBrands(false);
          setAllBrands(list.map((b) => ({ id: b.id, name: b.name })));
        } catch (err) {
          console.error('Failed to load brands:', err);
        } finally {
          setLoading(false);
        }
      }
      loadBrands();
    }
  }, [brands]);

  const filtered = allBrands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBrand = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      onChange(selectedBrands.filter((b) => b !== brandName));
    } else {
      onChange([...selectedBrands, brandName]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{isBn ? 'ফার্মাসিউটিক্যাল ব্র্যান্ড' : 'Pharma Brands'}</span>
        </h4>
        {selectedBrands.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {selectedBrands.length}
          </span>
        )}
      </div>

      {/* Searchable Brand Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? 'ব্র্যান্ড খুঁজুন...' : 'Search brands...'}
          className="w-full rounded-xl border border-border bg-muted/20 py-1.5 pl-8 pr-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
        />
      </div>

      {/* Checkbox List */}
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 no-scrollbar">
        {loading ? (
          <div className="py-3 text-center text-xs text-muted-foreground">
            {isBn ? 'ব্র্যান্ড লোড হচ্ছে...' : 'Loading brands...'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-2 text-center text-xs text-muted-foreground">
            {isBn ? 'কোনো ব্র্যান্ড পাওয়া যায়নি' : 'No brands found'}
          </div>
        ) : (
          filtered.map((b) => {
            const isChecked = selectedBrands.includes(b.name);
            return (
              <label
                key={b.id}
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
                    onChange={() => toggleBrand(b.name)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 shrink-0"
                  />
                  <span className="truncate">{b.name}</span>
                </div>
                {typeof b.count === 'number' && (
                  <span className="text-[10px] text-muted-foreground font-normal shrink-0 ml-1">
                    ({b.count})
                  </span>
                )}
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
