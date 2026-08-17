import { ApiErrorResponse, ApiSuccessResponse, ApiFieldError } from '@/types/auth';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let inMemoryAccessToken: string | null = null;

export const TOKEN_STORAGE_KEY = 'medishop_access_token_v1';

export function getAccessToken(): string | null {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public fieldErrors: Record<string, string>;
  public rawErrors: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = 'INTERNAL_ERROR',
    rawErrors: any = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.rawErrors = rawErrors;
    this.fieldErrors = this.normalizeFieldErrors(rawErrors);
  }

  private normalizeFieldErrors(errors: any): Record<string, string> {
    const map: Record<string, string> = {};
    if (!errors) return map;

    if (Array.isArray(errors)) {
      errors.forEach((err: ApiFieldError | any) => {
        if (err && typeof err === 'object' && err.field && err.message) {
          map[err.field] = err.message;
        }
      });
    } else if (typeof errors === 'object') {
      Object.keys(errors).forEach((key) => {
        if (typeof errors[key] === 'string') {
          map[key] = errors[key];
        }
      });
    }
    return map;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, skipRefresh = false, headers: customHeaders, ...restOptions } = options;

  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const config: RequestInit = {
    ...restOptions,
    headers,
    credentials: 'include', // Include cookies for refresh token
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError(
      err?.message || 'Network request failed. Please check your internet connection.',
      0,
      'NETWORK_ERROR'
    );
  }

  // Handle 401 Unauthorized for token refresh
  if (response.status === 401 && !skipRefresh && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          return apiClient<T>(endpoint, {
            ...options,
            headers: {
              ...customHeaders,
              Authorization: `Bearer ${newToken}`,
            },
          });
        })
        .catch((err) => {
          throw err;
        });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh token invalid');
      }

      const refreshData: ApiSuccessResponse<{ user: any; accessToken: string }> =
        await refreshRes.json();

      if (refreshData.success && refreshData.data?.accessToken) {
        const newAccessToken = refreshData.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        isRefreshing = false;

        return apiClient<T>(endpoint, {
          ...options,
          headers: {
            ...customHeaders,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        throw new Error('Failed to parse refresh payload');
      }
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAccessToken();
      isRefreshing = false;
      // Rethrow original 401 error or custom token expired
      throw new ApiError(
        'Session expired. Please log in again.',
        401,
        'SESSION_EXPIRED'
      );
    }
  }

  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok || (data && data.success === false)) {
    const errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
    const errorCode = data?.errorCode || (response.status === 401 ? 'UNAUTHORIZED' : 'API_ERROR');
    const rawErrors = data?.errors || null;

    throw new ApiError(errorMessage, response.status, errorCode, rawErrors);
  }

  // Handle standard ApiResponse wrapper
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    if ((data.meta || data.pagination) && Array.isArray(data.data)) {
      (data.data as any).meta = data.meta || data.pagination;
    }
    return data.data as T;
  }

  return data as T;
}
