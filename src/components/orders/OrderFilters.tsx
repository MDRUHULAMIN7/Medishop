'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { OrderFilterState, OrderStatus } from '@/types/order';

interface OrderFiltersProps {
  filters: OrderFilterState;
  onUpdateFilters: (newFilters: Partial<OrderFilterState>) => void;
  isBn?: boolean;
}

export function OrderFilters({
  filters,
  onUpdateFilters,
  isBn = true,
}: OrderFiltersProps) {
  const statusTabs: { id: OrderStatus | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Orders', labelBn: 'সকল অর্ডার' },
    { id: 'placed', labelEn: 'Processing', labelBn: 'প্রসেসিং' },
    { id: 'shipped', labelEn: 'In Transit', labelBn: 'ডেলিভারির পথে' },
    { id: 'delivered', labelEn: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন' },
    { id: 'cancelled', labelEn: 'Cancelled', labelBn: 'বাতিলকৃত' },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder={isBn ? 'অর্ডার নম্বর বা ওষুধের নাম দিয়ে খুঁজুন...' : 'Search by order number or product name...'}
            className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onUpdateFilters({
                sortBy: e.target.value as OrderFilterState['sortBy'],
              })
            }
            className="rounded-2xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-xs w-full sm:w-auto"
          >
            <option value="newest">{isBn ? 'সর্বশেষ অর্ডার' : 'Newest First'}</option>
            <option value="oldest">{isBn ? 'পুরাতন অর্ডার' : 'Oldest First'}</option>
            <option value="amount_high">{isBn ? 'সর্বোচ্চ মূল্য' : 'Amount: High to Low'}</option>
            <option value="amount_low">{isBn ? 'সর্বনিম্ন মূল্য' : 'Amount: Low to High'}</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = filters.statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onUpdateFilters({ statusFilter: tab.id })}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {isBn ? tab.labelBn : tab.labelEn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
