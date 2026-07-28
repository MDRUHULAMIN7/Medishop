'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Brand } from '@/types/product';
import { useAppSelector } from '@/store';

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({
  brands,
  selectedBrands,
  onChange,
}: BrandFilterProps) {
  const [search, setSearch] = useState('');
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const filtered = brands.filter((b) =>
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
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {isBn ? 'ব্র্যান্ডসমূহ' : 'Brands'}
      </h4>

      {/* Searchable Brand Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? 'ব্র্যান্ড খুঁজুন...' : 'Search brands...'}
          className="w-full rounded-xl border border-border bg-muted/20 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
        />
      </div>

      {/* Checkbox List */}
      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
        {filtered.map((b) => (
          <label
            key={b.id}
            className="flex items-center justify-between text-xs cursor-pointer select-none py-1 px-1 rounded-lg hover:bg-muted/40"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.name)}
                onChange={() => toggleBrand(b.name)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-medium text-foreground">{b.name}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              ({b.productCount})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
