'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
  setAuthLoading,
  setPendingIdentifier,
  setUser,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import {
  SignInCredentials,
  SignUpCredentials,
  OtpVerificationPayload,
  ForgotPasswordCredentials,
} from '@/types/auth';
import { toast } from 'sonner';

export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    isLoading,
    isAuthModalOpen,
    authModalView,
    pendingPhone,
    pendingEmail,
  } = useAppSelector((state) => state.auth);

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const login = async (credentials: SignInCredentials) => {
    try {
      dispatch(setAuthLoading(true));
      const res = await AuthService.login(credentials);
      if (res.success && res.user) {
        dispatch(setUser(res.user));
        toast.success(isBn ? res.messageBn : res.messageEn);
      } else {
        toast.error(isBn ? res.messageBn : res.messageEn);
      }
      return res;
    } catch {
      toast.error(isBn ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed. Please try again.');
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const register = async (credentials: SignUpCredentials) => {
    try {
      dispatch(setAuthLoading(true));
      const res = await AuthService.register(credentials);
      if (res.success) {
        dispatch(
          setPendingIdentifier({
            phone: credentials.phone,
            email: credentials.email,
          })
        );
        dispatch(setAuthModalView('otp'));
        toast.success(isBn ? res.messageBn : res.messageEn);
      }
      return res;
    } catch {
      toast.error(isBn ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।' : 'Registration failed.');
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const verifyOtp = async (payload: OtpVerificationPayload) => {
    try {
      dispatch(setAuthLoading(true));
      const res = await AuthService.verifyOtp(payload);
      if (res.success && res.user) {
        dispatch(setUser(res.user));
        toast.success(isBn ? res.messageBn : res.messageEn);
      } else {
        toast.error(isBn ? res.messageBn : res.messageEn);
      }
      return res;
    } catch {
      toast.error(isBn ? 'ওটিপি ভেরিফিকেশন ব্যর্থ হয়েছে।' : 'OTP verification failed.');
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    try {
      dispatch(setAuthLoading(true));
      const res = await AuthService.forgotPassword(credentials);
      if (res.success) {
        toast.success(isBn ? res.messageBn : res.messageEn);
      }
      return res;
    } catch {
      toast.error(isBn ? 'পাসওয়ার্ড রিকভারি ব্যর্থ হয়েছে।' : 'Recovery request failed.');
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const logout = async () => {
    await AuthService.logout();
    dispatch(logoutAction());
    toast.info(isBn ? 'লগআউট করা হয়েছে।' : 'Logged out.');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAuthModalOpen,
    authModalView,
    pendingPhone,
    pendingEmail,
    openModal: (view?: 'signin' | 'signup' | 'otp' | 'forgot') =>
      dispatch(openAuthModal(view)),
    closeModal: () => dispatch(closeAuthModal()),
    setView: (view: 'signin' | 'signup' | 'otp' | 'forgot') =>
      dispatch(setAuthModalView(view)),
    login,
    register,
    verifyOtp,
    forgotPassword,
    logout,
  };
}
