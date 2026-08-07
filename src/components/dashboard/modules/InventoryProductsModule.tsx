'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

interface InventoryProductsModuleProps {
  isBn?: boolean;
}

interface ProductItem {
  id: string;
  nameEn: string;
  nameBn: string;
  genericName: string;
  brand: string;
  price: number;
  stock: number;
  isDgdaVerified: boolean;
}

const DEMO_INVENTORY: ProductItem[] = [
  {
    id: 'prod-101',
    nameEn: 'Napa Extra 500mg',
    nameBn: 'নাপা এক্সট্রা ৫০০ মিগ্রা',
    genericName: 'Paracetamol + Caffeine',
    brand: 'Beximco Pharmaceuticals',
    price: 2.5,
    stock: 450,
    isDgdaVerified: true,
  },
  {
    id: 'prod-102',
    nameEn: 'Seclo 20mg Capsule',
    nameBn: 'সেকলো ২০ মিগ্রা ক্যাপসুল',
    genericName: 'Omeprazole',
    brand: 'Square Pharmaceuticals',
    price: 7.0,
    stock: 120,
    isDgdaVerified: true,
  },
  {
    id: 'prod-103',
    nameEn: 'Sergel 20mg Tablet',
    nameBn: 'সারজেল ২০ মিগ্রা ট্যাবলেট',
    genericName: 'Esomeprazole',
    brand: 'Incepta Pharmaceuticals',
    price: 7.0,
    stock: 8, // Low stock
    isDgdaVerified: true,
  },
];

export function InventoryProductsModule({ isBn = true }: InventoryProductsModuleProps) {
  const [products, setProducts] = useState<ProductItem[]>(DEMO_INVENTORY);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.nameBn.includes(search) ||
      p.genericName.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info(isBn ? 'মেডিসিন রিমুভ করা হয়েছে' : 'Product removed from catalog');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'মেডিসিন স্টক ও ডাটাবেজ ক্যাটালগ' : 'Medicine Catalog & Stock Inventory'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'ড্রাগ প্রাইজ, জেনেরিক নেম, ডিজিডিএ ভেরিফিকেশন ও রিয়েল-টাইম স্টক আপডেট'
                : 'Manage product pricing, generic composition, DGDA tags and live stock levels'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            toast.success(isBn ? 'নতুন মেডিসিন যুক্ত করার ফরম খুলছে...' : 'Add medicine modal opened')
          }
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন মেডিসিন যুক্ত করুন' : 'Add New Medicine'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? 'ব্র্যান্ড, ওষুধ বা জেনেরিক নামে খুঁজুন...' : 'Search brand, medicine or generic name...'}
          className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-border bg-background shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4">{isBn ? 'মেডিসিনের নাম' : 'Medicine Name'}</th>
                <th className="py-3.5 px-4">{isBn ? 'জেনেরিক ও ব্র্যান্ড' : 'Generic & Manufacturer'}</th>
                <th className="py-3.5 px-4">{isBn ? 'ইউনিট মূল্য' : 'Unit Price'}</th>
                <th className="py-3.5 px-4">{isBn ? 'বর্তমান স্টক' : 'Live Stock'}</th>
                <th className="py-3.5 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock <= 10;
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div>
                        <span className="block font-bold">{isBn ? p.nameBn : p.nameEn}</span>
                        {p.isDgdaVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <ShieldCheck className="h-3 w-3" /> DGDA Verified
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      <p className="font-semibold text-foreground">{p.genericName}</p>
                      <p className="text-[10px]">{p.brand}</p>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                      ৳{p.price.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-black text-rose-700 border border-rose-200">
                          <AlertCircle className="h-3 w-3" /> Low ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                          <Package className="h-3 w-3" /> {p.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toast.info(isBn ? 'এডিটর তৈরি হচ্ছে' : 'Edit modal')}
                          className="p-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-border bg-background text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
