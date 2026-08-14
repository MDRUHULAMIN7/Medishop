'use client';

import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';
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
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={filters.searchQuery}
          onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
          placeholder={
            isBn
              ? 'অর্ডার নম্বর বা ওষুধের নাম দিয়ে খুঁজুন...'
              : 'Search by order number or medicine name...'
          }
          className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden shadow-2xs"
        />
      </div>

      {/* Select Dropdown Filters Container */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Status Filter Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onUpdateFilters({ statusFilter: e.target.value as any })
            }
            className="h-10 w-full sm:w-auto rounded-2xl border border-border bg-background px-3.5 text-xs font-extrabold text-foreground focus:border-primary focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">{isBn ? 'সকল অর্ডার স্ট্যাটাস' : 'All Order Statuses'}</option>
            <option value="pending">{isBn ? 'পেন্ডিং (Pending)' : 'Pending'}</option>
            <option value="placed">{isBn ? 'প্রসেসিং (Processing)' : 'Processing'}</option>
            <option value="shipped">{isBn ? 'কুরিয়ারে (In Transit)' : 'In Transit'}</option>
            <option value="delivered">{isBn ? 'ডেলিভারি সম্পন্ন (Delivered)' : 'Delivered'}</option>
            <option value="cancelled">{isBn ? 'বাতিলকৃত (Cancelled)' : 'Cancelled'}</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onUpdateFilters({
                sortBy: e.target.value as OrderFilterState['sortBy'],
              })
            }
            className="h-10 w-full sm:w-auto rounded-2xl border border-border bg-background px-3.5 text-xs font-extrabold text-foreground focus:border-primary focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="newest">{isBn ? 'সর্বশেষ অর্ডার' : 'Newest First'}</option>
            <option value="oldest">{isBn ? 'পুরাতন অর্ডার' : 'Oldest First'}</option>
            <option value="amount_high">{isBn ? 'সর্বোচ্চ মূল্য' : 'Amount: High to Low'}</option>
            <option value="amount_low">{isBn ? 'সর্বনিম্ন মূল্য' : 'Amount: Low to High'}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
