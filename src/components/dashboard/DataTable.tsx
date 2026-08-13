'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';
import { useAppSelector } from '@/store';

export interface Column<T> {
  key: string;
  headerBn: string;
  headerEn: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholderBn?: string;
  searchPlaceholderEn?: string;
  // Server-side pagination props
  mode?: 'client' | 'server';
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (query: string) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  // Selection / Bulk Actions
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  bulkActions?: {
    labelBn: string;
    labelEn: string;
    action: (selectedIds: string[]) => void;
    variant?: 'default' | 'danger';
  }[];
  rowKey?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  searchPlaceholderBn = 'খুঁজুন...',
  searchPlaceholderEn = 'Search items...',
  mode = 'client',
  totalCount,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onSearchChange,
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  bulkActions = [],
  rowKey = (row) => row.id || row._id,
}: DataTableProps<T>) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [clientSearch, setClientSearch] = useState('');
  const [clientPage, setClientPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Handle client-side search, sort & pagination
  const filteredData = useMemo(() => {
    if (mode === 'server') return data;
    let result = [...data];

    if (clientSearch.trim()) {
      const q = clientSearch.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val && String(val).toLowerCase().includes(q)
        )
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, clientSearch, sortKey, sortDir, mode]);

  const activePage = mode === 'server' ? currentPage : clientPage;
  const activeTotal = mode === 'server' ? totalCount || data.length : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(activeTotal / pageSize));

  const pageData = useMemo(() => {
    if (mode === 'server') return data;
    const start = (clientPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, clientPage, pageSize, mode, data]);

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    if (onSortChange) onSortChange(key, newDir);
  };

  const handleSearch = (val: string) => {
    setClientSearch(val);
    setClientPage(1);
    if (onSearchChange) onSearchChange(val);
  };

  const isAllSelected = pageData.length > 0 && pageData.every((row) => selectedIds.includes(rowKey(row)));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Controls: Search Bar & Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={clientSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isBn ? searchPlaceholderBn : searchPlaceholderEn}
            className="h-10 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {selectedIds.length > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-primary">
              {selectedIds.length} {isBn ? 'টি সিলেক্ট করা হয়েছে' : 'selected'}
            </span>
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => action.action(selectedIds)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  action.variant === 'danger'
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {isBn ? action.labelBn : action.labelEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Table View */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                {selectable && (
                  <th className="py-3.5 px-4 w-10">
                    <button type="button" onClick={onSelectAll} className="cursor-pointer">
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.key} className="py-3.5 px-4">
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <span>{isBn ? col.headerBn : col.headerEn}</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      <span>{isBn ? col.headerBn : col.headerEn}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-xs text-muted-foreground">
                    {isBn ? 'ডাটা লোড হচ্ছে...' : 'Loading table data...'}
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-xs text-muted-foreground font-semibold">
                    {isBn ? 'কোনো ডাটা পাওয়া যায়নি' : 'No records found matching criteria'}
                  </td>
                </tr>
              ) : (
                pageData.map((row, rowIdx) => {
                  const id = rowKey(row);
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={id || rowIdx}
                      className={`hover:bg-muted/30 transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      {selectable && (
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => onSelectRow && onSelectRow(id)}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-primary" />
                            ) : (
                              <Square className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="py-3.5 px-4">
                          {col.render ? col.render(row) : row[col.key] ?? 'N/A'}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-muted/20 px-4 py-3 text-xs gap-3">
          <span className="text-muted-foreground font-medium">
            {isBn ? 'প্রদর্শিত হচ্ছে' : 'Showing'}{' '}
            <strong className="text-foreground">
              {activeTotal === 0 ? 0 : (activePage - 1) * pageSize + 1}
            </strong>{' '}
            -{' '}
            <strong className="text-foreground">
              {Math.min(activePage * pageSize, activeTotal)}
            </strong>{' '}
            {isBn ? 'মোট' : 'of'} <strong className="text-foreground">{activeTotal}</strong>{' '}
            {isBn ? 'টি এন্ট্রি' : 'entries'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activePage <= 1 || loading}
              onClick={() => {
                const p = activePage - 1;
                if (mode === 'server') onPageChange && onPageChange(p);
                else setClientPage(p);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-bold text-foreground">
              {activePage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={activePage >= totalPages || loading}
              onClick={() => {
                const p = activePage + 1;
                if (mode === 'server') onPageChange && onPageChange(p);
                else setClientPage(p);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
