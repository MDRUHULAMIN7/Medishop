'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  FileText,
  X,
  Eye,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  MapPin,
  Plus,
  Clock,
  User,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import { PrescriptionService, PrescriptionItem } from '@/services/prescription.service';
import { useAddress } from '@/hooks/useAddress';
import { CascadingAddressSelector, AddressCascadeValue } from '@/components/common/CascadingAddressSelector';

interface UploadPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBn?: boolean;
}

export function UploadPrescriptionModal({
  isOpen,
  onClose,
  isBn = true,
}: UploadPrescriptionModalProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { addresses, selectedAddressId, selectAddress } = useAddress();

  const [activeTab, setActiveTab] = useState<'gallery' | 'camera' | 'saved'>('gallery');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
    rawFile?: File;
  } | null>(null);

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

  // WebRTC Live Camera Stream State
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Guest Address State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState<AddressCascadeValue>({
    division: 'Dhaka',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    streetAddress: '',
  });

  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Fetch saved prescriptions for logged in user
  const { data: savedPrescriptions = [], isLoading: isSavedLoading } = useQuery({
    queryKey: ['my-prescriptions-modal'],
    queryFn: () => PrescriptionService.getMyPrescriptions(),
    enabled: isOpen && isAuthenticated,
  });

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsWebcamActive(false);
  };

  const startWebcam = async () => {
    try {
      stopWebcam();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setMediaStream(stream);
      setIsWebcamActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Webcam stream unavailable, falling back to camera file input:', err);
      setIsWebcamActive(false);
      cameraInputRef.current?.click();
    }
  };

  const captureWebcamSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera_rx_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = URL.createObjectURL(file);
            setSelectedFile({
              name: file.name,
              url,
              rawFile: file,
            });
            setSelectedPrescriptionId(null);
            stopWebcam();
            toast.success(isBn ? 'ক্যামেরা ফটো ক্যাপচার করা হয়েছে' : 'Camera photo captured!');
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile({
        name: file.name,
        url,
        rawFile: file,
      });
      setSelectedPrescriptionId(null);
      stopWebcam();
      toast.success(isBn ? 'প্রেসক্রিপশন ছবি নির্বাচন করা হয়েছে' : 'Prescription image selected');
    }
  };

  const handleSelectSavedPrescription = (rx: PrescriptionItem) => {
    setSelectedPrescriptionId(rx.id || (rx as any)._id);
    setSelectedFile({
      name: `Prescription #${(rx.id || (rx as any)._id).slice(-6)}`,
      url: rx.images[0] || '',
    });
    stopWebcam();
    toast.info(isBn ? 'সংরক্ষিত প্রেসক্রিপশন নির্বাচন করা হয়েছে' : 'Selected saved prescription');
  };

  const handleTabChange = (tab: 'gallery' | 'camera' | 'saved') => {
    setActiveTab(tab);
    if (tab === 'camera') {
      // Trigger camera input directly or start camera
      cameraInputRef.current?.click();
    } else {
      stopWebcam();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !selectedPrescriptionId) {
      toast.error(isBn ? 'অনুগ্রহ করে প্রেসক্রিপশন নির্বাচন বা আপলোড করুন' : 'Please select or upload a prescription');
      return;
    }

    if (!isAuthenticated && (!guestName.trim() || !guestPhone.trim() || !guestAddress.streetAddress.trim())) {
      toast.error(isBn ? 'অনুগ্রহ করে নাম, ফোন নম্বর ও পূর্ণাঙ্গ ঠিকানা প্রদান করুন' : 'Please provide name, phone number, and full street address');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalRxId = selectedPrescriptionId;

      if (!finalRxId && selectedFile) {
        const formData = new FormData();
        if (selectedFile.rawFile) {
          formData.append('images', selectedFile.rawFile);
        } else {
          formData.append('images', selectedFile.url);
        }
        const noteText = isAuthenticated
          ? note
          : `Guest: ${guestName}, Phone: ${guestPhone}, Note: ${note}`;
        formData.append('note', noteText);

        const uploaded = await PrescriptionService.uploadPrescription(formData);
        finalRxId = uploaded.id || (uploaded as any)._id;
      }

      toast.success(
        isBn
          ? 'প্রেসক্রিপশন অর্ডারের অনুরোধ সফলভাবে জমা নেওয়া হয়েছে! আমাদের ফার্মাসিস্ট কল দিয়ে ভেরিফাই করবেন।'
          : 'Prescription order request submitted! Our pharmacist will call to verify.'
      );

      stopWebcam();
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'প্রেসক্রিপশন জমা দেওয়া যায়নি' : 'Failed to submit prescription'));
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              stopWebcam();
              onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground font-serif-title">
                    {isBn ? 'প্রেসক্রিপশন আপলোড ও অর্ডার' : 'Upload Prescription Order'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'ছবি আপলোড করুন অথবা ক্যামেরা ও গ্যালারি থেকে সিলেক্ট করুন'
                      : 'Upload Rx image from camera, gallery or saved list'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopWebcam();
                  onClose();
                }}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Selection */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 p-1.5">
              {/* Option 1: Upload from Gallery */}
              <button
                type="button"
                onClick={() => handleTabChange('gallery')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-background text-primary shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>{isBn ? 'গ্যালারি / ফাইল' : 'Upload Gallery'}</span>
              </button>

              {/* Option 2: Open Camera */}
              <button
                type="button"
                onClick={() => handleTabChange('camera')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'camera'
                    ? 'bg-background text-primary shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>{isBn ? 'ক্যামেরা তুলুন' : 'Open Camera'}</span>
              </button>

              {/* Option 3: Saved Prescriptions (LOGGED IN USER ONLY) */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => handleTabChange('saved')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-background text-primary shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{isBn ? 'সংরক্ষিত তালিকা' : 'Saved List'}</span>
                </button>
              )}
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Camera File Input with capture="environment" for Native Camera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Tab Content */}
            {activeTab === 'gallery' || activeTab === 'camera' ? (
              <div className="space-y-3">
                {isWebcamActive ? (
                  /* WebRTC Live Camera Viewfinder */
                  <div className="relative overflow-hidden rounded-3xl border border-primary bg-black flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-3 flex items-center gap-3 bg-black/50 p-2 rounded-full backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={captureWebcamSnapshot}
                        className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-white shadow-lg cursor-pointer hover:bg-primary-dark"
                      >
                        <Camera className="h-4 w-4" />
                        <span>{isBn ? 'ছবি তুলুন' : 'Capture Photo'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopWebcam}
                        className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Dropzone */
                  <div
                    onClick={() => {
                      if (activeTab === 'camera') {
                        cameraInputRef.current?.click();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                      selectedFile
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-bold text-foreground truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImageUrl(selectedFile.url);
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>{isBn ? 'রিমুভ' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                          {activeTab === 'camera' ? <Camera className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {activeTab === 'camera'
                              ? (isBn ? 'ক্যামেরা চালু করে ছবি তুলুন' : 'Click to launch device camera')
                              : (isBn ? 'গ্যালারি বা ড্রাইভ থেকে নির্বাচন করতে ক্লিক করুন' : 'Click to select prescription file from gallery')}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {activeTab === 'camera'
                              ? (isBn ? 'সরাসরি ক্যামেরার সাহায্যে ছবি তোলা হবে' : 'Opens your mobile or desktop camera')
                              : 'JPG, PNG, WEBP, PDF (Max 10MB)'}
                          </p>
                        </div>

                        {activeTab === 'camera' && (
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startWebcam();
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 cursor-pointer"
                            >
                              <Camera className="h-3.5 w-3.5" />
                              <span>{isBn ? 'লাইভ ক্যামেরা ওপেন করুন' : 'Launch Live Webcam'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Saved Prescriptions List */
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground">
                  {isBn ? 'আপনার পূর্বে ব্যবহৃত কুপন বা প্রেসক্রিপশন:' : 'Select from your uploaded prescriptions:'}
                </h4>

                {isSavedLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : savedPrescriptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 bg-muted/20 rounded-2xl">
                    {isBn ? 'কোনো পূর্বের প্রেসক্রিপশন পাওয়া যায়নি।' : 'No saved prescriptions found.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {savedPrescriptions.map((rx: PrescriptionItem) => {
                      const isSelected = selectedPrescriptionId === (rx.id || (rx as any)._id);
                      return (
                        <div
                          key={rx.id || (rx as any)._id}
                          onClick={() => handleSelectSavedPrescription(rx)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                              : 'border-border bg-background hover:bg-muted/40'
                          }`}
                        >
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted shrink-0">
                            {rx.images?.[0] ? (
                              <img src={rx.images[0]} alt="Rx" className="h-full w-full object-cover" />
                            ) : (
                              <FileText className="h-5 w-5 m-2 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 truncate text-xs">
                            <p className="font-bold text-foreground truncate">{rx.note || 'Prescription'}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(rx.createdAt).toLocaleDateString()}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Address & Delivery Section */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-border">
              {isAuthenticated ? (
                /* LOGGED IN USER ADDRESS SELECTION */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{isBn ? 'ডেলিভারি ঠিকানা নির্বাচন করুন' : 'Select Shipping Address'}</span>
                    </label>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-800">
                      {isBn ? 'আপনার প্রোফাইলে কোনো ঠিকানা সেভ করা নেই। নিচে ম্যানুয়ালি লিখুন।' : 'No saved address in profile. Please enter manually.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === (addr as any)._id || selectedAddressId === addr.id;
                        return (
                          <div
                            key={(addr as any)._id || addr.id}
                            onClick={() => selectAddress((addr as any)._id || addr.id)}
                            className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                                : 'border-border bg-background hover:bg-muted/40'
                            }`}
                          >
                            <p className="font-extrabold text-foreground">{addr.recipientName || addr.fullName} ({addr.phone})</p>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {addr.addressLine || addr.streetAddress}, {addr.thana || addr.area}, {addr.district}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* GUEST USER MANUAL CASCADING ADDRESS FORM */
                <div className="space-y-3 bg-muted/20 p-4 rounded-3xl border border-border">
                  <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary" />
                    <span>{isBn ? 'গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা (গেস্ট অর্ডার)' : 'Guest Information & Delivery Address'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {isBn ? 'আপনার নাম *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ruhul Amin"
                        className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="01712345678"
                        className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cascading Address Selector */}
                  <CascadingAddressSelector
                    value={guestAddress}
                    onChange={(updated) => setGuestAddress(updated)}
                    isBn={isBn}
                  />
                </div>
              )}

              {/* Note / Instruction */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {isBn ? 'বিশেষ নির্দেশনা বা ওষুধের নাম/পরিমাণ (ঐচ্ছিক)' : 'Special Instructions or Medicine Details (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isBn ? 'যেমন: ১ মাসের ওষুধ লাগবে...' : 'e.g. Need 1 month supply of diabetic medicines...'}
                  className="w-full rounded-2xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    stopWebcam();
                    onClose();
                  }}
                  className="rounded-2xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{isBn ? 'প্রেসক্রিপশন অর্ডার সম্পন্ন করুন' : 'Submit Prescription Order'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-2xl w-full rounded-3xl bg-background p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'প্রেসক্রিপশন প্রিভিউ' : 'Prescription Preview'}</h3>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="rounded-full p-1 hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center rounded-2xl bg-muted/20 p-2">
              <img src={previewImageUrl} alt="Rx Preview" className="max-w-full h-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
