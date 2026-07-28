import { User, AuthModalView } from '@/types';

export type IdentifierType = 'email' | 'phone';

export interface SignInCredentials {
  identifier: string; // Email or BD Phone (01XXXXXXXXX)
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  fullName: string;
  identifierType: IdentifierType;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface OtpVerificationPayload {
  identifier: string;
  otpCode: string;
}

export interface ForgotPasswordCredentials {
  identifier: string;
}

export interface AuthResponse {
  success: boolean;
  messageBn: string;
  messageEn: string;
  user?: User;
  pendingIdentifier?: string;
}
