'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User as UserIcon,
  Package,
  Heart,
  FileText,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Edit2,
  Plus,
  Trash2,
  ShoppingCart,
  Upload,
  ArrowRight,
  Sparkles,
  ChevronRight,
  X,
  FileUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useCart } from '@/hooks/useCart';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { formatPrice } from '@/utils/cart';
import { toast } from 'sonner';

type ProfileTab = 'profile' | 'orders' | 'wishlist' | 'prescriptions' | 'addresses';

const USER_PROFILE_STORAGE_KEY = 'medishop_user_profile_v1';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { orders } = useOrders();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { prescriptions, addPrescription, deletePrescription } = usePrescriptions();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Form State
  const [name, setName] = useState('Mohammad Ruhul Amin');
  const [phone, setPhone] = useState('01712345678');
  const [email, setEmail] = useState('ruhul@example.com');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('01898765432');

  // Prescription Upload Modal state
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [rxTitle, setRxTitle] = useState('');
  const [rxDoctor, setRxDoctor] = useState('');

  // Load / Persist profile data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.bloodGroup) setBloodGroup(parsed.bloodGroup);
        if (parsed.emergencyPhone) setEmergencyPhone(parsed.emergencyPhone);

        dispatch(
          setUser({
            id: parsed.id || 'usr-101',
            name: parsed.name,
            phone: parsed.phone,
            email: parsed.email,
          })
        );
      } else if (reduxUser) {
        if (reduxUser.name) setName(reduxUser.name);
        if (reduxUser.phone) setPhone(reduxUser.phone);
        if (reduxUser.email) setEmail(reduxUser.email);
      }
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
  }, [dispatch, reduxUser]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      id: 'usr-101',
      name,
      phone,
      email,
      gender,
      bloodGroup,
      emergencyPhone,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );
    }

    dispatch(setUser(updatedProfile));
    toast.success(
      isBn
        ? 'প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!'
        : 'Profile details updated successfully!'
    );
  };

  const handleUploadRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxTitle.trim()) {
      toast.error(isBn ? 'প্রেসক্রিপশনের শিরোনাম দিন' : 'Enter prescription title');
      return;
    }
    addPrescription({
      title: rxTitle.trim(),
      doctorName: rxDoctor.trim() || 'Consultant Physician',
      patientName: name,
      fileSize: '1.4 MB',
      fileType: 'PDF Document',
      fileUrl:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    });
    setRxTitle('');
    setRxDoctor('');
    setIsRxModalOpen(false);
  };

  const tabs: { id: ProfileTab; labelEn: string; labelBn: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'profile', labelEn: 'Profile Info', labelBn: 'প্রোফাইল তথ্য', icon: <UserIcon className="h-4 w-4" /> },
    { id: 'orders', labelEn: 'My Orders', labelBn: 'আমার অর্ডারসমূহ', icon: <Package className="h-4 w-4" />, count: orders.length },
    { id: 'wishlist', labelEn: 'Wishlist', labelBn: 'উইশলিস্ট', icon: <Heart className="h-4 w-4" />, count: wishlistItems.length },
    { id: 'prescriptions', labelEn: 'Prescriptions', labelBn: 'প্রেসক্রিপশন ফাইলস', icon: <FileText className="h-4 w-4" />, count: prescriptions.length },
    { id: 'addresses', labelEn: 'Shipping Addresses', labelBn: 'ডেলিভারি ঠিকানা', icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">{isBn ? 'মাই প্রোফাইল' : 'My Profile'}</span>
        </nav>

        {/* User Hero Header Banner */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-sky-400 text-2xl font-black text-white shadow-md ring-4 ring-primary/10">
              {name ? name.charAt(0).toUpperCase() : 'U'}
              <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs" title="Verified Customer">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">{name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  {isBn ? 'ডিজিডিএ ভেরিফাইড পেশেন্ট' : 'Verified DGDA Account'}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none rounded-2xl bg-muted/40 p-3.5 text-center border border-border min-w-[90px]">
              <p className="text-lg font-black text-primary">{orders.length}</p>
              <p className="text-[11px] font-bold text-muted-foreground">{isBn ? 'অর্ডার' : 'Orders'}</p>
            </div>

            <div className="flex-1 md:flex-none rounded-2xl bg-muted/40 p-3.5 text-center border border-border min-w-[90px]">
              <p className="text-lg font-black text-rose-600">{wishlistItems.length}</p>
              <p className="text-[11px] font-bold text-muted-foreground">{isBn ? 'উইশলিস্ট' : 'Wishlist'}</p>
            </div>

            <div className="flex-1 md:flex-none rounded-2xl bg-muted/40 p-3.5 text-center border border-border min-w-[90px]">
              <p className="text-lg font-black text-emerald-600">{prescriptions.length}</p>
              <p className="text-[11px] font-bold text-muted-foreground">{isBn ? 'প্রেসক্রিপশন' : 'Prescriptions'}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-background border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted text-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Section */}
        <div className="space-y-6">
          {/* 1. Profile Update Form */}
          {activeTab === 'profile' && (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground font-serif-title">
                    {isBn ? 'প্রোফাইল তথ্য পরিবর্তন করুন' : 'Update Personal Information'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isBn ? 'আপনার সঠিক তথ্য আপডেট রাখুন যাতে ওষুধ ডেলিভারিতে সুবিধা হয়' : 'Keep your medical profile updated for seamless prescription verification'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'পূর্ণ নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'লিঙ্গ' : 'Gender'}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Male">Male (পুরুষ)</option>
                      <option value="Female">Female (নারী)</option>
                      <option value="Other">Other (অন্যান্য)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {isBn ? 'জরুরি পরিচিতির মোবাইল' : 'Emergency Contact Phone'}
                    </label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. My Orders Tab */}
          {activeTab === 'orders' && (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-base font-bold text-foreground font-serif-title">
                  {isBn ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Order History'}
                </h3>
                <Link href="/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <span>{isBn ? 'সকল অর্ডার তালিকা' : 'View Full History'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground">{isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No orders found'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-muted/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-foreground">{ord.orderNumber}</span>
                          <OrderStatusBadge status={ord.orderStatus} isBn={isBn} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {ord.items.length} {isBn ? 'টি আইটেম' : 'items'} • {formatPrice(ord.summary.grandTotal, isBn ? 'bn' : 'en')}
                        </p>
                      </div>

                      <Link
                        href={`/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>{isBn ? 'ট্র্যাকিং & ইনভয়েস' : 'Track & Invoice'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-foreground font-serif-title pb-4 border-b border-border">
                {isBn ? 'আপনার উইশলিস্টে থাকা ওষুধসমূহ' : 'Your Saved Wishlist Items'} ({wishlistItems.length})
              </h3>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground">{isBn ? 'উইশলিস্ট খালি' : 'Wishlist is empty'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-xs hover:shadow-md transition-all">
                      <div>
                        <div className="relative h-32 w-full mb-3 rounded-xl overflow-hidden bg-muted/20 border border-border p-2">
                          <Image src={item.image} alt={isBn ? item.nameBn : item.nameEn} fill className="object-contain" />
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.brand}</p>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{isBn ? item.nameBn : item.nameEn}</h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-extrabold text-primary">{formatPrice(item.price, isBn ? 'bn' : 'en')}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              addToCart({
                                productId: item.id,
                                slug: item.slug,
                                nameBn: item.nameBn,
                                nameEn: item.nameEn,
                                brand: item.brand,
                                image: item.image,
                                unit: item.unit,
                                sellingPrice: item.price,
                                mrp: item.mrp,
                                prescriptionRequired: item.requiresRx,
                                stock: item.stockCount,
                                quantity: 1,
                              })
                            }
                            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            title={isBn ? 'কার্টে যোগ করুন' : 'Add to cart'}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title={isBn ? 'সরান' : 'Remove'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Saved Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground font-serif-title">
                    {isBn ? 'সংরক্ষিত প্রেসক্রিপশন' : 'Saved Prescriptions'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn ? 'আপনার আপলোডকৃত মেডিকেল প্রেসক্রিপশনের কপি' : 'Your verified doctor prescriptions for quick order refills'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRxModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'প্রেসক্রিপশন যোগ করুন' : 'Add Prescription'}</span>
                </button>
              </div>

              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground">{isBn ? 'কোনো প্রেসক্রিপশন সংরক্ষিত নেই' : 'No saved prescriptions'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground line-clamp-1">{rx.title}</h4>
                            <p className="text-[11px] text-muted-foreground">{rx.doctorName}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deletePrescription(rx.id)}
                          className="text-muted-foreground hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                        <span>Date: {rx.uploadDate}</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {rx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Saved Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-xs">
              <AddressSelector isBn={isBn} />
            </div>
          )}
        </div>
      </div>

      {/* Upload Rx Modal */}
      {isRxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsRxModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'নতুন প্রেসক্রিপশন ফাইল যোগ করুন' : 'Add New Prescription File'}</h3>
              <button onClick={() => setIsRxModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadRxSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{isBn ? 'প্রেসক্রিপশনের শিরোনাম *' : 'Prescription Title *'}</label>
                <input
                  type="text"
                  value={rxTitle}
                  onChange={(e) => setRxTitle(e.target.value)}
                  placeholder={isBn ? 'যেমন: ডায়াবেটিস রুটিন টেস্ট' : 'e.g. Daily Routine Prescription'}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground focus:border-primary focus:bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{isBn ? 'ডাক্তার বা হাসপাতালের নাম' : 'Doctor / Hospital Name'}</label>
                <input
                  type="text"
                  value={rxDoctor}
                  onChange={(e) => setRxDoctor(e.target.value)}
                  placeholder={isBn ? 'যেমন: স্কয়ার হাসপাতাল' : 'e.g. Square Hospital'}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground focus:border-primary focus:bg-background"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/20">
                <FileUp className="h-8 w-8 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">{isBn ? 'ফাইল সিলেক্ট করতে ক্লিক করুন' : 'Click to select prescription file'}</p>
                <p className="text-[10px] text-muted-foreground">PDF, JPEG, PNG (Max 5MB)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsRxModalOpen(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs">
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
