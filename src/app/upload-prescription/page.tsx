'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  Camera,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Clock,
  Trash2,
  Eye,
  AlertCircle,
  X,
  FileUp,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store';
import { PrescriptionService } from '@/services/prescription.service';
import { HOTLINE_NUMBER, HOTLINE_TEL, WHATSAPP_LINK } from '@/lib/constants';

import { useQuery } from '@tanstack/react-query';

export default function UploadPrescriptionPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { data: prescriptions = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => PrescriptionService.getMyPrescriptions(),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    url: string;
    rawFile?: File;
  } | null>(null);

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  // Demo prescription presets for easy user testing
  const DEMO_PRESETS = [
    {
      name: 'prescription_sample_1.jpeg',
      size: '1.2 MB',
      type: 'JPEG Image',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
      title: 'Routine Health & Blood Pressure Prescription',
    },
    {
      name: 'dr_consultation_rx.pdf',
      size: '850 KB',
      type: 'PDF Document',
      url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=800&auto=format&fit=crop',
      title: 'Diabetic & OTC Care Plan',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFile({
        name: file.name,
        size: `${fileSizeInMB} MB`,
        type: file.type.includes('pdf') ? 'PDF Document' : 'Image File',
        url,
        rawFile: file,
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      toast.success(isBn ? 'প্রেসক্রিপশন ফাইল নির্বাচন করা হয়েছে' : 'Prescription file selected');
    }
  };

  const handleSelectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setSelectedFile({
      name: preset.name,
      size: preset.size,
      type: preset.type,
      url: preset.url,
      rawFile: undefined,
    });
    setTitle(preset.title);
    toast.info(isBn ? 'নমুনা প্রেসক্রিপশন যোগ করা হয়েছে' : 'Sample prescription attached');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error(isBn ? 'অনুগ্রহ করে প্রেসক্রিপশনের ছবি বা ফাইল আপলোড করুন' : 'Please upload a prescription image or document');
      return;
    }

    if (!patientName || !phone) {
      toast.error(isBn ? 'রোগীর নাম এবং মোবাইল নম্বর অবশ্য প্রদান করুন' : 'Patient name and contact phone number are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (selectedFile.rawFile) {
        formData.append('images', selectedFile.rawFile);
      } else {
        // Fallback for preset image URL
        formData.append('images', selectedFile.url);
      }
      const noteText = `Patient: ${patientName}, Phone: ${phone}${doctorName ? `, Doctor: ${doctorName}` : ''}${notes ? `, Notes: ${notes}` : ''}`;
      formData.append('note', noteText);

      await PrescriptionService.uploadPrescription(formData);

      toast.success(
        isBn
          ? 'প্রেসক্রিপশন সফলভাবে জমা দেওয়া হয়েছে! লাইসেন্সকৃত ফার্মাসিস্ট পর্যালোচনা করে ভেরিফাই করবেন।'
          : 'Prescription uploaded successfully! A licensed pharmacist will review and verify it.'
      );

      setIsSubmitting(false);
      setSelectedFile(null);
      setPatientName('');
      setPhone('');
      setDoctorName('');
      setNotes('');
      setTitle('');
      setActiveTab('history');
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'প্রেসক্রিপশন আপলোড করতে সমস্যা হয়েছে' : 'Failed to upload prescription'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-teal-500/10 via-primary/10 to-blue-600/10 p-6 sm:p-10 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary mx-auto">
            <ShieldCheck className="h-4 w-4" />
            <span>{isBn ? '১০০% গোপনীয়তা ও ভেরিফায়েড ফার্মাসিস্ট সার্ভিস' : '100% Secure & Pharmacist Verified'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'অনলাইন প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription Online'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {isBn
              ? 'আপনার প্রেসক্রিপশনের স্পষ্ট ছবি বা পিডিএফ আপলোড করুন। আমাদের এ-গ্রেড গ্র্যাজুয়েট ফার্মাসিস্ট ভেরিফাই করে ওষুধ নির্বাচন ও দ্রুততম শিপিং সম্পন্ন করবেন।'
              : 'Upload a clear picture or PDF of your prescription. Our graduate pharmacists will review and dispatch your medicines promptly.'}
          </p>

          {/* Navigation Toggle Tabs */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>{isBn ? 'নতুন প্রেসক্রিপশন আপলোড' : 'Upload New Rx'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{isBn ? `সংরক্ষিত প্রেসক্রিপশন (${prescriptions.length})` : `Saved Prescriptions (${prescriptions.length})`}</span>
            </button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left: Upload Form (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-background p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" />
                <span>{isBn ? 'প্রেসক্রিপশন নথি যুক্ত করুন' : 'Attach Prescription Document'}</span>
              </h2>

              {/* Upload & Camera Input Options */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/20 py-2.5 text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isBn ? 'গ্যালারি থেকে পছন্দ করুন' : 'Browse Gallery / File'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>{isBn ? 'ক্যামেরা ফটো তুলুন' : 'Take Camera Photo'}</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-primary bg-primary-soft/30'
                    : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-primary-soft/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground truncate max-w-xs mx-auto">{selectedFile.name}</p>
                      <p className="text-[11px] text-muted-foreground">{selectedFile.size} • {selectedFile.type}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModalUrl(selectedFile.url);
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isBn ? 'প্রিভিউ দেখুন' : 'Preview Image'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-xs font-semibold text-danger hover:underline flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>{isBn ? 'মুছে ফেলুন' : 'Remove File'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {isBn ? 'ছবি ড্র্যাগ করুন অথবা ব্রাউজ করে নির্বাচন করুন' : 'Click to browse or drag & drop prescription'}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        JPG, PNG, WEBP, PDF (সর্বোচ্চ ১০ এমবি)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Sample Prescriptions Preset Loader */}
              {!selectedFile && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {isBn ? 'অথবা নমুনা প্রেসক্রিপশন ফাইল ব্যবহার করুন:' : 'Or use a sample prescription for testing:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {DEMO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-muted/30 text-left transition-all hover:border-primary/40 hover:bg-background"
                      >
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-foreground truncate">{preset.name}</p>
                          <p className="text-[10px] text-muted-foreground">{preset.size}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Details */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Patient Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'রোগীর নাম *' : 'Patient Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'যেমন: মোহাম্মদ রুহুল আমিন' : 'e.g. Ruhul Amin'}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'যোগাযোগ নম্বর *' : 'Contact Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={isBn ? '০১৭XXXXXXXX' : '017XXXXXXXX'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title / Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'প্রেসক্রিপশন শিরোনাম' : 'Prescription Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: ডায়াবেটিস ও প্রেশারের ওষুধ' : 'e.g. Diabetes & Routine Rx'}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Doctor Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'ডাক্তারের নাম (ঐচ্ছিক)' : 'Doctor Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: ডা. এ. কে. এম. শামসুল হুদা' : 'e.g. Dr. Shamsul Huda'}
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Additional Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {isBn ? 'বিশেষ নির্দেশনা বা ওষুধের পরিমাণ' : 'Special Notes or Medicine Quantity'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isBn ? 'নির্দিষ্ট কোনো ব্র্যান্ড বা ১ মাসের পুরো ডোজ চাইলে উল্লেখ করুন...' : 'Specify brand preferences or monthly supply details...'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isSubmitting ? (isBn ? 'আপলোড হচ্ছে...' : 'Submitting Rx...') : (isBn ? 'প্রেসক্রিপশন জমা দিন' : 'Submit Prescription Order')}</span>
                </button>
              </form>
            </div>

            {/* Right: Guidelines & Direct Call (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Process Steps */}
              <div className="rounded-3xl border border-border bg-muted/40 p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'সঠিক প্রেসক্রিপশনের নিয়মাবলী' : 'Valid Prescription Guidelines'}</span>
                </h3>

                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>{isBn ? 'ডাক্তারের নাম, নামফলক এবং সিল স্পষ্ট বোঝা যেতে হবে।' : 'Doctor’s registered credentials and seal must be visible.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>{isBn ? 'রোগীর নাম, বয়স ও প্রেসক্রিপশনের তারিখ পড়া যেতে হবে।' : 'Patient name, age, and prescription date should be clear.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>{isBn ? 'ওষুধের নাম ও সেবনমাত্রার ছবি ঝাপসা হওয়া যাবে না।' : 'Medicine titles and dosage instructions must not be blurred.'}</span>
                  </li>
                </ul>
              </div>

              {/* Phone Helpline Card */}
              <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-soft/50 to-background p-6 space-y-3 text-center">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto">
                  <Phone className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  {isBn ? 'প্রেসক্রিপশন পড়তে অসুবিধা হচ্ছে?' : 'Need Help With Prescription?'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'সরাসরি কল করে অথবা হোয়াটসঅ্যাপে আমাদের ফার্মাসিস্ট টিমকে ছবি পাঠান।' : 'Call directly or WhatsApp your prescription photo to our team.'}
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href={HOTLINE_TEL}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all"
                  >
                    <span>{isBn ? `কল করুন: ${HOTLINE_NUMBER}` : `Call Hotline: ${HOTLINE_NUMBER}`}</span>
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all"
                  >
                    <span>{isBn ? 'হোয়াটসঅ্যাপ সহায়তা' : 'WhatsApp Assistance'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Prescriptions History Tab */
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>{isBn ? 'আপনার আপলোডকৃত প্রেসক্রিপশন সমূহ' : 'Your Uploaded Prescriptions'}</span>
            </h2>

            {prescriptions.length === 0 ? (
              <div className="rounded-3xl border border-border bg-background p-10 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-muted-foreground">
                  {isBn ? 'আপনার কোনো সংরক্ষিত প্রেসক্রিপশন পাওয়া যায়নি।' : 'No saved prescriptions found.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isBn ? 'প্রথম প্রেসক্রিপশন আপলোড করুন' : 'Upload First Prescription'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((item: any) => (
                  <div
                    key={item._id || item.id}
                    className="rounded-2xl border border-border bg-background p-5 space-y-3 shadow-xs hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? 'প্রেসক্রিপশন আপলোড' : 'Uploaded Prescription'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-2">
                          {item.note || (isBn ? 'কোনো নোট দেওয়া হয়নি' : 'No notes provided')}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.rejectionReason && (
                      <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-100">
                        {isBn ? 'বাতিলের কারণ: ' : 'Reason: '}{item.rejectionReason}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.images && item.images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setPreviewModalUrl(item.images[0])}
                          className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-2xl w-full rounded-2xl bg-background p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'প্রেসক্রিপশন প্রিভিউ' : 'Prescription Preview'}</h3>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="rounded-full p-1 hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center rounded-xl bg-muted/30 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewModalUrl} alt="Prescription Preview" className="max-w-full h-auto rounded-lg object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
