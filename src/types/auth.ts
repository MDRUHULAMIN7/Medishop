import { User } from './index';

export type IdentifierType = 'email' | 'phone';
export type AuthFlowAction = 'LOGIN_PASSWORD' | 'VERIFY_OTP';

// Standard Backend Response Interfaces
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages?: number;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  errors?: ApiFieldError[] | Record<string, string> | null;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Auth API Request Contracts
export interface CheckIdentifierRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface CompleteRegistrationRequest {
  verificationToken: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface VerifyResetOtpRequest {
  identifier: string;
  otp: string;
}

export interface ResetPasswordRequest {
  verificationToken: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth API Response Contracts
export interface CheckIdentifierResult {
  exists: boolean;
  action: AuthFlowAction;
  targetType: IdentifierType;
  identifier: string;
}

export interface VerifyOtpResult {
  verificationToken: string;
}

export interface AuthenticatedResponse {
  user: User;
  accessToken: string;
}

export interface ForgotPasswordResult {
  sent: boolean;
  targetType: IdentifierType;
}

export interface VerifyResetOtpResult {
  verificationToken: string;
}

export interface ResetPasswordResult {
  reset: boolean;
}

export interface LogoutResult {
  loggedOut: boolean;
}

// Client Form State & Helper Types
export interface SignInCredentials {
  identifier: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  fullName: string;
  identifierType?: IdentifierType;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

export interface OtpVerificationPayload {
  identifier: string;
  otpCode: string;
  flowContext?: 'registration' | 'reset';
}

export interface ForgotPasswordCredentials {
  identifier: string;
}

export interface ResetPasswordCredentials {
  verificationToken: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  messageBn: string;
  messageEn: string;
  user?: User;
  pendingIdentifier?: string;
  verificationToken?: string;
  action?: AuthFlowAction;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
}
