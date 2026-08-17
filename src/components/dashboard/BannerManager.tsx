'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  Save,
  Loader2,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import { settingsService, BannerSlide } from '@/services/settings.service';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

export function BannerManager() {
  const queryClient = useQueryClient();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [banners, setBanners] = useState<BannerSlide[]>([]);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleBn: '',
    subtitleEn: '',
    subtitleBn: '',
    badgeEn: '',
    badgeBn: '',
    ctaTextEn: 'Order Now',
    ctaTextBn: 'অর্ডার করুন',
    ctaLink: '/products',
    priority: '1',
    image: '',
  });

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const fullSettings = await settingsService.getFullSettings();
      if (fullSettings && fullSettings.banners && Array.isArray(fullSettings.banners)) {
        // Sort by priority ascending
        const sorted = [...fullSettings.banners].sort(
          (a, b) => (a.priority || 1) - (b.priority || 1)
        );
        setBanners(sorted);
      } else {
        setBanners([]);
      }
    } catch (err: any) {
      console.error('Failed to load site banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    const nextPriority = banners.length > 0 ? Math.max(...banners.map((b) => b.priority || 0)) + 1 : 1;
    setFormData({
      titleEn: '',
      titleBn: '',
      subtitleEn: '',
      subtitleBn: '',
      badgeEn: '',
      badgeBn: '',
      ctaTextEn: 'Order Now',
      ctaTextBn: 'অর্ডার করুন',
      ctaLink: '/products',
      priority: String(nextPriority),
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: BannerSlide) => {
    setEditingBanner(slide);
    setFormData({
      titleEn: slide.titleEn || '',
      titleBn: slide.titleBn || '',
      subtitleEn: slide.subtitleEn || '',
      subtitleBn: slide.subtitleBn || '',
      badgeEn: slide.badgeEn || '',
      badgeBn: slide.badgeBn || '',
      ctaTextEn: slide.ctaTextEn || 'Order Now',
      ctaTextBn: slide.ctaTextBn || 'অর্ডার করুন',
      ctaLink: slide.ctaLink || '/products',
      priority: String(slide.priority || 1),
      image: slide.image || '',
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    toast.success(isBn ? 'ব্যানার স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'Banner status updated');
  };

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      // Auto normalize priorities
      return filtered.map((b, idx) => ({ ...b, priority: idx + 1 }));
    });
    toast.success(isBn ? 'ব্যানার সরানো হয়েছে' : 'Banner removed');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setBanners((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      // Re-index priority sequentially
      return copy.map((b, idx) => ({ ...b, priority: idx + 1 }));
    });
    toast.success(isBn ? 'প্রায়োরিটি উপরে নেওয়া হয়েছে' : 'Moved up in priority');
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    setBanners((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      // Re-index priority sequentially
      return copy.map((b, idx) => ({ ...b, priority: idx + 1 }));
    });
    toast.success(isBn ? 'প্রায়োরিটি নিচে নেওয়া হয়েছে' : 'Moved down in priority');
  };

  const handleSaveToDB = async () => {
    setSaving(true);
    try {
      // Ensure priorities are strictly normalized and sorted
      const normalizedBanners = banners.map((b, idx) => ({
        ...b,
        priority: b.priority || idx + 1,
      }));

      await settingsService.updateSettings({
        banners: normalizedBanners,
      } as any);
      // Invalidate hero slides cache so homepage updates immediately
      await queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast.success(
        isBn
          ? 'সকল ব্যানার ডাটাবেজে সফলভাবে সংরক্ষিত ও হোমপেজে লাইভ হয়েছে!'
          : 'Banners saved to database & published live on Homepage!'
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save banners to DB');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadService.uploadBanner(file);
      setFormData((prev) => ({ ...prev, image: result.url }));
      toast.success(isBn ? 'ছবি WebP ফরম্যাটে অপ্টিমাইজ ও আপলোড হয়েছে!' : 'Image optimized to WebP & uploaded!');
    } catch (err: any) {
      toast.error(err?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.subtitleEn) {
      toast.error(isBn ? 'শিরোনাম ও সাবটাইটেল আবশ্যক' : 'Title and Subtitle are required');
      return;
    }

    if (editingBanner) {
      // Edit existing banner
      setBanners((prev) => {
        const updated = prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                titleEn: formData.titleEn,
                titleBn: formData.titleBn || formData.titleEn,
                subtitleEn: formData.subtitleEn,
                subtitleBn: formData.subtitleBn || formData.subtitleEn,
                badgeEn: formData.badgeEn,
                badgeBn: formData.badgeBn || formData.badgeEn,
                ctaTextEn: formData.ctaTextEn || 'Order Now',
                ctaTextBn: formData.ctaTextBn || 'অর্ডার করুন',
                ctaLink: formData.ctaLink || '/products',
                priority: Number(formData.priority) || b.priority || 1,
                image: formData.image || b.image,
              }
            : b
        );
        return updated.sort((a, b) => (a.priority || 1) - (b.priority || 1));
      });
      toast.success(isBn ? 'ব্যানার আপডেট হয়েছে! পরিবর্তন সেভ করতে "ব্যানার সেভ করুন" চাপুন।' : 'Banner updated! Click "Save Banners" to publish live.');
    } else {
      // Add new banner
      const newSlide: BannerSlide = {
        id: `banner_${Date.now()}`,
        titleEn: formData.titleEn,
        titleBn: formData.titleBn || formData.titleEn,
        subtitleEn: formData.subtitleEn,
        subtitleBn: formData.subtitleBn || formData.subtitleEn,
        badgeEn: formData.badgeEn,
        badgeBn: formData.badgeBn || formData.badgeEn,
        ctaTextEn: formData.ctaTextEn || 'Order Now',
        ctaTextBn: formData.ctaTextBn || 'অর্ডার করুন',
        ctaLink: formData.ctaLink || '/products',
        isActive: true,
        priority: Number(formData.priority) || banners.length + 1,
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop',
      };

      setBanners((prev) => {
        const updated = [...prev, newSlide];
        return updated.sort((a, b) => (a.priority || 1) - (b.priority || 1));
      });
      toast.success(isBn ? 'নতুন হিরো ব্যানার যুক্ত হয়েছে! পরিবর্তন সেভ করতে "ব্যানার সেভ করুন" চাপুন।' : 'Banner added! Click "Save Banners" to publish live.');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground font-serif-title">
            {isBn ? 'হিরো ব্যানার ও স্লাইডার ম্যানেজার' : 'Hero Banner Manager'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'হোমপেজ স্লাইডার টেক্সট, পিকচার ও প্রমোশনাল বাটন লিংক কাস্টমাইজ করুন'
              : 'Customize homepage hero carousel slides, promotions & call-to-actions'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-black text-primary hover:bg-primary/20 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{isBn ? 'নতুন স্লাইড' : 'Add Slide'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDB}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-primary-dark cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? (isBn ? 'সংরক্ষিত হচ্ছে...' : 'Saving...') : (isBn ? 'ব্যানার সেভ করুন' : 'Save Banners')}</span>
          </button>
        </div>
      </div>

      {/* Banner List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center bg-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isBn ? 'কোনো কাস্টম ব্যানার নেই' : 'No Custom Banners Found'}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {isBn
              ? 'হোমপেজে ডিফল্ট স্লাইড প্রদর্শিত হচ্ছে। নতুন ব্যানার যুক্ত করতে উপরের বাটনে চাপুন।'
              : 'Default hero slides are active on the homepage. Click "+ Add Slide" to create custom promotional slides.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isBn ? 'প্রথম ব্যানার যোগ করুন' : 'Add First Banner'}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {banners.map((slide, index) => (
            <div
              key={slide.id || index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors shadow-2xs"
            >
              {/* Left Column: Image & Order Controls */}
              <div className="flex items-center gap-3">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    title="Move Down"
                    className="p-1 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Banner Image Preview */}
                <div className="relative h-24 w-40 sm:w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                  <Image
                    src={slide.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600'}
                    alt={slide.titleEn}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Middle Column: Banner Meta Info */}
              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black text-primary border border-primary/30">
                    Priority #{slide.priority || index + 1}
                  </span>
                  {(slide.badgeEn || slide.badgeBn) && (
                    <span className="rounded-full bg-amber-500/15 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-black text-amber-900 dark:text-amber-300 border border-amber-500/40 shadow-2xs">
                      {isBn ? slide.badgeBn || slide.badgeEn : slide.badgeEn}
                    </span>
                  )}
                </div>

                <h3 className="truncate text-sm font-black text-foreground">
                  {isBn ? slide.titleBn || slide.titleEn : slide.titleEn}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {isBn ? slide.subtitleBn || slide.subtitleEn : slide.subtitleEn}
                </p>

                <div className="flex items-center gap-4 text-xs font-bold text-primary">
                  <span>CTA: {isBn ? slide.ctaTextBn || slide.ctaTextEn : slide.ctaTextEn}</span>
                  <span className="text-muted-foreground font-normal">Link: {slide.ctaLink}</span>
                </div>
              </div>

              {/* Right Column: Actions (Edit, Active Toggle, Delete) */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(slide)}
                  className="flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
                  title="Edit Banner Details"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>{isBn ? 'এডিট' : 'Edit'}</span>
                </button>

                {/* Active Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer shadow-xs ${
                    slide.isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {slide.isActive ? (isBn ? 'সচল' : 'Active') : (isBn ? 'বন্ধ' : 'Inactive')}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteBanner(slide.id)}
                  className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-2 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors shadow-xs"
                  title="Delete Banner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {editingBanner
                    ? (isBn ? 'হিরো ব্যানার এডিট করুন' : 'Edit Hero Banner Slide')
                    : (isBn ? 'নতুন হিরো ব্যানার যোগ করুন' : 'Add New Hero Banner Slide')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5 mt-4 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Headline (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. 100% Authentic Medicines Delivered"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Headline (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="যেমন: ১০০% আসল প্রেসক্রিপশন ও ওটিসি ওষুধ"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Subtitle (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    placeholder="e.g. Verified by registered pharmacists. Express same-day delivery."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Subtitle (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleBn}
                    onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                    placeholder="যেমন: রেজিস্টার্ড ফার্মাসিস্ট দ্বারা যাচাইকৃত। ঢাকায় দ্রুততম হোম ডেলিভারি।"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={formData.badgeEn}
                      onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                      placeholder="e.g. DGDA Licensed"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Priority Number</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.ctaTextBn}
                      onChange={(e) => setFormData({ ...formData, ctaTextBn: e.target.value })}
                      placeholder="অর্ডার করুন"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">CTA Target Link</label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      placeholder="/products"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Banner Background Image Upload via Sharp */}
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    {isBn ? 'স্লাইড ব্যাকগ্রাউন্ড ছবি (Sharp WebP আপলোড)' : 'Slide Background Image (Sharp WebP Upload)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL or upload banner image..."
                      className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                    <label className="flex items-center gap-1.5 cursor-pointer rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors">
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-2 relative h-16 w-32 rounded-lg overflow-hidden border border-border">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-black text-white hover:bg-primary-dark shadow-md cursor-pointer transition-colors"
                  >
                    {editingBanner ? (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes') : (isBn ? 'স্লাইড যোগ করুন' : 'Add Banner Slide')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
