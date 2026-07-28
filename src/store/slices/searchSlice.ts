import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchHistoryItem } from '@/types/search';

interface SearchState {
  history: SearchHistoryItem[];
}

const initialState: SearchState = {
  history: [
    { id: '1', query: 'Napa Extra', timestamp: Date.now() },
    { id: '2', query: 'Sergel 20', timestamp: Date.now() - 1000 },
    { id: '3', query: 'Cef-3', timestamp: Date.now() - 2000 },
  ],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const q = action.payload.trim();
      if (!q) return;

      // Remove existing duplicate
      state.history = state.history.filter(
        (item) => item.query.toLowerCase() !== q.toLowerCase()
      );

      // Add to front
      state.history.unshift({
        id: Date.now().toString(),
        query: q,
        timestamp: Date.now(),
      });

      // Keep last 5
      if (state.history.length > 5) {
        state.history = state.history.slice(0, 5);
      }
    },
    clearSearchHistory: (state) => {
      state.history = [];
    },
    removeSearchItem: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addSearchHistory, clearSearchHistory, removeSearchItem } =
  searchSlice.actions;

export default searchSlice.reducer;
