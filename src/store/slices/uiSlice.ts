import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/types';

interface UiState {
  isMobileMenuOpen: boolean;
  isMobileSearchOpen: boolean;
  searchQuery: string;
  language: Language;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  isMobileSearchOpen: false,
  searchQuery: '',
  language: 'bn',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenu: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleMobileSearch: (state) => {
      state.isMobileSearchOpen = !state.isMobileSearchOpen;
    },
    setMobileSearch: (state, action: PayloadAction<boolean>) => {
      state.isMobileSearchOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenu,
  toggleMobileSearch,
  setMobileSearch,
  setSearchQuery,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;
