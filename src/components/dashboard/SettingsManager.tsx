'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Globe,
  Palette,
  CreditCard,
  Truck,
  Search,
  FileText,
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Power,
  Upload,
  Sparkles,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import {
  settingsService,
  FullSiteSettings,
  DynamicPaymentMethod,
  DynamicDeliveryOption,
} from '@/services/settings.service';
import { useBranding } from '@/context/BrandingContext';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

const COLOR_PRESETS_PRIMARY = [
  { name: 'Royal Blue (Default)', hex: '#1D4ED8' },
  { name: 'Emerald Health', hex: '#059669' },
  { name: 'Teal Clinical', hex: '#0D9488' },
  { name: 'Indigo Care', hex: '#4F46E5' },
  { name: 'Violet Modern', hex: '#7C3AED' },
  { name: 'Ruby Health', hex: '#DC2626' },
  { name: 'Ocean Cyan', hex: '#0284C7' },
  { name: 'Forest Dark', hex: '#15803D' },
];

const COLOR_PRESETS_ACCENT = [
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Orange Vital', hex: '#F97316' },
  { name: 'Sky Electric', hex: '#0284C7' },
  { name: 'Rose Coral', hex: '#F43F5E' },
  { name: 'Emerald Mint', hex: '#10B981' },
];

export function SettingsManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { updateLocalPreview, refreshSettings } = useBranding();

  const [activeTab, setActiveTab] = useState<
    'general' | 'branding' | 'payment' | 'shipping' | 'seo' | 'legal' | 'maintenance'
  >('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPayLogo, setUploadingPayLogo] = useState(false);

  // Payment Method Modal States
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [editingPayMethod, setEditingPayMethod] = useState<DynamicPaymentMethod | null>(null);
  const [newPayMethod, setNewPayMethod] = useState<Partial<DynamicPaymentMethod>>({
    code: '',
    nameBn: '',
    nameEn: '',
    accountNumber: '',
    instructionsBn: '',
    instructionsEn: '',
    logo: '',
    isActive: true,
  });

  // New Delivery Option Modal State
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [newDelOption, setNewDelOption] = useState<Partial<DynamicDeliveryOption>>({
    code: '',
    nameBn: '',
    nameEn: '',
    charge: 60,
    estimatedDaysBn: '২ - ৩ কার্যদিবস',
    estimatedDaysEn: '2 - 3 Working Days',
    descriptionBn: '',
    isActive: true,
  });

  const [formData, setFormData] = useState<FullSiteSettings>({
    general: {
      siteName: 'mediShop',
      tagline: 'Online Pharmacy & Healthcare BD',
      logoLight: '/images/logo.png',
      favicon: '/favicon.ico',
      contactEmail: 'support@medishop.com.bd',
      contactPhone: '+880 1742-643763',
      address: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    },
    branding: {
      primaryColor: '#1D4ED8',
      accentColor: '#F59E0B',
      fontHeading: 'Inter',
      fontBody: 'Inter',
    },
    payment: {
      codEnabled: true,
      minOrderForCod: 0,
      enabledGateways: ['cod', 'bkash', 'nagad', 'card'],
      methods: [
        {
          id: 'pay_cod',
          code: 'cod',
          nameBn: 'ক্যাশ অন ডেলিভারি (পণ্য বুঝে টাকা দিন)',
          nameEn: 'Cash on Delivery',
          descriptionBn: 'পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করুন',
          isActive: true,
          isDefault: true,
        },
        {
          id: 'pay_bkash',
          code: 'bkash',
          nameBn: 'বিকাশ (bKash Instant)',
          nameEn: 'bKash Instant Payment',
          accountNumber: '01712345678',
          instructionsBn: 'বিকাশ মার্চেন্ট একাউন্টে মেক পেমেন্ট করুন',
          isActive: true,
        },
        {
          id: 'pay_nagad',
          code: 'nagad',
          nameBn: 'নগদ (Nagad Payment)',
          nameEn: 'Nagad Payment',
          accountNumber: '01712345678',
          isActive: true,
        },
        {
          id: 'pay_card',
          code: 'card',
          nameBn: 'কার্ড / ইন্টারনেট ব্যাংকিং (SSLCommerz)',
          nameEn: 'Visa / Mastercard / Net Banking',
          isActive: true,
        },
      ],
    },
    shipping: {
      freeShippingThreshold: 1000,
      defaultDeliveryChargeInsideDhaka: 60,
      defaultDeliveryChargeOutsideDhaka: 120,
      estimatedDeliveryDays: '2 - 4 working days',
      options: [
        {
          id: 'del_dhaka',
          code: 'inside_dhaka',
          nameBn: 'ঢাকার ভিতরে ডেলিভারি',
          nameEn: 'Inside Dhaka City',
          charge: 60,
          estimatedDaysBn: '২৪ - ৪৮ ঘণ্টা',
          estimatedDaysEn: '24 - 48 Hours',
          isActive: true,
          isDefault: true,
        },
        {
          id: 'del_outside',
          code: 'outside_dhaka',
          nameBn: 'ঢাকার বাইরে কুরিয়ার ডেলিভারি',
          nameEn: 'Outside Dhaka (All BD)',
          charge: 120,
          estimatedDaysBn: '২ - ৩ কার্যদিবস',
          estimatedDaysEn: '2 - 3 Working Days',
          isActive: true,
        },
      ],
    },
    seo: {
      defaultMetaTitle: 'mediShop — Online Pharmacy BD',
      defaultMetaDescription: 'Genuine medicine doorstep delivery in Bangladesh',
      ogImage: '/images/og-banner.png',
    },
    legal: {
      termsContent: 'Welcome to mediShop. By using our website, you agree to our terms and conditions. Prescriptions must be provided for Rx medications.',
      privacyContent: 'We protect your personal data and health information with strict confidentiality according to DGDA healthcare guidelines.',
      refundPolicyContent: 'Returns accepted within 7 days with original seal & invoice receipt.',
      invoiceTerms: 'Goods once sold are non-refundable unless damaged or incorrect. DGDA verified items.',
      warrantyPolicyContent: 'Manufacturer warranty applies where applicable with official invoice.',
    },
    maintenanceMode: false,
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getFullSettings();
      if (data) {
        setFormData({
          ...data,
          legal: data.legal || {
            termsContent: 'Welcome to mediShop. By using our website, you agree to our terms and conditions.',
            privacyContent: 'We protect your personal data and health information with strict confidentiality.',
            refundPolicyContent: 'Returns accepted within 7 days with original seal & invoice receipt.',
            invoiceTerms: 'Goods once sold are non-refundable unless damaged or incorrect.',
            warrantyPolicyContent: 'Manufacturer warranty applies where applicable.',
          },
        });
      }
    } catch (err: any) {
      console.error('Failed to load full settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handlePrimaryColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      branding: { ...prev.branding, primaryColor: color },
    }));
    updateLocalPreview({
      branding: {
        ...formData.branding,
        primaryColor: color,
      },
    });
  };

  const handleAccentColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      branding: { ...prev.branding, accentColor: color },
    }));
    updateLocalPreview({
      branding: {
        ...formData.branding,
        accentColor: color,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings(formData);
      if (updated) {
        toast.success(
          isBn
            ? 'সাইট সেটিংস ও থিম সফলভাবে সংরক্ষিত এবং সম্পূর্ণ ওয়েবসাইটে লাইভ হয়েছে!'
            : 'Site settings & theme saved successfully and published site-wide!'
        );
        await refreshSettings();
      }
    } catch (err: any) {
      toast.error(err.message || (isBn ? 'সেটিংস সেভ করতে সমস্যা হয়েছে' : 'Failed to save settings'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoLight' | 'logoDark' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await uploadService.uploadImage(file, 'general', false);
      setFormData((prev) => ({
        ...prev,
        general: { ...prev.general, [field]: res.url },
      }));
      updateLocalPreview({
        general: { ...formData.general, [field]: res.url },
      });
      toast.success(isBn ? 'লোগো সফলভাবে আপলোড হয়েছে!' : 'Logo uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Toggle Payment Method Active Status
  const togglePaymentMethodActive = (id: string) => {
    setFormData((prev) => {
      const methods = (prev.payment.methods || []).map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      );
      return {
        ...prev,
        payment: { ...prev.payment, methods },
      };
    });
  };

  // Upload Payment Logo
  const handlePaymentLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPayLogo(true);
      const res = await uploadService.uploadImage(file, 'general');
      if (res?.url) {
        if (isEdit && editingPayMethod) {
          setEditingPayMethod({ ...editingPayMethod, logo: res.url });
        } else {
          setNewPayMethod((prev) => ({ ...prev, logo: res.url }));
        }
        toast.success(isBn ? 'পেমেন্ট লোগো সফলভাবে আপলোড হয়েছে!' : 'Payment logo uploaded successfully!');
      }
    } catch {
      toast.error(isBn ? 'লোগো আপলোড ব্যর্থ হয়েছে' : 'Failed to upload logo');
    } finally {
      setUploadingPayLogo(false);
    }
  };

  // Add Payment Method
  const handleAddPaymentMethod = () => {
    if (!newPayMethod.nameBn || !newPayMethod.code) {
      toast.error(isBn ? 'পেমেন্ট পদ্ধতির নাম ও কোড দিন' : 'Please provide name and code');
      return;
    }

    const created: DynamicPaymentMethod = {
      id: `pay_${Date.now()}`,
      code: newPayMethod.code.toLowerCase().replace(/\s+/g, '_'),
      nameBn: newPayMethod.nameBn,
      nameEn: newPayMethod.nameEn || newPayMethod.nameBn,
      accountNumber: newPayMethod.accountNumber || '',
      instructionsBn: newPayMethod.instructionsBn || '',
      instructionsEn: newPayMethod.instructionsEn || '',
      logo: newPayMethod.logo || '',
      isActive: Boolean(newPayMethod.isActive),
    };

    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: [...(prev.payment.methods || []), created],
      },
    }));

    setNewPayMethod({ code: '', nameBn: '', nameEn: '', accountNumber: '', logo: '', isActive: true });
    setShowAddPaymentModal(false);
    toast.success(isBn ? 'নতুন পেমেন্ট পদ্ধতি যুক্ত হয়েছে!' : 'New payment method added!');
  };

  // Update Existing Payment Method
  const handleUpdatePaymentMethod = () => {
    if (!editingPayMethod || !editingPayMethod.nameBn || !editingPayMethod.code) {
      toast.error(isBn ? 'পেমেন্ট পদ্ধতির নাম ও কোড দিন' : 'Please provide name and code');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment.methods || []).map((m) =>
          m.id === editingPayMethod.id ? editingPayMethod : m
        ),
      },
    }));

    setEditingPayMethod(null);
    toast.success(isBn ? 'পেমেন্ট মেথড আপডেট হয়েছে!' : 'Payment method updated!');
  };

  // Delete Payment Method
  const handleDeletePaymentMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment.methods || []).filter((m) => m.id !== id),
      },
    }));
    toast.success(isBn ? 'পেমেন্ট পদ্ধতি মুছে ফেলা হয়েছে' : 'Payment method removed');
  };

  // Toggle Delivery Option Active Status
  const toggleDeliveryOptionActive = (id: string) => {
    setFormData((prev) => {
      const options = (prev.shipping.options || []).map((o) =>
        o.id === id ? { ...o, isActive: !o.isActive } : o
      );
      return {
        ...prev,
        shipping: { ...prev.shipping, options },
      };
    });
  };

  // Add Delivery Option
  const handleAddDeliveryOption = () => {
    if (!newDelOption.nameBn || !newDelOption.code) {
      toast.error(isBn ? 'ডেলিভারি অপশনের নাম ও কোড দিন' : 'Please provide name and code');
      return;
    }

    const created: DynamicDeliveryOption = {
      id: `del_${Date.now()}`,
      code: newDelOption.code.toLowerCase().replace(/\s+/g, '_'),
      nameBn: newDelOption.nameBn,
      nameEn: newDelOption.nameEn || newDelOption.nameBn,
      charge: Number(newDelOption.charge || 60),
      estimatedDaysBn: newDelOption.estimatedDaysBn || '২-৩ দিন',
      estimatedDaysEn: newDelOption.estimatedDaysEn || '2-3 Days',
      descriptionBn: newDelOption.descriptionBn || '',
      isActive: Boolean(newDelOption.isActive),
    };

    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        options: [...(prev.shipping.options || []), created],
      },
    }));

    setNewDelOption({ code: '', nameBn: '', nameEn: '', charge: 60, isActive: true });
    setShowAddDeliveryModal(false);
    toast.success(isBn ? 'নতুন ডেলিভারি অপশন যুক্ত হয়েছে!' : 'New delivery option added!');
  };

  // Delete Delivery Option
  const handleDeleteDeliveryOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        options: (prev.shipping.options || []).filter((o) => o.id !== id),
      },
    }));
    toast.success(isBn ? 'ডেলিভারি অপশন মুছে ফেলা হয়েছে' : 'Delivery option removed');
  };

  const navItems = [
    { id: 'general', label: isBn ? 'সাধারণ পরিচয় ও ব্র্যান্ড' : 'General Identity', icon: Globe },
    { id: 'branding', label: isBn ? 'থিম কালার ও ডিজাইন' : 'Theme & Colors', icon: Palette },
    { id: 'payment', label: isBn ? 'পেমেন্ট মেথডসমূহ' : 'Payment Methods', icon: CreditCard },
    { id: 'shipping', label: isBn ? 'ডেলিভারি অপশনসমূহ' : 'Delivery Options', icon: Truck },
    { id: 'seo', label: isBn ? 'এসইও (SEO)' : 'SEO & Meta', icon: Search },
    { id: 'legal', label: isBn ? 'শর্তাবলী ও পলিসি' : 'Terms & Policies', icon: FileText },
    { id: 'maintenance', label: isBn ? 'মেইনটেন্যান্স মোড' : 'Maintenance Mode', icon: ShieldAlert },
  ];

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
            {isBn ? 'সাইট সেটিংস ও কন্ট্রোল প্যানেল' : 'Site Settings & Control Center'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isBn
              ? 'ওয়েবসাইটের পরিচয়, লাইভ থিম কালার, পেমেন্ট মেথড ও পলিসি পেজ কনফিগার করুন'
              : 'Configure website branding, live theme colors, payment methods, and legal policies'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? (isBn ? 'সংরক্ষিত হচ্ছে...' : 'Saving...') : (isBn ? 'পরিবর্তন সেভ করুন' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Navigation Tabs */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-2 space-y-1 shadow-2xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Form Panels */}
        <div className="lg:col-span-9 rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-6">
          {/* GENERAL IDENTITY TAB */}
          {activeTab === 'general' && (
            <div className="space-y-5 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'সাধারণ ওয়েবসাইট পরিচয় ও যোগাযোগ' : 'General Site Identity & Contact Info'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Site Name / Brand:</label>
                  <input
                    type="text"
                    value={formData.general.siteName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, general: { ...formData.general, siteName: val } });
                      updateLocalPreview({ general: { ...formData.general, siteName: val } });
                    }}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Tagline / Subtitle:</label>
                  <input
                    type="text"
                    value={formData.general.tagline || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, general: { ...formData.general, tagline: val } });
                      updateLocalPreview({ general: { ...formData.general, tagline: val } });
                    }}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Contact Hotline Phone:</label>
                  <input
                    type="text"
                    value={formData.general.contactPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, general: { ...formData.general, contactPhone: val } });
                      updateLocalPreview({ general: { ...formData.general, contactPhone: val } });
                    }}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Support Email:</label>
                  <input
                    type="email"
                    value={formData.general.contactEmail}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, general: { ...formData.general, contactEmail: val } });
                      updateLocalPreview({ general: { ...formData.general, contactEmail: val } });
                    }}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-foreground mb-1">Physical Address (Office / Pharmacy):</label>
                  <input
                    type="text"
                    value={formData.general.address}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, general: { ...formData.general, address: val } });
                      updateLocalPreview({ general: { ...formData.general, address: val } });
                    }}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo & Brand Asset Upload */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <h4 className="font-bold text-foreground text-xs">
                  {isBn ? 'ওয়েবসাইট লোগো ও ফেভিকন (Sharp WebP আপলোড)' : 'Website Logo & Assets (Sharp WebP Upload)'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border p-3 space-y-2 bg-muted/20">
                    <label className="block font-bold text-foreground text-[11px]">Primary Logo:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.general.logoLight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, logoLight: e.target.value },
                          })
                        }
                        className="flex-1 rounded-xl border border-border bg-background p-2 text-xs"
                      />
                      <label className="flex items-center gap-1 cursor-pointer rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20">
                        {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingLogo}
                          className="hidden"
                          onChange={(e) => handleLogoUpload(e, 'logoLight')}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border p-3 space-y-2 bg-muted/20">
                    <label className="block font-bold text-foreground text-[11px]">Favicon URL:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.general.favicon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, favicon: e.target.value },
                          })
                        }
                        className="flex-1 rounded-xl border border-border bg-background p-2 text-xs"
                      />
                      <label className="flex items-center gap-1 cursor-pointer rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingLogo}
                          className="hidden"
                          onChange={(e) => handleLogoUpload(e, 'favicon')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THEME & BRANDING TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                  {isBn ? 'লাইভ ওয়েবসাইট থিম ও কালার কনফিগারেশন' : 'Live Theme Color & Branding Config'}
                </h3>
                <p className="text-muted-foreground text-[11px] mt-1">
                  {isBn
                    ? 'কালার পরিবর্তন করলে সাথে সাথে সম্পূর্ণ ওয়েবসাইটের বাটন, হেডার, টেক্সট ও একসেন্ট পরিবর্তিত হবে।'
                    : 'Theme color changes take effect immediately across all site buttons, badges, links, and accents.'}
                </p>
              </div>

              {/* Primary Theme Color Selection */}
              <div className="rounded-2xl border border-border p-4 space-y-3 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-extrabold text-foreground block">
                      {isBn ? '১. প্রধান ব্র্যান্ড কালার (Primary Brand Color)' : '1. Primary Brand Color'}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Current: <code className="font-bold text-foreground">{formData.branding.primaryColor}</code>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded-lg border border-border p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className="w-24 rounded-xl border border-border bg-background p-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Preset Primary Colors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
                  {COLOR_PRESETS_PRIMARY.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => handlePrimaryColorChange(p.hex)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                        formData.branding.primaryColor.toLowerCase() === p.hex.toLowerCase()
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.hex }} />
                      <span className="truncate text-[11px] font-bold text-foreground">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Highlight Color Selection */}
              <div className="rounded-2xl border border-border p-4 space-y-3 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-extrabold text-foreground block">
                      {isBn ? '২. একসেন্ট হাইলাইট কালার (Accent Color)' : '2. Accent Highlight Color'}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Current: <code className="font-bold text-foreground">{formData.branding.accentColor}</code>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.branding.accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded-lg border border-border p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.branding.accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="w-24 rounded-xl border border-border bg-background p-1.5 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Preset Accent Colors */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-border/60">
                  {COLOR_PRESETS_ACCENT.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => handleAccentColorChange(p.hex)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                        formData.branding.accentColor.toLowerCase() === p.hex.toLowerCase()
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.hex }} />
                      <span className="truncate text-[11px] font-bold text-foreground">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Live Theme Component Preview */}
              <div className="rounded-2xl border border-border p-5 bg-card space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-foreground text-xs">
                    {isBn ? 'লাইভ প্রিভিউ (আপনার নির্বাচিত রঙে UI উপাদানসমূহ)' : 'Live UI Theme Component Preview'}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark"
                  >
                    Primary Button
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border border-primary text-primary px-4 py-2 text-xs font-bold hover:bg-primary/10"
                  >
                    Outline Button
                  </button>

                  <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    Primary Badge
                  </span>

                  <span className="rounded-full bg-accent text-slate-900 px-3 py-1 text-xs font-bold shadow-2xs">
                    Accent Badge
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC PAYMENT METHODS TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    {isBn ? 'ডাইনামিক পেমেন্ট মেথডসমূহ' : 'Dynamic Payment Methods Management'}
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {isBn
                      ? 'অ্যাডমিন নতুন পেমেন্ট মেথড যুক্ত ও একটিভ/ইনএকটিভ করতে পারবেন'
                      : 'Add, enable/disable, or customize active checkout payment options'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'নতুন পেমেন্ট মেথড' : 'Add Payment Method'}</span>
                </button>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-3">
                {(formData.payment?.methods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      method.isActive
                        ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-border bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Logo Thumbnail / Icon */}
                      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background p-1 shadow-2xs overflow-hidden">
                        {method.logo && method.logo.trim() !== '' ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={method.logo}
                              alt={method.nameEn || method.code}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-primary">
                            {method.code}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-foreground text-sm">
                            {isBn ? method.nameBn : method.nameEn}
                          </span>
                          <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                            Code: {method.code}
                          </span>
                          {method.isActive ? (
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-black text-gray-600 dark:text-gray-400 border border-gray-300">
                              Inactive
                            </span>
                          )}
                        </div>

                        {method.accountNumber && (
                          <p className="text-primary font-bold text-[11px]">
                            Account/Number: {method.accountNumber}
                          </p>
                        )}
                        {method.instructionsBn && (
                          <p className="text-muted-foreground text-[11px]">
                            Instructions: {method.instructionsBn}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingPayMethod({ ...method })}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
                        title={isBn ? 'এডিট করুন' : 'Edit Method'}
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                        <span>{isBn ? 'এডিট' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePaymentMethodActive(method.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          method.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{method.isActive ? (isBn ? 'একটিভ' : 'Active') : (isBn ? 'ইনএকটিভ' : 'Inactive')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Method"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Payment Method Modal */}
              {showAddPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-3xl bg-background p-6 space-y-4 shadow-xl border border-border max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <h4 className="text-base font-extrabold text-foreground border-b border-border pb-2">
                      {isBn ? 'নতুন পেমেন্ট মেথড যুক্ত করুন' : 'Add New Payment Method'}
                    </h4>

                    <div className="space-y-3 text-xs">
                      {/* Logo Upload Section */}
                      <div>
                        <label className="block font-bold text-foreground mb-1">Payment Method Logo (Optional):</label>
                        <div className="flex items-center gap-3">
                          {newPayMethod.logo ? (
                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                              <Image
                                src={newPayMethod.logo}
                                alt="Logo"
                                fill
                                sizes="80px"
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}

                          <div className="flex-1 space-y-1">
                            <label className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white cursor-pointer transition-all">
                              {uploadingPayLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                              <span>{uploadingPayLogo ? (isBn ? 'আপলোড হচ্ছে...' : 'Uploading...') : (isBn ? 'লোগো আপলোড করুন' : 'Upload Logo')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePaymentLogoUpload(e, false)}
                                className="hidden"
                              />
                            </label>
                            {newPayMethod.logo && (
                              <button
                                type="button"
                                onClick={() => setNewPayMethod({ ...newPayMethod, logo: '' })}
                                className="block text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                              >
                                {isBn ? 'লোগো রিমুভ' : 'Remove logo'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Method Code (Unique identifier):</label>
                        <input
                          type="text"
                          placeholder="e.g. bkash, nagad, rocket, cod"
                          value={newPayMethod.code || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, code: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. বিকাশ (bKash Instant)"
                          value={newPayMethod.nameBn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, nameBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (English):</label>
                        <input
                          type="text"
                          placeholder="e.g. bKash Payment"
                          value={newPayMethod.nameEn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, nameEn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Account / Merchant Number (Optional):</label>
                        <input
                          type="text"
                          placeholder="e.g. 01712345678"
                          value={newPayMethod.accountNumber || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, accountNumber: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Instructions (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. বিকাশ মার্চেন্ট নম্বরে মেক পেমেন্ট করুন"
                          value={newPayMethod.instructionsBn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, instructionsBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(false)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPaymentMethod}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
                      >
                        Save Method
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Payment Method Modal */}
              {editingPayMethod && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-3xl bg-background p-6 space-y-4 shadow-xl border border-border max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <h4 className="text-base font-extrabold text-foreground border-b border-border pb-2">
                      {isBn ? 'পেমেন্ট মেথড এডিট করুন' : 'Edit Payment Method'}
                    </h4>

                    <div className="space-y-3 text-xs">
                      {/* Logo Upload Section */}
                      <div>
                        <label className="block font-bold text-foreground mb-1">Payment Method Logo:</label>
                        <div className="flex items-center gap-3">
                          {editingPayMethod.logo ? (
                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                              <Image
                                src={editingPayMethod.logo}
                                alt="Logo"
                                fill
                                sizes="80px"
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}

                          <div className="flex-1 space-y-1">
                            <label className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white cursor-pointer transition-all">
                              {uploadingPayLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                              <span>{uploadingPayLogo ? (isBn ? 'আপলোড হচ্ছে...' : 'Uploading...') : (isBn ? 'লোগো পরিবর্তন করুন' : 'Upload / Change Logo')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePaymentLogoUpload(e, true)}
                                className="hidden"
                              />
                            </label>
                            {editingPayMethod.logo && (
                              <button
                                type="button"
                                onClick={() => setEditingPayMethod({ ...editingPayMethod, logo: '' })}
                                className="block text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                              >
                                {isBn ? 'লোগো রিমুভ' : 'Remove logo'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Method Code:</label>
                        <input
                          type="text"
                          value={editingPayMethod.code || ''}
                          onChange={(e) => setEditingPayMethod({ ...editingPayMethod, code: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (Bangla):</label>
                        <input
                          type="text"
                          value={editingPayMethod.nameBn || ''}
                          onChange={(e) => setEditingPayMethod({ ...editingPayMethod, nameBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (English):</label>
                        <input
                          type="text"
                          value={editingPayMethod.nameEn || ''}
                          onChange={(e) => setEditingPayMethod({ ...editingPayMethod, nameEn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Account / Merchant Number (Optional):</label>
                        <input
                          type="text"
                          value={editingPayMethod.accountNumber || ''}
                          onChange={(e) => setEditingPayMethod({ ...editingPayMethod, accountNumber: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Instructions (Bangla):</label>
                        <input
                          type="text"
                          value={editingPayMethod.instructionsBn || ''}
                          onChange={(e) => setEditingPayMethod({ ...editingPayMethod, instructionsBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setEditingPayMethod(null)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdatePaymentMethod}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer"
                      >
                        {isBn ? 'আপডেট সম্পন্ন করুন' : 'Update Method'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC DELIVERY OPTIONS TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    {isBn ? 'ডাইনামিক ডেলিভারি অপশনসমূহ' : 'Dynamic Delivery Options Management'}
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {isBn
                      ? 'অ্যাডমিন নতুন ডেলিভারি অপশন, ফি (৳) ও সময়সীমা সেট ও একটিভ করতে পারবেন'
                      : 'Customize delivery options, rates, and active shipping zones'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddDeliveryModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'নতুন ডেলিভারি অপশন' : 'Add Delivery Option'}</span>
                </button>
              </div>

              {/* Delivery Options List */}
              <div className="space-y-3">
                {(formData.shipping?.options || []).map((option) => (
                  <div
                    key={option.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      option.isActive
                        ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-border bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm">
                          {isBn ? option.nameBn : option.nameEn}
                        </span>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary text-[11px]">
                          Charge: ৳{option.charge}
                        </span>
                        {option.isActive ? (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-black text-gray-600 dark:text-gray-400 border border-gray-300">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-[11px]">
                        Estimated Delivery: <strong className="text-foreground">{option.estimatedDaysBn || option.estimatedDaysEn}</strong>
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleDeliveryOptionActive(option.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          option.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{option.isActive ? (isBn ? 'একটিভ' : 'Active') : (isBn ? 'ইনএকটিভ' : 'Inactive')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDeliveryOption(option.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Delivery Option Modal */}
              {showAddDeliveryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-3xl bg-background p-6 space-y-4 shadow-xl border border-border">
                    <h4 className="text-base font-extrabold text-foreground border-b border-border pb-2">
                      {isBn ? 'নতুন ডেলিভারি অপশন যুক্ত করুন' : 'Add New Delivery Option'}
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Code (Unique identifier):</label>
                        <input
                          type="text"
                          placeholder="e.g. inside_dhaka, express, pickup"
                          value={newDelOption.code || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, code: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Name (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. ঢাকার ভিতরে ডেলিভারি"
                          value={newDelOption.nameBn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, nameBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Name (English):</label>
                        <input
                          type="text"
                          placeholder="e.g. Inside Dhaka Delivery"
                          value={newDelOption.nameEn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, nameEn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Delivery Charge (৳):</label>
                        <input
                          type="number"
                          value={newDelOption.charge || 60}
                          onChange={(e) => setNewDelOption({ ...newDelOption, charge: Number(e.target.value) })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Estimated Days (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. ২-৩ কার্যদিবস"
                          value={newDelOption.estimatedDaysBn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, estimatedDaysBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setShowAddDeliveryModal(false)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddDeliveryOption}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                      >
                        Save Option
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'এসইও ও মেটা ফিল্ডস' : 'SEO & Meta Configuration'}
              </h3>

              <div>
                <label className="block font-bold text-foreground mb-1">Default Meta Title:</label>
                <input
                  type="text"
                  value={formData.seo.defaultMetaTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultMetaTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Default Meta Description:</label>
                <textarea
                  rows={2}
                  value={formData.seo.defaultMetaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultMetaDescription: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TERMS & LEGAL POLICIES TAB */}
          {activeTab === 'legal' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                  {isBn ? 'শর্তাবলী ও লিগ্যাল পলিসি কনটেন্ট' : 'Legal Terms & Policy Content'}
                </h3>
                <p className="text-muted-foreground text-[11px] mt-1">
                  {isBn
                    ? 'এখানে পরিবর্তন করলে /terms, /privacy, /refund-policy পেজসমূহে তাৎক্ষণিক আপডেট হবে।'
                    : 'Changes here update the /terms, /privacy, and /refund-policy pages immediately.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Terms & Conditions Policy (শর্তাবলী):</label>
                <textarea
                  rows={4}
                  value={formData.legal.termsContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, termsContent: e.target.value },
                    })
                  }
                  placeholder="Terms and conditions text..."
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Privacy Policy (গোপনীয়তা নীতি):</label>
                <textarea
                  rows={4}
                  value={formData.legal.privacyContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, privacyContent: e.target.value },
                    })
                  }
                  placeholder="Privacy policy text..."
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Return & Refund Policy (ফেরত ও রিফান্ড নীতি):</label>
                <textarea
                  rows={3}
                  value={formData.legal.refundPolicyContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, refundPolicyContent: e.target.value },
                    })
                  }
                  placeholder="Return and refund terms..."
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Invoice Sale Terms (ইনভয়েস শর্ত):</label>
                  <input
                    type="text"
                    value={formData.legal.invoiceTerms || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        legal: { ...formData.legal, invoiceTerms: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Warranty Policy Summary (ওয়ারেন্টি):</label>
                  <input
                    type="text"
                    value={formData.legal.warrantyPolicyContent || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        legal: { ...formData.legal, warrantyPolicyContent: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PLATFORM MAINTENANCE MODE TAB */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'মেডিকেল প্ল্যাটফর্ম মেইনটেন্যান্স' : 'Platform Maintenance Mode'}
              </h3>

              <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 p-4">
                <div>
                  <span className="font-extrabold text-rose-900 dark:text-rose-300 block">Maintenance Mode Switch</span>
                  <span className="text-[11px] text-rose-700 dark:text-rose-400">
                    {isBn
                      ? 'জরুরী রক্ষণাবেক্ষণের জন্য সাময়িকভাবে কাস্টমার অর্ডার স্থগিত রাখুন'
                      : 'Temporarily pause customer orders for system updates'}
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="h-5 w-5 rounded border-rose-300 text-rose-600 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
