'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  openAuthModal,
  closeAuthModal,
  setAuthModalView,
  setAuthLoading,
  setPendingIdentifier,
  setVerificationToken,
  setServerError,
  setUser,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import { ApiError, clearAccessToken } from '@/lib/apiClient';
import {
  SignInCredentials,
  OtpVerificationPayload,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  AuthModalView,
} from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    isAuthModalOpen,
    authModalView,
    pendingIdentifier,
    pendingPhone,
    pendingEmail,
    verificationToken,
    flowContext,
    serverError,
    fieldErrors,
  } = useAppSelector((state) => state.auth);

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const handleApiError = (err: any) => {
    let message = isBn ? 'একটি সমস্যা দেখা দিয়েছে।' : 'An error occurred. Please try again.';
    let fields: Record<string, string> = {};

    if (err instanceof ApiError) {
      message = err.message || message;
      fields = err.fieldErrors || {};

      switch (err.errorCode) {
        case 'INVALID_CREDENTIALS':
          message = isBn
            ? 'পাসওয়ার্ড সঠিক নয়। দয়া করে আবার চেষ্টা করুন।'
            : 'Incorrect password. Please try again.';
          break;
        case 'OTP_EXPIRED':
          message = isBn
            ? 'ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। দয়া করে নতুন কোড রিকোয়েস্ট করুন।'
            : 'OTP code expired. Please request a new code.';
          break;
        case 'OTP_INVALID':
          message = isBn
            ? 'ভুল ওটিপি কোড। সঠিক ৬ ডিজিটের কোড প্রদান করুন।'
            : 'Invalid OTP code. Please enter the correct 6-digit code.';
          break;
        case 'USER_ALREADY_EXISTS':
          message = isBn
            ? 'এই নম্বর/ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। দয়া করে লগইন করুন।'
            : 'Account already exists for this identifier. Please log in.';
          break;
        case 'VERIFICATION_TOKEN_EXPIRED':
        case 'RESET_TOKEN_EXPIRED':
          message = isBn
            ? 'ভেরিফিকেশন সেশনের মেয়াদ শেষ। অনুগ্রহ করে পুনরায় শুরু করুন।'
            : 'Verification session expired. Please start over.';
          break;
        case 'ACCOUNT_BLOCKED':
          message = isBn
            ? 'আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে। সাপোর্ট টিমে যোগাযোগ করুন।'
            : 'Your account has been blocked by an administrator. Please contact support.';
          break;
      }
    }

    dispatch(setServerError({ error: message, fieldErrors: fields }));
    toast.error(message);
    return { success: false, message, fieldErrors: fields };
  };

  /**
   * Stage 1: Check Identifier (email or phone).
   * If existing user -> prompt for Password (stage: 'password_login').
   * If new user -> send OTP & prompt for OTP (stage: 'verify_otp').
   */
  const checkIdentifier = async (identifierInput: string) => {
    const trimmed = identifierInput.trim();
    if (!trimmed) {
      toast.error(isBn ? 'ইমেইল অথবা মোবাইল নম্বর দিন' : 'Identifier is required');
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      const result = await AuthService.checkIdentifier(trimmed);

      dispatch(
        setPendingIdentifier({
          identifier: result.identifier,
          phone: result.targetType === 'phone' ? result.identifier : undefined,
          email: result.targetType === 'email' ? result.identifier : undefined,
        })
      );

      if (result.exists) {
        // Existing user -> transition to password_login stage
        dispatch(setAuthModalView('password_login'));
        toast.info(
          isBn
            ? 'স্বাগতম! আপনার পাসওয়ার্ড দিন'
            : 'Account found. Please enter your password.'
        );
        return { success: true, action: result.action, exists: true };
      } else {
        // New user -> transition to verify_otp stage
        dispatch(setVerificationToken({ token: null, flowContext: 'registration' }));
        dispatch(setAuthModalView('verify_otp'));
        toast.success(
          isBn
            ? `${result.identifier} নম্বরে ৬ ডিজিটের ওটিপি পাঠানো হয়েছে`
            : `6-digit OTP code sent to ${result.identifier}`
        );
        return { success: true, action: result.action, exists: false };
      }
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Stage 2A: Login with Password.
   */
  const login = async (credentials: SignInCredentials) => {
    const identifier = credentials.identifier || pendingIdentifier;
    if (!identifier || !credentials.password) {
      toast.error(isBn ? 'পাসওয়ার্ড প্রদান করুন' : 'Password is required');
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      const res = await AuthService.login({
        identifier,
        password: credentials.password,
      });

      if (res && res.user) {
        dispatch(setUser(res.user));
        toast.success(isBn ? 'সফলভাবে লগইন হয়েছে!' : 'Logged in successfully!');
        return { success: true, user: res.user };
      }
      return { success: false };
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Stage 2B: Verify OTP (Registration or Reset Password flow).
   */
  const verifyOtp = async (payload: OtpVerificationPayload) => {
    const target = payload.identifier || pendingIdentifier || pendingPhone || pendingEmail;
    if (!target) {
      toast.error(isBn ? 'আইডেন্টিফায়ার পাওয়া যায়নি' : 'Identifier missing');
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      const currentFlow = payload.flowContext || flowContext;

      if (currentFlow === 'reset') {
        const res = await AuthService.verifyResetOtp(target, payload.otpCode);
        dispatch(setVerificationToken({ token: res.verificationToken, flowContext: 'reset' }));
        dispatch(setAuthModalView('reset_password'));
        toast.success(isBn ? 'ওটিপি ভেরিফাই হয়েছে। নতুন পাসওয়ার্ড সেট করুন।' : 'OTP verified. Set your new password.');
        return { success: true, verificationToken: res.verificationToken };
      } else {
        // Registration flow -> transition to complete_registration stage
        const res = await AuthService.verifyRegistrationOtp(target, payload.otpCode);
        dispatch(setVerificationToken({ token: res.verificationToken, flowContext: 'registration' }));
        dispatch(setAuthModalView('complete_registration'));
        toast.success(
          isBn
            ? 'ওটিপি ভেরিফাই সফল! এখন নাম ও পাসওয়ার্ড সেট করুন।'
            : 'OTP verified! Enter your name & create a password.'
        );
        return { success: true, verificationToken: res.verificationToken };
      }
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Stage 3B: Complete Registration (Name + Password + VerificationToken).
   */
  const completeRegistration = async (name: string, password: string) => {
    if (!verificationToken) {
      toast.error(
        isBn
          ? 'ভেরিফিকেশন সেশনের মেয়াদ শেষ। দয়া করে আবার চেষ্টা করুন।'
          : 'Verification session expired. Please start over.'
      );
      dispatch(setAuthModalView('identifier'));
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      const res = await AuthService.completeRegistration({
        verificationToken,
        name,
        password,
      });

      if (res && res.user) {
        dispatch(setUser(res.user));
        toast.success(isBn ? 'অ্যাকাউন্ট তৈরি ও লগইন সফল হয়েছে!' : 'Registration completed successfully!');
        return { success: true, user: res.user };
      }
      return { success: false };
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Request Password Reset OTP.
   */
  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    const target = credentials.identifier || pendingIdentifier;
    if (!target) {
      toast.error(isBn ? 'ইমেইল অথবা মোবাইল নম্বর দিন' : 'Identifier required');
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      const res = await AuthService.forgotPassword({
        identifier: target,
      });

      dispatch(
        setPendingIdentifier({
          identifier: target,
          phone: target.startsWith('01') ? target : undefined,
          email: target.includes('@') ? target : undefined,
        })
      );
      dispatch(setVerificationToken({ token: null, flowContext: 'reset' }));
      dispatch(setAuthModalView('verify_otp'));

      toast.success(
        isBn
          ? `${target} নম্বরে পাসওয়ার্ড রিসেট ওটিপি পাঠানো হয়েছে`
          : `Password reset OTP sent to ${target}`
      );
      return { success: true, result: res };
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Stage 3C: Reset Password with verificationToken & new password.
   */
  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    const token = credentials.verificationToken || verificationToken;
    if (!token) {
      toast.error(
        isBn
          ? 'রিসেট সেশনের মেয়াদ শেষ। পুনরায় ওটিপি রিকোয়েস্ট করুন।'
          : 'Reset session expired. Please request a new OTP.'
      );
      dispatch(setAuthModalView('identifier'));
      return { success: false };
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setServerError({ error: null }));

      await AuthService.resetPassword({
        verificationToken: token,
        password: credentials.password,
      });

      toast.success(
        isBn
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। নতুন পাসওয়ার্ড দিয়ে লগইন করুন।'
          : 'Password reset successfully. Please log in with your new password.'
      );
      dispatch(setAuthModalView('password_login'));
      return { success: true };
    } catch (err: any) {
      return handleApiError(err);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  /**
   * Logout user session.
   */
  const logout = async () => {
    try {
      dispatch(setAuthLoading(true));
      await AuthService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAccessToken();
      dispatch(logoutAction());
      toast.info(isBn ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Logged out successfully.');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.replace('/');
      }
    }
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    isAuthModalOpen,
    authModalView,
    pendingIdentifier,
    pendingPhone,
    pendingEmail,
    verificationToken,
    flowContext,
    serverError,
    fieldErrors,
    openModal: (view?: AuthModalView) => dispatch(openAuthModal(view)),
    closeModal: () => dispatch(closeAuthModal()),
    setView: (view: AuthModalView) => dispatch(setAuthModalView(view)),
    checkIdentifier,
    login,
    verifyOtp,
    completeRegistration,
    forgotPassword,
    resetPassword,
    logout,
  };
}
