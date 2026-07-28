import { Product } from '@/types/home';

export interface AutocompleteResult {
  query: string;
  suggestions: Product[];
  totalMatches: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}
