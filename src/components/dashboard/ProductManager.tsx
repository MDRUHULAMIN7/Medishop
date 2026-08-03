'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  X,
  Package,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductItem {
  id: string;
  nameBn: string;
  nameEn: string;
  genericName: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  image?: string;
}

export function ProductManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'p-1',
      nameBn: 'নাপা এক্সট্রা ৫০মগ্র',
      nameEn: 'Napa Extra 500mg+65mg Tablet',
      genericName: 'Paracetamol + Caffeine',
      category: 'OTC Medicines',
      brand: 'Beximco Pharmaceuticals',
      price: 25,
      discountPrice: 22,
      stock: 450,
      isPrescriptionRequired: false,
      isActive: true,
      image: '/images/products/napa-extra.webp',
    },
    {
      id: 'p-2',
      nameBn: 'সারজেল ২০মগ্র ক্যাপসুল',
      nameEn: 'Sergel 20mg Capsule',
      genericName: 'Esomeprazole Magnesium',
      category: 'Prescription Medicines',
      brand: 'Healthcare Pharmaceuticals',
      price: 70,
      stock: 120,
      isPrescriptionRequired: true,
      isActive: true,
      image: '/images/products/sergel.webp',
    },
    {
      id: 'p-3',
      nameBn: 'ওয়ানটাচ সিলেক্ট প্লাস টেস্ট স্ট্রিপ',
      nameEn: 'OneTouch Select Plus Test Strips (25s)',
      genericName: 'Blood Glucose Test Strip',
      category: 'Diabetic Care',
      brand: 'LifeScan Inc.',
      price: 1450,
      discountPrice: 1350,
      stock: 15,
      isPrescriptionRequired: false,
      isActive: true,
      image: '/images/products/onetouch.webp',
    },
    {
      id: 'p-4',
      nameBn: 'সেক্লো ২০মগ্র ক্যাপসুল',
      nameEn: 'Seclo 20mg Capsule',
      genericName: 'Omeprazole',
      category: 'Prescription Medicines',
      brand: 'Square Pharmaceuticals',
      price: 60,
      stock: 0,
      isPrescriptionRequired: true,
      isActive: false,
      image: '/images/products/seclo.webp',
    },
  ]);

  // Form State for Add Medicine Modal
  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    genericName: '',
    category: 'OTC Medicines',
    brand: 'Square Pharmaceuticals',
    price: '',
    discountPrice: '',
    stock: '',
    image: '',
    isPrescriptionRequired: false,
  });

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    toast.success(isBn ? 'স্ট্যাটাস আপডেট করা হয়েছে' : 'Product status updated');
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.error(isBn ? 'ওষুধ মুছে ফেলা হয়েছে' : 'Medicine deleted from catalog');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.price || !formData.stock) {
      toast.error(isBn ? 'অনুগ্রহ করে সঠিক তথ্য দিন' : 'Please fill all required fields');
      return;
    }

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      nameEn: formData.nameEn,
      nameBn: formData.nameBn || formData.nameEn,
      genericName: formData.genericName || 'General Formula',
      category: formData.category,
      brand: formData.brand,
      price: Number(formData.price),
      stock: Number(formData.stock),
      isPrescriptionRequired: formData.isPrescriptionRequired,
      isActive: true,
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    setFormData({
      nameEn: '',
      nameBn: '',
      genericName: '',
      category: 'OTC Medicines',
      brand: 'Square Pharmaceuticals',
      price: '',
      discountPrice: '',
      stock: '',
      image: '',
      isPrescriptionRequired: false,
    });
    toast.success(isBn ? 'নতুন ওষুধ সফলভাবে যুক্ত হয়েছে' : 'New Medicine added successfully!');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.nameBn.includes(search) ||
      p.genericName.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      filterCategory === 'ALL' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'ওষুধ ও হেলথকেয়ার ক্যাটালগ' : 'Medicine Catalog Management'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'মোট প্রডাক্ট স্টক, জেনেরিক নেম ও মূল্য নিয়ন্ত্রণ করুন'
              : 'Manage product pricing, stock availability, and prescription tags'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ওষুধ যোগ করুন' : 'Add New Medicine'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isBn
                ? 'নাম বা জেনেরিক সূত্রে খুঁজুন (যেমন: Napa, Paracetamol)...'
                : 'Search by brand or generic name...'
            }
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
        >
          <option value="ALL">{isBn ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
          <option value="OTC Medicines">OTC Medicines</option>
          <option value="Prescription Medicines">Prescription Medicines</option>
          <option value="Diabetic Care">Diabetic Care</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">{isBn ? 'ওষুধের নাম ও জেনেরিক' : 'Medicine Name'}</th>
                <th className="py-3 px-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="py-3 px-4">{isBn ? 'প্রস্তুতকারক' : 'Brand'}</th>
                <th className="py-3 px-4">{isBn ? 'মূল্য' : 'Price'}</th>
                <th className="py-3 px-4">{isBn ? 'স্টক' : 'Stock'}</th>
                <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground sm:text-sm">
                        {isBn ? prod.nameBn : prod.nameEn}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {prod.genericName}
                      </span>
                      {prod.isPrescriptionRequired && (
                        <span className="inline-block mt-1 w-fit rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800">
                          {isBn ? 'প্রেসক্রিপশন আবশ্যক' : 'Rx Required'}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-muted-foreground">
                    {prod.category}
                  </td>

                  <td className="py-3 px-4 font-semibold text-foreground">
                    {prod.brand}
                  </td>

                  <td className="py-3 px-4 font-black text-foreground">
                    {formatBDT(prod.price)}
                    {prod.discountPrice && (
                      <span className="block text-[10px] text-success">
                        {formatBDT(prod.discountPrice)} (Offer)
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        prod.stock > 50
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.stock > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {prod.stock > 0 ? `${prod.stock} Pcs` : 'Out of Stock'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(prod.id)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                        prod.isActive
                          ? 'bg-success/15 text-success hover:bg-success/25'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          toast.info(isBn ? 'সম্পাদনা মোড চালু' : 'Edit mode activated')
                        }
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-danger-light/40 hover:text-danger transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-bold text-foreground">
                  {isBn ? 'নতুন ওষুধ যুক্ত করুন' : 'Add New Medicine to Catalog'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 mt-4 text-xs">
                {/* Product Image Upload Field */}
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    {isBn ? 'ওষুধের ছবি (Product Image)' : 'Medicine Product Image'}
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-3 hover:border-primary/50 transition-colors">
                      {formData.image ? (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                          <img
                            src={formData.image}
                            alt="Medicine preview"
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="absolute -top-1 -right-1 rounded-full bg-danger text-white p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex flex-col flex-1 min-w-0">
                        <label className="cursor-pointer font-bold text-primary hover:underline text-xs flex items-center gap-1">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{isBn ? 'ছবি ব্রাউজ বা ড্রপ করুন' : 'Click to Upload or Drag File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const fakeUrl = URL.createObjectURL(file);
                                setFormData({ ...formData, image: fakeUrl });
                                toast.success(isBn ? 'ছবি সিলেক্ট করা হয়েছে' : 'Image selected');
                              }
                            }}
                          />
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          PNG, WEBP, JPG (Max 5MB)
                        </span>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="or paste direct image URL (https://...)"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Medicine Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Ex: Napa Extra 500mg"
                    className="h-10 w-full rounded-xl border border-border px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Generic Formula Name
                  </label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="Ex: Paracetamol + Caffeine"
                    className="h-10 w-full rounded-xl border border-border px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Price (BDT) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25"
                      className="h-10 w-full rounded-xl border border-border px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="100"
                      className="h-10 w-full rounded-xl border border-border px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="rxReq"
                    checked={formData.isPrescriptionRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, isPrescriptionRequired: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="rxReq" className="font-bold text-foreground">
                    {isBn ? 'প্রেসক্রিপশন আবশ্যক (Prescription Required)' : 'Requires Doctor Prescription'}
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-md"
                  >
                    Add Medicine
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
