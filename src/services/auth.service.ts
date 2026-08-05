import { apiClient, setAccessToken, clearAccessToken } from '@/lib/apiClient';
import {
  CheckIdentifierRequest,
  CheckIdentifierResult,
  VerifyOtpRequest,
  VerifyOtpResult,
  CompleteRegistrationRequest,
  LoginRequest,
  AuthenticatedResponse,
  ForgotPasswordRequest,
  ForgotPasswordResult,
  VerifyResetOtpRequest,
  VerifyResetOtpResult,
  ResetPasswordRequest,
  ResetPasswordResult,
  ChangePasswordRequest,
  LogoutResult,
} from '@/types/auth';
import { User } from '@/types';

export const AuthService = {
  /**
   * Step 1: Check if identifier (email or phone) exists in backend DB.
   * If user exists -> returns action 'LOGIN_PASSWORD'
   * If user does NOT exist -> triggers registration OTP generation and returns action 'VERIFY_OTP'
   */
  async checkIdentifier(identifier: string): Promise<CheckIdentifierResult> {
    return apiClient<CheckIdentifierResult>('/auth/check-identifier', {
      method: 'POST',
      body: JSON.stringify({ identifier } as CheckIdentifierRequest),
    });
  },

  /**
   * Step 2 (Registration): Verify registration OTP code.
   * On success -> returns verificationToken UUID required for completeRegistration.
   */
  async verifyRegistrationOtp(
    identifier: string,
    otp: string
  ): Promise<VerifyOtpResult> {
    return apiClient<VerifyOtpResult>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp } as VerifyOtpRequest),
    });
  },

  /**
   * Step 3 (Registration): Finalize registration using verificationToken + user's name & password.
   * Sets JWT Access Token and returns PublicUser.
   */
  async completeRegistration(
    payload: CompleteRegistrationRequest
  ): Promise<AuthenticatedResponse> {
    const res = await apiClient<AuthenticatedResponse>('/auth/complete-registration', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
    }
    return res;
  },

  /**
   * Direct Login with identifier & password.
   * Sets JWT Access Token and returns PublicUser.
   */
  async login(payload: LoginRequest): Promise<AuthenticatedResponse> {
    const res = await apiClient<AuthenticatedResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
    }
    return res;
  },

  /**
   * Refresh Access Token using HTTP-only cookie refresh session.
   */
  async refresh(): Promise<AuthenticatedResponse> {
    const res = await apiClient<AuthenticatedResponse>('/auth/refresh', {
      method: 'POST',
      skipRefresh: true,
    });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
    }
    return res;
  },

  /**
   * Logout current session & invalidate refresh cookie.
   */
  async logout(): Promise<LogoutResult> {
    try {
      const res = await apiClient<LogoutResult>('/auth/logout', {
        method: 'POST',
        skipRefresh: true,
      });
      return res;
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Request password reset OTP.
   */
  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResult> {
    return apiClient<ForgotPasswordResult>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Verify password reset OTP code.
   * On success -> returns verificationToken UUID.
   */
  async verifyResetOtp(
    identifier: string,
    otp: string
  ): Promise<VerifyResetOtpResult> {
    return apiClient<VerifyResetOtpResult>('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp } as VerifyResetOtpRequest),
    });
  },

  /**
   * Reset password using verificationToken & new password.
   */
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResult> {
    return apiClient<ResetPasswordResult>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Change password for logged-in user.
   */
  async changePassword(
    payload: ChangePasswordRequest
  ): Promise<AuthenticatedResponse> {
    const res = await apiClient<AuthenticatedResponse>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
    }
    return res;
  },

  /**
   * Fetch current authenticated user profile (/auth/me).
   */
  async me(): Promise<User> {
    return apiClient<User>('/auth/me', {
      method: 'GET',
    });
  },
};
