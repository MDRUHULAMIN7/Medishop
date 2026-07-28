import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthModalView } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  authModalView: 'signin',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthModalView | undefined>) => {
      state.isAuthModalOpen = true;
      if (action.payload) {
        state.authModalView = action.payload;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalView: (state, action: PayloadAction<AuthModalView>) => {
      state.authModalView = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthModalOpen = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
  setUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
