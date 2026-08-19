import { apiClient } from '@/lib/apiClient';

export interface RecognitionCandidate {
  productId: string;
  product: any;
  similarity: number;
  matchStatus: 'strong' | 'possible';
  matchedReferenceImage?: string;
}

export interface ProductRecognitionResult {
  matches: RecognitionCandidate[];
  candidates: RecognitionCandidate[];
  provider: 'local_clip';
  model: string;
  topK: number;
  minSimilarity: number;
  noMatch: boolean;
  unavailable?: boolean;
}

export interface ScannerSession {
  sessionId: string;
  scannerToken?: string;
  scannerUrl?: string;
  expiresAt: string;
  status: 'created' | 'connected' | 'closed' | 'expired';
  connectedAt?: string;
}

export const PosScannerService = {
  async createSession(): Promise<ScannerSession> {
    return apiClient<ScannerSession>('/pos/scanner/session', { method: 'POST', body: JSON.stringify({}) });
  },

  async getSession(sessionId: string, token?: string): Promise<ScannerSession> {
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    return apiClient<ScannerSession>(`/pos/scanner/session/${encodeURIComponent(sessionId)}${query}`, {
      method: 'GET',
      skipAuth: Boolean(token),
    });
  },

  async closeSession(sessionId: string): Promise<void> {
    await apiClient(`/pos/scanner/session/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
  },

  async recognize(image: Blob, options: { sessionId?: string; scannerToken?: string } = {}) {
    const form = new FormData();
    form.append('image', image, 'product-capture.jpg');
    if (options.sessionId) form.append('scannerSessionId', options.sessionId);
    if (options.scannerToken) form.append('scannerToken', options.scannerToken);

    return apiClient<ProductRecognitionResult>('/pos/recognition', {
      method: 'POST',
      body: form,
      skipAuth: Boolean(options.scannerToken),
    });
  },
};
