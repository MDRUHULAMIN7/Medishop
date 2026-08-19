import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthModalView } from '@/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  pendingIdentifier: string;
  pendingPhone?: string;
  pendingEmail?: string;
  verificationToken: string | null;
  flowContext: 'registration' | 'reset';
  registeredName?: string;
  registeredPassword?: string;
  otpCountdown: number;
  serverError: string | null;
  fieldErrors: Record<string, string>;
  persistFormState: {
    signinIdentifier?: string;
    signupName?: string;
    signupEmail?: string;
    signupPhone?: string;
  };
}

const normalizeView = (view?: AuthModalView): AuthModalView => {
  if (!view) return 'identifier';
  if (view === 'signin' || view === 'signup' || view === 'forgot') return 'identifier';
  if (view === 'otp') return 'verify_otp';
  return view;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  isAuthModalOpen: false,
  authModalView: 'identifier',
  pendingIdentifier: '',
  pendingPhone: undefined,
  pendingEmail: undefined,
  verificationToken: null,
  flowContext: 'registration',
  registeredName: undefined,
  registeredPassword: undefined,
  otpCountdown: 60,
  serverError: null,
  fieldErrors: {},
  persistFormState: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    openAuthModal: (state, action: PayloadAction<AuthModalView | undefined>) => {
      state.isAuthModalOpen = true;
      state.authModalView = normalizeView(action.payload);
      state.serverError = null;
      state.fieldErrors = {};
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.serverError = null;
      state.fieldErrors = {};
    },
    setAuthModalView: (state, action: PayloadAction<AuthModalView>) => {
      state.authModalView = normalizeView(action.payload);
      state.serverError = null;
      state.fieldErrors = {};
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPendingIdentifier: (
      state,
      action: PayloadAction<{ identifier?: string; phone?: string; email?: string }>
    ) => {
      if (action.payload.identifier) state.pendingIdentifier = action.payload.identifier;
      if (action.payload.phone) state.pendingPhone = action.payload.phone;
      if (action.payload.email) state.pendingEmail = action.payload.email;
    },
    setVerificationToken: (
      state,
      action: PayloadAction<{ token: string | null; flowContext?: 'registration' | 'reset' }>
    ) => {
      state.verificationToken = action.payload.token;
      if (action.payload.flowContext) {
        state.flowContext = action.payload.flowContext;
      }
    },
    setRegistrationDetails: (
      state,
      action: PayloadAction<{ name?: string; password?: string }>
    ) => {
      if (action.payload.name !== undefined) state.registeredName = action.payload.name;
      if (action.payload.password !== undefined) state.registeredPassword = action.payload.password;
    },
    setOtpCountdown: (state, action: PayloadAction<number>) => {
      state.otpCountdown = action.payload;
    },
    decrementOtpCountdown: (state) => {
      if (state.otpCountdown > 0) {
        state.otpCountdown -= 1;
      }
    },
    setServerError: (
      state,
      action: PayloadAction<{ error: string | null; fieldErrors?: Record<string, string> }>
    ) => {
      state.serverError = action.payload.error;
      state.fieldErrors = action.payload.fieldErrors || {};
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isLoading = false;
      state.isAuthModalOpen = false;
      state.pendingIdentifier = '';
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;
      state.verificationToken = null;
      state.registeredName = undefined;
      state.registeredPassword = undefined;
      state.serverError = null;
      state.fieldErrors = {};
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.isLoading = false;
      state.pendingIdentifier = '';
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;
      state.verificationToken = null;
      state.serverError = null;
      state.fieldErrors = {};
      state.isAuthModalOpen = false;
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
  setInitialized,
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
  setAuthLoading,
  setPendingIdentifier,
  setVerificationToken,
  setRegistrationDetails,
  setOtpCountdown,
  decrementOtpCountdown,
  setServerError,
  setUser,
  logout,
  updatePersistFormState,
} = authSlice.actions;

export default authSlice.reducer;
