'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchService } from '@/services/search.service';

export function useAutocomplete(query: string, debounceMs: number = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => SearchService.autocomplete(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 60 * 1000,
  });
}
