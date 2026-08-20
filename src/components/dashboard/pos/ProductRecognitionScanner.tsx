'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import QRCode from 'qrcode';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  MonitorSmartphone,
  RefreshCw,
  ScanLine,
  Search,
  Smartphone,
  Wifi,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL, getAccessToken } from '@/lib/apiClient';
import { Product, ProductService } from '@/services/product.service';
import { PosScannerService, RecognitionCandidate, ScannerSession } from '@/services/posScanner.service';

type UnitOption = { unit: string; multiplier: number; price: number };
type ScannerStatus = 'ready' | 'opening' | 'camera' | 'capturing' | 'recognizing' | 'candidates' | 'no-match' | 'error' | 'waiting' | 'connected' | 'disconnected';

interface ProductRecognitionScannerProps {
  isBn?: boolean;
  getUnitOptions: (product: Product) => UnitOption[];
  onAddToCart: (product: Product, unit: UnitOption, quantity: number) => boolean;
  onManualSearch: () => void;
  onProductRecognized?: (product: Product, candidates: RecognitionCandidate[]) => void;
  onCandidateSelected?: (candidate: RecognitionCandidate) => void;
}

const socketBaseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export function ProductRecognitionScanner({
  isBn = true,
  getUnitOptions,
  onAddToCart,
  onManualSearch,
  onProductRecognized,
  onCandidateSelected,
}: ProductRecognitionScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'camera' | 'remote'>('camera');
  const [status, setStatus] = useState<ScannerStatus>('ready');
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [candidates, setCandidates] = useState<RecognitionCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<RecognitionCandidate | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [remoteSession, setRemoteSession] = useState<ScannerSession | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const clearPreview = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreviewUrl('');
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const loadDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices(all.filter((device) => device.kind === 'videoinput'));
  }, []);

  const startCamera = useCallback(async (requestedDeviceId?: string) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(isBn ? 'এই ব্রাউজারে ক্যামেরা সাপোর্ট নেই।' : 'This browser does not support camera access.');
      setStatus('error');
      return;
    }

    stopCamera();
    setError('');
    setStatus('opening');

    try {
      const video = requestedDeviceId
        ? { deviceId: { exact: requestedDeviceId }, width: { ideal: 1280 }, height: { ideal: 1280 } }
        : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1280 } };
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      await loadDevices();
      setStatus('camera');
    } catch (cameraError: any) {
      const message = cameraError?.name === 'NotAllowedError'
        ? (isBn ? 'ক্যামেরা অনুমতি দিন, তারপর আবার চেষ্টা করুন।' : 'Camera permission was denied. Allow access and try again.')
        : cameraError?.name === 'NotFoundError'
        ? (isBn ? 'কোনো ক্যামেরা পাওয়া যায়নি।' : 'No camera was found on this device.')
        : (isBn ? 'ক্যামেরা চালু করা যায়নি।' : 'The camera could not be opened.');
      setError(message);
      setStatus('error');
    }
  }, [isBn, loadDevices, stopCamera]);

  const resetResult = useCallback(() => {
    clearPreview();
    setCandidates([]);
    setSelectedCandidate(null);
    setSelectedUnit(null);
    setQuantity(1);
    setError('');
    setStatus(mode === 'remote' ? (remoteSession ? 'waiting' : 'ready') : (streamRef.current ? 'camera' : 'ready'));
  }, [clearPreview, mode, remoteSession]);

  const closeScanner = useCallback(async () => {
    stopCamera();
    socketRef.current?.disconnect();
    socketRef.current = null;
    if (remoteSession) {
      await PosScannerService.closeSession(remoteSession.sessionId).catch(() => undefined);
    }
    setRemoteSession(null);
    setQrDataUrl('');
    resetResult();
    setOpen(false);
  }, [remoteSession, resetResult, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
      socketRef.current?.disconnect();
      if (remoteSession) void PosScannerService.closeSession(remoteSession.sessionId).catch(() => undefined);
      clearPreview();
    };
  }, [clearPreview, remoteSession, stopCamera]);

  const showCandidates = useCallback((result: { matches?: RecognitionCandidate[]; candidates?: RecognitionCandidate[] }) => {
    const formatted = (result.matches || result.candidates || []).map((candidate) => ({
      ...candidate,
      product: ProductService.formatProduct(candidate.product),
    }));
    setCandidates(formatted);
    setSelectedCandidate(null);
    setSelectedUnit(null);
    setQuantity(1);
    setStatus(formatted.length ? 'candidates' : 'no-match');
    if (formatted[0]?.product) {
      onProductRecognized?.(formatted[0].product as Product, formatted);
    }
  }, [onProductRecognized]);

  const capture = useCallback(async () => {
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
      setError(isBn ? 'ছবি তৈরি করা যায়নি।' : 'The image could not be captured.');
      setStatus('error');
      return;
    }

    clearPreview();
    objectUrlRef.current = URL.createObjectURL(blob);
    setPreviewUrl(objectUrlRef.current);
    setStatus('recognizing');
    try {
      if (mode === 'remote' && remoteSession?.scannerToken) {
        // Remote phone mode uploads over HTTP; Socket.IO only carries state and the result event.
        await PosScannerService.recognize(blob, {
          sessionId: remoteSession.sessionId,
          scannerToken: remoteSession.scannerToken,
        });
      } else {
        const result = await PosScannerService.recognize(blob);
        showCandidates(result);
      }
    } catch (recognitionError: any) {
      setError(recognitionError?.message || (isBn ? 'পণ্য শনাক্ত করা যায়নি।' : 'Product recognition failed.'));
      setStatus('error');
    }
  }, [clearPreview, isBn, mode, remoteSession, showCandidates]);

  const openCameraScanner = useCallback(() => {
    setMode('camera');
    setOpen(true);
    setCandidates([]);
    setSelectedCandidate(null);
    setSelectedUnit(null);
  }, []);

  useEffect(() => {
    if (open && mode === 'camera' && !streamRef.current && status === 'ready') {
      void startCamera(deviceId || undefined);
    }
  }, [deviceId, mode, open, startCamera, status]);

  const openRemoteScanner = useCallback(async () => {
    setMode('remote');
    setOpen(true);
    setStatus('opening');
    setError('');
    try {
      const session = await PosScannerService.createSession();
      setRemoteSession(session);
      setQrDataUrl(session.scannerUrl ? await QRCode.toDataURL(session.scannerUrl, { width: 280, margin: 2 }) : '');

      const socket = io(socketBaseUrl, { auth: { token: getAccessToken() } });
      socketRef.current = socket;
      socket.on('connect', () => socket.emit('pos:scanner:join', { sessionId: session.sessionId, role: 'desktop' }));
      socket.on('pos:scanner:connected', () => setStatus('connected'));
      socket.on('pos:scanner:result', (result: { matches?: RecognitionCandidate[]; candidates?: RecognitionCandidate[] }) => showCandidates(result));
      socket.on('pos:scanner:recognizing', () => setStatus('recognizing'));
      socket.on('pos:scanner:error', (event: { message?: string }) => {
        setError(event.message || (isBn ? 'ফোন স্ক্যানার সংযোগ পাওয়া যায়নি।' : 'The phone scanner session could not be used.'));
        setStatus('error');
      });
      socket.on('pos:scanner:disconnect', () => setStatus('disconnected'));
      socket.on('disconnect', () => setStatus('disconnected'));
    } catch (sessionError: any) {
      setError(sessionError?.message || (isBn ? 'ফোন স্ক্যানার তৈরি করা যায়নি।' : 'Could not create the phone scanner.'));
      setStatus('error');
    }
  }, [isBn, showCandidates]);

  const selectCandidate = (candidate: RecognitionCandidate) => {
    const product = candidate.product as Product;
    const options = getUnitOptions(product);
    setSelectedCandidate(candidate);
    setSelectedUnit(options[0] || null);
    setQuantity(1);
    onCandidateSelected?.(candidate);
  };

  const confirmAndAdd = () => {
    if (!selectedCandidate || !selectedUnit) return;
    const product = selectedCandidate.product as Product;
    const available = Math.floor(Number(product.stock || 0) / Math.max(1, selectedUnit.multiplier));
    if (quantity > available) {
      toast.error(isBn ? `এই ইউনিটে সর্বোচ্চ ${available}টি মজুদ আছে।` : `Only ${available} ${selectedUnit.unit} available.`);
      return;
    }
    if (onAddToCart(product, selectedUnit, quantity)) resetResult();
  };

  const statusLabel = ({
    opening: isBn ? 'ক্যামেরা চালু হচ্ছে...' : 'Opening camera...',
    capturing: isBn ? 'ছবি নেওয়া হচ্ছে...' : 'Capturing...',
    recognizing: isBn ? 'পণ্য শনাক্ত করা হচ্ছে...' : 'Recognizing product...',
    waiting: isBn ? 'ফোনে স্ক্যান করার অপেক্ষায়...' : 'Waiting for phone scan...',
    connected: isBn ? 'ফোন সংযুক্ত' : 'Phone connected',
    disconnected: isBn ? 'ফোন সংযোগ বিচ্ছিন্ন' : 'Phone disconnected',
  } as Partial<Record<ScannerStatus, string>>)[status];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={openCameraScanner} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-primary-dark transition-colors">
          <Camera className="h-4 w-4" />
          {isBn ? 'ক্যামেরায় স্ক্যান' : 'Scan with Camera'}
        </button>
        <button type="button" onClick={() => void openRemoteScanner()} className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-extrabold text-primary hover:bg-primary/10 transition-colors">
          <Smartphone className="h-4 w-4" />
          {isBn ? 'ফোনকে স্ক্যানার করুন' : 'Use Phone as Scanner'}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ScanLine className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-base font-black text-foreground">{isBn ? 'পণ্য স্ক্যান করুন' : 'Scan Product'}</h3>
                  <p className="text-[11px] text-muted-foreground">{isBn ? 'এটি বারকোড স্ক্যানার নয়' : 'Image recognition only — no barcode lookup'}</p>
                </div>
              </div>
              <button type="button" onClick={() => void closeScanner()} className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
              <div className="space-y-3">
                {mode === 'camera' ? (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-950 ring-1 ring-border">
                      <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
                      {!streamRef.current && !previewUrl && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-white/70"><Camera className="h-8 w-8" /><span className="text-sm">{statusLabel || (isBn ? 'ক্যামেরা প্রস্তুত করুন' : 'Ready to open camera')}</span></div>}
                      {previewUrl && <img src={previewUrl} alt="Captured product" className="absolute inset-0 h-full w-full object-cover" />}
                      {status === 'recognizing' && <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white"><Loader2 className="mr-2 h-5 w-5 animate-spin" />{statusLabel}</div>}
                      {status === 'camera' && <div className="pointer-events-none absolute inset-8 rounded-3xl border-2 border-white/70 shadow-[0_0_0_999px_rgba(0,0,0,0.16)]" />}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {devices.length > 1 && <label className="relative flex min-w-0 flex-1 items-center"><select value={deviceId} onChange={(event) => { setDeviceId(event.target.value); void startCamera(event.target.value || undefined); }} className="h-11 w-full appearance-none rounded-2xl border border-border bg-background px-3 pr-9 text-xs font-bold"><option value="">{isBn ? 'পেছনের ক্যামেরা (ডিফল্ট)' : 'Default / rear camera'}</option>{devices.map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `${isBn ? 'ক্যামেরা' : 'Camera'} ${index + 1}`}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" /></label>}
                      <button type="button" onClick={previewUrl ? resetResult : capture} disabled={status === 'opening' || status === 'recognizing' || status === 'capturing'} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-xs font-black text-white disabled:opacity-50"><Camera className="h-4 w-4" />{previewUrl ? (isBn ? 'আবার ছবি নিন' : 'Retake Photo') : (isBn ? 'ছবি তুলুন' : 'Capture Photo')}</button>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                    {qrDataUrl ? <img src={qrDataUrl} alt={isBn ? 'ফোন স্ক্যানার পেয়ার করার QR কোড' : 'QR code to pair phone scanner'} className="h-56 w-56 rounded-2xl bg-white p-2 shadow-sm" /> : <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    <div className="mt-4 flex items-center gap-2 text-sm font-black text-foreground"><Wifi className={`h-4 w-4 ${status === 'connected' ? 'text-emerald-500' : 'text-amber-500'}`} />{statusLabel || (isBn ? 'ফোন দিয়ে QR কোড স্ক্যান করুন' : 'Scan this QR code with your phone')}</div>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">{isBn ? 'ফোনে পণ্যটির ছবি তুলুন। নিশ্চিতকরণ ও বিক্রয় এই POS-এই থাকবে।' : 'Take the product photo on your phone. Confirmation and sale remain on this POS.'}</p>
                    {remoteSession?.scannerUrl && <a href={remoteSession.scannerUrl} target="_blank" rel="noreferrer" className="mt-3 break-all text-[10px] font-semibold text-primary underline">{remoteSession.scannerUrl}</a>}
                  </div>
                )}

                {error && <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
                <div className="flex flex-wrap gap-2">
                  {mode === 'camera' && <button type="button" onClick={() => void startCamera(deviceId || undefined)} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted"><RefreshCw className="h-3.5 w-3.5" />{isBn ? 'ক্যামেরা রিফ্রেশ' : 'Refresh camera'}</button>}
                  <button type="button" onClick={() => { void closeScanner(); onManualSearch(); }} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted"><Search className="h-3.5 w-3.5" />{isBn ? 'ম্যানুয়ালি খুঁজুন' : 'Search manually'}</button>
                </div>
              </div>

              <div className="min-h-[280px] rounded-3xl border border-border bg-muted/20 p-4">
                {status === 'no-match' ? (
                  <div className="flex h-full flex-col items-center justify-center text-center"><ImageIcon className="h-8 w-8 text-muted-foreground" /><h4 className="mt-3 text-sm font-black">{isBn ? 'কোনো মিল পাওয়া যায়নি' : 'No product match found'}</h4><p className="mt-1 text-xs text-muted-foreground">{isBn ? 'আরেকটি ছবি তুলুন অথবা ম্যানুয়ালি খুঁজুন।' : 'Retake the photo or use the existing product search.'}</p><div className="mt-4 flex gap-2"><button type="button" onClick={resetResult} className="rounded-xl bg-primary px-3 py-2 text-[11px] font-black text-white">{isBn ? 'আবার চেষ্টা' : 'Retake'}</button><button type="button" onClick={() => { void closeScanner(); onManualSearch(); }} className="rounded-xl border border-border px-3 py-2 text-[11px] font-black">{isBn ? 'ম্যানুয়াল সার্চ' : 'Manual search'}</button></div></div>
                ) : candidates.length === 0 ? (
                  <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center text-muted-foreground"><ScanLine className="h-8 w-8" /><p className="mt-3 text-sm font-black text-foreground">{mode === 'remote' && status !== 'candidates' ? (isBn ? 'স্ক্যানের ফলাফল এখানে আসবে' : 'Scan results will appear here') : (isBn ? 'ছবি তুলে শীর্ষ মিল দেখুন' : 'Capture a photo to see top matches')}</p><p className="mt-1 text-xs">{isBn ? 'পণ্য যোগ করার আগে স্টাফকে অবশ্যই নিশ্চিত করতে হবে।' : 'Staff confirmation is required before adding anything to the sale.'}</p></div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><h4 className="text-sm font-black text-foreground">{isBn ? 'মিল পাওয়া পণ্য' : 'Detected products'}</h4><span className="text-[10px] font-bold text-muted-foreground">{candidates.length} {isBn ? 'টি মিল' : 'matches'}</span></div>
                    <div className="max-h-[270px] space-y-2 overflow-y-auto pr-1">
                      {candidates.map((candidate) => {
                        const product = candidate.product as Product;
                        return <button key={product.id} type="button" onClick={() => selectCandidate(candidate)} className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${selectedCandidate?.product?.id === product.id ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/50'}`}>
                          <img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                          <span className="hidden min-w-0 max-w-[32%] sm:block"><span className="block truncate text-[10px] font-bold text-foreground">{product.genericName || '—'}</span><span className="block truncate text-[10px] text-muted-foreground">{product.dosageForm || '—'} · Stock {product.stock ?? 0}</span></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-foreground">{product.name}</span><span className="block truncate text-[10px] text-muted-foreground">{product.brandName || product.brand} {product.strength ? `• ${product.strength}` : ''}</span></span>
                          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${candidate.matchStatus === 'strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{candidate.matchStatus === 'strong' ? (isBn ? 'শক্ত মিল' : 'Strong Match') : (isBn ? 'সম্ভাব্য মিল' : 'Possible Match')}</span>
                        </button>;
                      })}
                    </div>
                    {selectedCandidate && selectedUnit && <div className="space-y-3 border-t border-border pt-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{isBn ? 'নিশ্চিত পণ্য' : 'Confirm product'}</p><p className="text-sm font-black text-foreground">{(selectedCandidate.product as Product).name}</p><p className="text-[10px] text-muted-foreground">{(selectedCandidate.product as Product).genericName || '—'} • {selectedCandidate.matchStatus === 'strong' ? (isBn ? 'শক্ত মিল' : 'Strong Match') : (isBn ? 'সম্ভাব্য মিল' : 'Possible Match')} · {isBn ? 'মিল স্কোর' : 'Match score'} {Math.round(selectedCandidate.similarity * 100)}</p></div><label className="block"><span className="mb-1 block text-[10px] font-bold text-muted-foreground">{isBn ? 'ইউনিট' : 'Unit'}</span><select value={selectedUnit.unit} onChange={(event) => { const option = getUnitOptions(selectedCandidate.product as Product).find((item) => item.unit === event.target.value); if (option) { setSelectedUnit(option); setQuantity(1); } }} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold">{getUnitOptions(selectedCandidate.product as Product).map((option) => <option key={option.unit} value={option.unit}>{option.unit} — ৳{option.price}</option>)}</select></label><div className="flex items-center justify-between gap-3"><div className="flex items-center rounded-xl border border-border bg-background"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3 py-2 text-sm font-black">−</button><span className="min-w-8 text-center text-sm font-black">{quantity}</span><button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-3 py-2 text-sm font-black">+</button></div><span className="text-[10px] font-bold text-muted-foreground">{isBn ? 'মজুদ' : 'Available'}: {Math.floor(Number((selectedCandidate.product as Product).stock || 0) / Math.max(1, selectedUnit.multiplier))} {selectedUnit.unit}</span></div><button type="button" onClick={confirmAndAdd} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black text-white"><CheckCircle2 className="h-4 w-4" />{isBn ? 'পণ্য নিশ্চিত করে বিক্রয়ে যোগ করুন' : 'Confirm & Add to Sale'}</button></div>}
                    <p className="text-[10px] text-muted-foreground">{isBn ? 'ভুল মিল হলে তালিকা থেকে সঠিক পণ্য বেছে নিন।' : 'Choose the correct candidate yourself; recognition never finalizes a sale.'}</p>
                  </div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
}
