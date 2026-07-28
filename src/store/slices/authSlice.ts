import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthModalView } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  pendingPhone?: string;
  pendingEmail?: string;
  otpCountdown: number;
  persistFormState: {
    signinIdentifier?: string;
    signupName?: string;
    signupEmail?: string;
    signupPhone?: string;
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthModalOpen: false,
  authModalView: 'signin',
  pendingPhone: undefined,
  pendingEmail: undefined,
  otpCountdown: 60,
  persistFormState: {},
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
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPendingIdentifier: (
      state,
      action: PayloadAction<{ phone?: string; email?: string }>
    ) => {
      if (action.payload.phone) state.pendingPhone = action.payload.phone;
      if (action.payload.email) state.pendingEmail = action.payload.email;
    },
    setOtpCountdown: (state, action: PayloadAction<number>) => {
      state.otpCountdown = action.payload;
    },
    decrementOtpCountdown: (state) => {
      if (state.otpCountdown > 0) {
        state.otpCountdown -= 1;
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isAuthModalOpen = false;
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;
    },
    updatePersistFormState: (
      state,
      action: PayloadAction<Partial<AuthState['persistFormState']>>
    ) => {
      state.persistFormState = {
        ...state.persistFormState,
        ...action.payload,
      };
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
  setAuthLoading,
  setPendingIdentifier,
  setOtpCountdown,
  decrementOtpCountdown,
  setUser,
  logout,
  updatePersistFormState,
} = authSlice.actions;

export default authSlice.reducer;
