import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/types';

export type MobileMenuMode = 'categories' | 'account';

interface UiState {
  isMobileMenuOpen: boolean;
  mobileMenuMode: MobileMenuMode;
  isMobileSearchOpen: boolean;
  isQuickContactOpen: boolean;
  isPrescriptionModalOpen: boolean;
  searchQuery: string;
  language: Language;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  mobileMenuMode: 'categories',
  isMobileSearchOpen: false,
  isQuickContactOpen: false,
  isPrescriptionModalOpen: false,
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
    setMobileMenuMode: (state, action: PayloadAction<MobileMenuMode>) => {
      state.mobileMenuMode = action.payload;
    },
    toggleMobileSearch: (state) => {
      state.isMobileSearchOpen = !state.isMobileSearchOpen;
    },
    setMobileSearch: (state, action: PayloadAction<boolean>) => {
      state.isMobileSearchOpen = action.payload;
    },
    toggleQuickContact: (state) => {
      state.isQuickContactOpen = !state.isQuickContactOpen;
    },
    setQuickContactOpen: (state, action: PayloadAction<boolean>) => {
      state.isQuickContactOpen = action.payload;
    },
    openPrescriptionModal: (state) => {
      state.isPrescriptionModalOpen = true;
    },
    closePrescriptionModal: (state) => {
      state.isPrescriptionModalOpen = false;
    },
    togglePrescriptionModal: (state) => {
      state.isPrescriptionModalOpen = !state.isPrescriptionModalOpen;
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
  setMobileMenuMode,
  toggleMobileSearch,
  setMobileSearch,
  toggleQuickContact,
  setQuickContactOpen,
  openPrescriptionModal,
  closePrescriptionModal,
  togglePrescriptionModal,
  setSearchQuery,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;
