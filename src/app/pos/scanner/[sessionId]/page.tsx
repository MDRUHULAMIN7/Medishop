'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AlertTriangle, Camera, CheckCircle2, Loader2, RefreshCw, ScanLine } from 'lucide-react';
import { PosScannerService } from '@/services/posScanner.service';
import { API_BASE_URL } from '@/lib/apiClient';
import { io, Socket } from 'socket.io-client';

const socketBaseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export default function RemoteScannerPage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const scannerToken = searchParams.get('token') || '';
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const previewRef = useRef('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'capturing' | 'sending' | 'sent' | 'error' | 'expired'>('loading');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      if (!sessionId || !scannerToken) {
        setError('This scanner link is incomplete. Ask the POS to create a new QR code.');
        setStatus('error');
        return;
      }

      try {
        await PosScannerService.getSession(sessionId, scannerToken);
        if (!mounted) return;
        const socket = io(socketBaseUrl, { auth: { scannerSessionId: sessionId, scannerToken } });
        socketRef.current = socket;
        socket.on('connect', () => socket.emit('pos:scanner:join', { sessionId, role: 'phone' }));
        socket.on('pos:scanner:error', (event: { message?: string }) => {
          if (mounted) {
            setError(event.message || 'The POS scanner session is no longer available.');
            setStatus('error');
          }
        });
        socket.on('disconnect', () => {
          if (mounted) setError('The POS connection was interrupted.');
        });

        if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser does not support camera access.');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus('ready');
      } catch (startError: any) {
        if (!mounted) return;
        const message = startError?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access and reload this page.'
          : startError?.message || 'The scanner could not be opened.';
        setError(message);
        setStatus(startError?.statusCode === 410 ? 'expired' : 'error');
      }
    };
    void start();
    return () => {
      mounted = false;
      stopCamera();
      socketRef.current?.disconnect();
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, [scannerToken, sessionId, stopCamera]);

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    setStatus('capturing');
    canvas.width = Math.min(video.videoWidth, 1280);
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.78));
    if (!blob) {
      setError('The product photo could not be created.');
      setStatus('error');
      return;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(blob);
    setPreview(previewRef.current);
    setStatus('sending');
    socketRef.current?.emit('pos:scanner:captured', { sessionId });
    try {
      await PosScannerService.recognize(blob, { sessionId, scannerToken });
      setStatus('sent');
    } catch (captureError: any) {
      setError(captureError?.message || 'The photo could not be sent to the POS.');
      setStatus('error');
    }
  };

  const retake = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = '';
    setPreview('');
    setError('');
    setStatus('ready');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-lg flex-col">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white"><ScanLine className="h-5 w-5" /></div>
          <div><h1 className="text-lg font-black">MediShop Scanner</h1><p className="text-xs text-white/60">Take a product photo for the POS</p></div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-3xl bg-black ring-1 ring-white/15">
          <video ref={videoRef} muted playsInline className="h-full min-h-[60vh] w-full object-cover" />
          {preview && <img src={preview} alt="Captured product" className="absolute inset-0 h-full w-full object-cover" />}
          {!preview && status === 'loading' && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white/75"><Loader2 className="h-8 w-8 animate-spin" /><span>Opening camera…</span></div>}
          {status === 'sending' && <div className="absolute inset-0 flex items-center justify-center bg-black/45"><div className="rounded-2xl bg-black/70 px-4 py-3 text-sm font-bold"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Sending to POS…</div></div>}
          {status === 'sent' && <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-emerald-500/90 p-3 text-center text-sm font-black"><CheckCircle2 className="mr-1 inline h-4 w-4" />Photo sent — confirm the product on the POS</div>}
        </div>

        {error && <div className="mt-4 flex items-start gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-100"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        {status === 'expired' && <button type="button" onClick={() => window.location.reload()} className="mt-4 h-12 rounded-2xl bg-primary text-sm font-black">Ask POS for a new scanner link</button>}
        {status !== 'expired' && (
          <div className="mt-4 flex gap-2">
            {preview ? <button type="button" onClick={retake} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 text-sm font-black"><RefreshCw className="h-4 w-4" />Retake</button> : <button type="button" onClick={() => void capture()} disabled={status !== 'ready'} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black disabled:opacity-40"><Camera className="h-5 w-5" />Capture product</button>}
          </div>
        )}
        <p className="mt-4 text-center text-[11px] text-white/45">The POS operator will choose the correct product, unit, and quantity.</p>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}
