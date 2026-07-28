import {
  SignInCredentials,
  SignUpCredentials,
  OtpVerificationPayload,
  ForgotPasswordCredentials,
  AuthResponse,
} from '@/types/auth';

/**
 * Mock Authentication Service layer.
 * Implements Promises with artificial delay to simulate network latency.
 * Future API Integration: Swap function bodies with real fetch / axios calls.
 */
export const AuthService = {
  async login(credentials: SignInCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulated successful login for any valid form input
    return {
      success: true,
      messageBn: 'সফলভাবে লগইন হয়েছে!',
      messageEn: 'Logged in successfully!',
      user: {
        id: 'u-101',
        name: credentials.identifier.includes('@')
          ? credentials.identifier.split('@')[0]
          : 'নুরুল ইসলাম (Customer)',
        email: credentials.identifier.includes('@')
          ? credentials.identifier
          : 'user@medishop.com.bd',
        phone: credentials.identifier.includes('@')
          ? '01711000000'
          : credentials.identifier,
        avatarUrl: 'https://placehold.co/100x100/1D4ED8/FFFFFF?text=NI',
      },
    };
  },

  async register(credentials: SignUpCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const identifier =
      credentials.identifierType === 'email'
        ? credentials.email!
        : credentials.phone!;

    return {
      success: true,
      messageBn: 'অ্যাকাউন্ট তৈরি হয়েছে। ওটিপি কোড পাঠানো হয়েছে।',
      messageEn: 'Account created. OTP verification code sent.',
      pendingIdentifier: identifier,
    };
  },

  async verifyOtp(payload: OtpVerificationPayload): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Demo OTP check: "123456" or any 6 digits
    if (payload.otpCode && payload.otpCode.length === 6) {
      return {
        success: true,
        messageBn: 'ওটিপি ভেরিফিকেশন সফল হয়েছে!',
        messageEn: 'OTP verified successfully!',
        user: {
          id: 'u-' + Math.floor(Math.random() * 1000),
          name: 'নতুন গ্রাহক (Verified Customer)',
          phone: payload.identifier.startsWith('01')
            ? payload.identifier
            : '01700000000',
          email: payload.identifier.includes('@')
            ? payload.identifier
            : 'customer@medishop.com.bd',
        },
      };
    }

    return {
      success: false,
      messageBn: 'ভুল ওটিপি কোড। ডেমো কোড "123456" দিন।',
      messageEn: 'Invalid OTP code. Please use demo code "123456".',
    };
  },

  async forgotPassword(
    credentials: ForgotPasswordCredentials
  ): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      messageBn: `পাসওয়ার্ড রিকোভারি লিংক/ওটিপি ${credentials.identifier} নম্বরে পাঠানো হয়েছে।`,
      messageEn: `Password recovery link/OTP sent to ${credentials.identifier}.`,
    };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};
