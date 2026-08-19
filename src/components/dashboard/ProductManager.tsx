'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  CheckCircle2,
  XCircle,
  Upload,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Pill,
  DollarSign,
  Layers,
  History,
  Boxes,
  Eye,
  MoreVertical,
  Copy,
  TrendingUp,
  TrendingDown,
  Shield,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Product, UnitPriceOption, PackagingTier, ProductService } from '@/services/product.service';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { formatNumber } from '@/utils/cart';
import { toast } from 'sonner';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { apiClient } from '@/lib/apiClient';

import { createPortal } from 'react-dom';

const DOSAGE_FORMS = [
  { value: 'tablet', label: 'Tablet (ট্যাবলেট)' },
  { value: 'syrup', label: 'Syrup (সিরাপ)' },
  { value: 'capsule', label: 'Capsule (ক্যাপসুল)' },
  { value: 'saline', label: 'Saline (স্যালাইন)' },
  { value: 'injection', label: 'Injection (ইনজেকশন)' },
  { value: 'ointment', label: 'Ointment (মলম)' },
  { value: 'drop', label: 'Drop (ড্রপ)' },
  { value: 'inhaler', label: 'Inhaler (ইনহেলার)' },
  { value: 'powder', label: 'Powder (পাউডার)' },
  { value: 'suppository', label: 'Suppository (সাপোজিটরি)' },
  { value: 'other', label: 'Other (অন্যান্য)' },
];

const UNIT_TYPES = [
  { value: 'pcs', label: 'Piece (পিস)', labelBn: 'পিস', labelEn: 'Pcs' },
  { value: 'strip', label: 'Strip (পাতা)', labelBn: 'পাতা', labelEn: 'Strip' },
  { value: 'box', label: 'Box (বক্স)', labelBn: 'বক্স', labelEn: 'Box' },
  { value: 'bottle', label: 'Bottle (বোতল)', labelBn: 'বোতল', labelEn: 'Bottle' },
  { value: 'tube', label: 'Tube (টিউব)', labelBn: 'টিউব', labelEn: 'Tube' },
  { value: 'gm', label: 'Gram (গ্রাম)', labelBn: 'গ্রাম', labelEn: 'Gm' },
  { value: 'ml', label: 'Ml (মিলি)', labelBn: 'মিলি', labelEn: 'Ml' },
  { value: 'pack', label: 'Pack (প্যাক)', labelBn: 'প্যাক', labelEn: 'Pack' },
];

function ProductActionsMenu({
  product,
  isBn,
  onView,
  onAudit,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  product: Product;
  isBn: boolean;
  onView: () => void;
  onAudit: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = React.useState<{ top: number; left: number; openUp: boolean }>({
    top: 0,
    left: 0,
    openUp: false,
  });

  const updateCoordinates = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 220;
    const menuWidth = 192;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

    const top = openUp ? rect.top - menuHeight - 6 : rect.bottom + 6;
    const left = Math.max(10, Math.min(window.innerWidth - menuWidth - 10, rect.right - menuWidth));

    setCoords({ top, left, openUp });
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateCoordinates();
    }
    setIsOpen((prev) => !prev);
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !(e.target as Element)?.closest?.('.product-actions-portal-menu')
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label="Product options"
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: coords.openUp ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                zIndex: 99999,
              }}
              className="product-actions-portal-menu w-48 rounded-2xl border border-border bg-background p-1.5 shadow-2xl space-y-0.5"
            >
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onView();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-blue-600" />
                <span>{isBn ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-amber-600" />
                <span>{isBn ? 'এডিট করুন' : 'Edit Product'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDuplicate();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 text-purple-600" />
                <span>{isBn ? 'ডুপ্লিকেট করুন' : 'Duplicate Product'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAudit();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <History className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isBn ? 'স্টক ও অডিট লেজার' : 'Stock & Audit'}</span>
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBn ? 'ডিলিট করুন' : 'Delete Product'}</span>
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export function ProductManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Server Query Parameters
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const brandQuery = searchParams.get('brand') || '';
  const dosageQuery = searchParams.get('dosageForm') || '';

  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const itemsPerPage = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;

  // React Query Hooks
  const {
    products,
    pagination,
    isLoading,
    createProduct,
    updateProduct,
    toggleFeatured,
    deleteProduct,
  } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    category: categoryQuery || undefined,
    brand: brandQuery || undefined,
    dosageForm: dosageQuery || undefined,
    isAdmin: true,
  });

  const { categories } = useCategories(true);
  const { brands } = useBrands(true);

  // Local State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isLoadingViewingProduct, setIsLoadingViewingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Audit Ledger Modal State
  const [selectedAuditProduct, setSelectedAuditProduct] = useState<Product | null>(null);
  const [auditBatches, setAuditBatches] = useState<any[]>([]);
  const [auditLedger, setAuditLedger] = useState<any[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosageForm: 'tablet',
    strength: '',
    baseUnit: 'pcs',
    unitType: 'pcs',
    packSize: '',
    description: '',
    category: '',
    brand: '',
    buyingPrice: 0,
    price: 0,
    discountPrice: 0,
    stock: 100,
    batchNumber: '',
    expiryDate: '',
    requiresPrescription: false,
    isFeatured: true,
    images: [] as string[],
    unitPrices: [
      { unit: 'pcs', baseUnitQty: 1, unitLabelBn: 'পিস', unitLabelEn: 'Piece', buyingPrice: 0, price: 0, mrp: 0, stock: 100, isDefault: true },
    ] as (UnitPriceOption & { baseUnitQty?: number })[],
  });

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', 'products');
        params.set('page', '1');
        if (localSearch.trim()) {
          params.set('search', localSearch.trim());
        } else {
          params.delete('search');
        }
        router.push(`/dashboard/admin?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'products');
    params.set('page', '1');
    if (localSearch.trim()) {
      params.set('search', localSearch.trim());
    } else {
      params.delete('search');
    }
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'products');
    params.set('page', '1');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'products');
    params.set('page', newPage.toString());
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'products');
    params.set('page', '1');
    params.set('limit', newLimit.toString());
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      setIsDeleting(true);
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
    } catch {
      // Handled by toast
    } finally {
      setIsDeleting(false);
    }
  };

  const openAuditModal = async (product: Product) => {
    setSelectedAuditProduct(product);
    setIsAuditLoading(true);
    try {
      const [batchesRes, ledgerRes] = await Promise.all([
        apiClient<any[]>(`/inventory/batches/${product.id}`),
        apiClient<any[]>(`/inventory/ledger/${product.id}`),
      ]);
      setAuditBatches(batchesRes || []);
      setAuditLedger(ledgerRes || []);
    } catch {
      toast.error('Failed to load inventory batches & audit ledger');
    } finally {
      setIsAuditLoading(false);
    }
  };

  const handleRecalculateStock = async (productId: string) => {
    try {
      await apiClient(`/inventory/recalculate-stock/${productId}`, { method: 'POST' });
      toast.success(isBn ? 'স্টক সিঙ্ক সম্পন্ন হয়েছে' : 'Stock recalculated and synced!');
      if (selectedAuditProduct && selectedAuditProduct.id === productId) {
        openAuditModal(selectedAuditProduct);
      }
    } catch {
      toast.error('Failed to recalculate stock');
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      toast.error(isBn ? 'সর্বোচ্চ ৫ টি ছবি আপলোড করা যাবে' : 'Maximum 5 images allowed');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(isBn ? `ফাইল "${file.name}" ৫ মেগাবাইটের বেশি` : `File "${file.name}" exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, base64Url],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addUnitPriceTier = () => {
    const defaultUnit = UNIT_TYPES.find((u) => !formData.unitPrices.some((existing) => existing.unit === u.value)) || UNIT_TYPES[0];
    const defaultQty = defaultUnit.value === 'box' ? 100 : defaultUnit.value === 'strip' ? 10 : 1;
    setFormData((prev) => ({
      ...prev,
      unitPrices: [
        ...prev.unitPrices,
        {
          unit: defaultUnit.value,
          baseUnitQty: defaultQty,
          unitLabelBn: defaultUnit.labelBn,
          unitLabelEn: defaultUnit.labelEn,
          buyingPrice: 0,
          price: prev.price || 0,
          mrp: prev.price || 0,
          stock: 50,
          isDefault: false,
        },
      ],
    }));
  };

  const updateUnitPriceTier = (index: number, key: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.unitPrices];
      if (key === 'unit') {
        const selected = UNIT_TYPES.find((u) => u.value === value);
        const autoQty = value === 'box' ? 100 : value === 'strip' ? 10 : 1;
        updated[index] = {
          ...updated[index],
          unit: value,
          baseUnitQty: autoQty,
          unitLabelBn: selected?.labelBn || value,
          unitLabelEn: selected?.labelEn || value,
        };
      } else {
        updated[index] = { ...updated[index], [key]: value };
      }
      return { ...prev, unitPrices: updated };
    });
  };

  const removeUnitPriceTier = (index: number) => {
    if (formData.unitPrices.length <= 1) {
      toast.error(isBn ? 'কমপক্ষে একটি ইউনিট প্রাইসিং থাকা আবশ্যক' : 'At least one unit pricing tier required');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      unitPrices: prev.unitPrices.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category || !formData.brand) {
      toast.error(isBn ? 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields');
      return;
    }

    const defaultTier = formData.unitPrices.find((u) => u.isDefault) || formData.unitPrices[0];

    const allTiers = formData.unitPrices;

    const unitPricesPayload = allTiers.map((u) => ({
      unit: u.unit,
      baseUnitQty: Number(u.baseUnitQty || 1),
      unitLabelBn: u.unitLabelBn || (u.unit === 'pcs' ? 'পিস' : u.unit === 'strip' ? 'পাতা' : u.unit === 'box' ? 'বক্স' : u.unit === 'bottle' ? 'বোতল' : u.unit === 'tube' ? 'টিউব' : u.unit === 'pack' ? 'প্যাক' : u.unit),
      unitLabelEn: u.unitLabelEn || u.unit,
      buyingPrice: Number(u.buyingPrice || 0),
      price: Number(u.price),
      mrp: u.mrp ? Number(u.mrp) : Number(u.price),
      discountPrice: u.discountPrice ? Number(u.discountPrice) : undefined,
      stock: Number(u.stock || 0),
      multiplier: Number(u.baseUnitQty || 1),
      isDefault: Boolean(u.isDefault),
    }));

    const packagingPayload: PackagingTier[] = allTiers.map((u) => ({
      unit: u.unit,
      baseUnitQty: Number(u.baseUnitQty || 1),
      buyingPrice: Number(u.buyingPrice || 0),
      price: Number(u.price),
      mrp: u.mrp ? Number(u.mrp) : Number(u.price),
      discountPrice: u.discountPrice ? Number(u.discountPrice) : undefined,
      isDefault: Boolean(u.isDefault),
      isActive: true,
    }));

    const payload = {
      name: formData.name.trim(),
      genericName: formData.genericName.trim() || undefined,
      dosageForm: formData.dosageForm,
      strength: formData.strength.trim() || undefined,
      baseUnit: formData.baseUnit,
      unitType: formData.unitType,
      unitPrices: unitPricesPayload,
      packaging: packagingPayload,
      packSize: formData.packSize.trim() || undefined,
      description: formData.description.trim() || undefined,
      category: formData.category,
      brand: formData.brand,
      buyingPrice: Number(defaultTier ? defaultTier.buyingPrice || 0 : formData.buyingPrice || 0),
      price: Number(defaultTier ? defaultTier.price : formData.price),
      discountPrice: defaultTier && defaultTier.discountPrice ? Number(defaultTier.discountPrice) : (formData.discountPrice ? Number(formData.discountPrice) : undefined),
      stock: Number(formData.stock),
      batchNumber: formData.batchNumber.trim() || undefined,
      expiryDate: formData.expiryDate || undefined,
      requiresPrescription: formData.requiresPrescription,
      isFeatured: formData.isFeatured,
      images: formData.images,
    };

    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, payload });
    } else {
      await createProduct(payload);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      dosageForm: 'tablet',
      strength: '',
      baseUnit: 'pcs',
      unitType: 'pcs',
      packSize: '',
      description: '',
      category: categories[0]?.id || '',
      brand: brands[0]?.id || '',
      buyingPrice: 0,
      price: 0,
      discountPrice: 0,
      stock: 100,
      batchNumber: '',
      expiryDate: '',
      requiresPrescription: false,
      isFeatured: true,
      images: [],
      unitPrices: [
        { unit: 'pcs', baseUnitQty: 1, unitLabelBn: 'পিস', unitLabelEn: 'Piece', buyingPrice: 0, price: 0, mrp: 0, stock: 100, isDefault: true },
      ],
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    if (categories.length > 0) setFormData((p) => ({ ...p, category: categories[0].id }));
    if (brands.length > 0) setFormData((p) => ({ ...p, brand: brands[0].id }));
    setIsAddModalOpen(true);
  };

  const populateFormWithProduct = (p: Product) => {
    const catVal = typeof p.category === 'object' && p.category !== null ? (p.category.id || p.category._id) : (p.categoryId || p.category);
    const brandVal = typeof p.brand === 'object' && p.brand !== null ? (p.brand.id || p.brand._id) : p.brand;

    const matchedCat = categories.find((c) => c.id === catVal || c.name === catVal || c.slug === catVal);
    const resolvedCatId = matchedCat ? matchedCat.id : (catVal && catVal.length === 24 ? catVal : categories[0]?.id || '');

    const matchedBrand = brands.find((b) => b.id === brandVal || b.name === brandVal || b.slug === brandVal);
    const resolvedBrandId = matchedBrand ? matchedBrand.id : (brandVal && brandVal.length === 24 ? brandVal : brands[0]?.id || '');

    const rawTiers = Array.isArray((p as any).packaging) && (p as any).packaging.length > 0
      ? (p as any).packaging
      : Array.isArray(p.unitPrices) && p.unitPrices.length > 0
      ? p.unitPrices
      : [];

    const unitPrices = rawTiers.length > 0
      ? rawTiers.map((u: any) => ({
          unit: u.unit || 'pcs',
          baseUnitQty: Number(u.baseUnitQty || u.multiplier || 1),
          unitLabelBn: u.unitLabelBn || (u.unit === 'pcs' ? 'পিস' : u.unit === 'strip' ? 'পাতা' : u.unit === 'box' ? 'বক্স' : u.unit === 'bottle' ? 'বোতল' : u.unit === 'tube' ? 'টিউব' : u.unit === 'pack' ? 'প্যাক' : u.unit),
          unitLabelEn: u.unitLabelEn || u.unit || 'pcs',
          buyingPrice: u.buyingPrice !== undefined ? Number(u.buyingPrice) : ((p as any).buyingPrice ? Number((p as any).buyingPrice) * Number(u.baseUnitQty || u.multiplier || 1) : 0),
          price: Number(u.price || p.price || 0),
          mrp: u.mrp ? Number(u.mrp) : Number(u.price || p.price || 0),
          discountPrice: u.discountPrice ? Number(u.discountPrice) : undefined,
          stock: u.stock !== undefined ? Number(u.stock) : Number(p.stockCount || p.stock || 0),
          isDefault: Boolean(u.isDefault),
        }))
      : [{ unit: p.unitType || 'pcs', baseUnitQty: 1, unitLabelBn: 'পিস', unitLabelEn: 'Piece', buyingPrice: (p as any).buyingPrice || 0, price: p.price, mrp: p.mrp, stock: p.stockCount || p.stock, isDefault: true }];

    setFormData({
      name: p.name,
      genericName: p.genericName || '',
      dosageForm: p.dosageForm || 'tablet',
      strength: p.strength || '',
      baseUnit: (p as any).baseUnit || 'pcs',
      unitType: p.unitType || 'pcs',
      packSize: p.packSize || '',
      description: p.description || '',
      category: resolvedCatId,
      brand: resolvedBrandId,
      buyingPrice: (p as any).buyingPrice || 0,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      stock: p.stockCount || p.stock || 0,
      batchNumber: p.batchNumber || '',
      expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '',
      requiresPrescription: Boolean(p.requiresPrescription || p.requiresRx),
      isFeatured: Boolean(p.isFeatured),
      images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
      unitPrices,
    });
  };

  const openEditModal = async (summaryProduct: Product) => {
    setEditingProduct(summaryProduct);
    populateFormWithProduct(summaryProduct);
    setIsAddModalOpen(true);

    try {
      const fullProduct = await ProductService.getProductByIdOrSlug(summaryProduct.id, true);
      if (fullProduct) {
        populateFormWithProduct(fullProduct);
      }
    } catch {
      // Retains summary info if full details fetch fails
    }
  };

  const openViewModal = async (summaryProduct: Product) => {
    setViewingProduct(null);
    setIsLoadingViewingProduct(true);
    try {
      const fullProduct = await ProductService.getProductByIdOrSlug(summaryProduct.id, true);
      setViewingProduct(fullProduct || summaryProduct);
    } catch {
      setViewingProduct(summaryProduct);
      toast.error(isBn ? 'বিস্তারিত তথ্য লোড করা যায়নি' : 'Unable to load the latest product details');
    } finally {
      setIsLoadingViewingProduct(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            {isBn ? 'প্রোডাক্ট ম্যানেজমেন্ট' : 'Product Management'}
          </h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {isBn
              ? `মোট ${formatNumber(pagination.total, 'bn')} টি নিবন্ধিত ওষুধ ডাটাবেজে যুক্ত আছে`
              : `Total ${formatNumber(pagination.total, 'en')} registered products in catalog`}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ওষুধ যোগ করুন' : 'Add New Medicine'}</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={isBn ? 'ওষুধের নাম লিখে খুঁজুন...' : 'Search medicine name...'}
            className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:ring-0 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        </form>

        {/* Category Filter */}
        <CustomSelect
          value={categoryQuery}
          onChange={(val) => handleFilterChange('category', val)}
          options={[
            { value: '', label: isBn ? 'সকল ক্যাটাগরি' : 'All Categories' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        {/* Brand Filter */}
        <CustomSelect
          value={brandQuery}
          onChange={(val) => handleFilterChange('brand', val)}
          options={[
            { value: '', label: isBn ? 'সকল ব্র‍্যান্ড' : 'All Brands' },
            ...brands.map((b) => ({ value: b.id, label: b.name })),
          ]}
        />

        {/* Dosage Form Filter */}
        <CustomSelect
          value={dosageQuery}
          onChange={(val) => handleFilterChange('dosageForm', val)}
          options={[
            { value: '', label: isBn ? 'সকল ডোজ ফর্ম' : 'All Dosage Forms' },
            ...DOSAGE_FORMS.map((d) => ({ value: d.value, label: d.label })),
          ]}
        />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-border bg-background p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{isBn ? 'ডাটা লোড হচ্ছে...' : 'Loading medicine list...'}</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background p-6 text-center">
          <Pill className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <h3 className="text-base font-bold text-foreground">
            {isBn ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicines found'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isBn ? 'নতুন ওষুধ যুক্ত করতে উপরে বাটন ক্লিক করুন' : 'Click the button above to add a new medicine'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-2xs">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">{isBn ? 'প্রোডাক্ট' : 'Product'}</th>
                    <th className="py-3.5 px-4">{isBn ? 'ডোজ ও স্ট্রেন্থ' : 'Dosage & Strength'}</th>
                    <th className="py-3.5 px-4">{isBn ? 'ব্র্যান্ড ও ক্যাটাগরি' : 'Brand & Category'}</th>
                    <th className="py-3.5 px-4">{isBn ? 'ইউনিট ও প্রাইসিং ভিউ' : 'Packaging & Pricing'}</th>
                    <th className="py-3.5 px-4">{isBn ? 'মোট বেস স্টক' : 'Base Unit Stock'}</th>
                    <th className="py-3.5 px-4 text-center">{isBn ? 'ফিচারড' : 'Featured'}</th>
                    <th className="py-3.5 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {products.map((p) => {
                    const brandName = typeof p.brand === 'object' ? p.brand?.name : p.brandName || p.brand;
                    const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                    const baseUnit = (p as any).baseUnit || 'pcs';
                    const stockCached = p.stockCount !== undefined ? p.stockCount : p.stock;

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        {/* Image & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                              <Image
                                src={p.image && p.image.trim() !== '' ? p.image : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground truncate max-w-[180px]">
                                  {p.name}
                                </span>
                                {p.requiresRx && (
                                  <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-600 border border-rose-500/20">
                                    Rx
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                {p.genericName || '-'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Dosage & Strength */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary capitalize">
                            {p.dosageForm}
                          </span>
                          <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                            {p.strength || 'N/A'}
                          </p>
                        </td>

                        {/* Brand & Category */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-foreground block truncate max-w-[140px]">
                            {brandName || 'Generic'}
                          </span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-[140px]">
                            {catName || 'General'}
                          </span>
                        </td>

                        {/* Multi-Unit Pricing Badge Tiers */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1.5">
                            {p.unitPrices && p.unitPrices.length > 0 ? (
                              p.unitPrices.map((u, idx) => (
                                <div key={idx} className="flex flex-col gap-0.5 border-b border-border/40 pb-1 last:border-b-0 last:pb-0">
                                  <div className="flex items-center gap-1.5 text-[11px]">
                                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-extrabold text-foreground uppercase text-[10px]">
                                      {u.unitLabelBn || u.unit}
                                    </span>
                                    <span className="font-extrabold text-primary">
                                      {formatBDT(u.price)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      ({u.stock} {u.unit})
                                    </span>
                                  </div>
                                  {Number((u as any).buyingPrice || 0) > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                      <span>{isBn ? 'ক্রয়:' : 'Cost:'} <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{formatBDT(Number((u as any).buyingPrice))}</strong></span>
                                      {Number(u.price) > Number((u as any).buyingPrice) && (
                                        <span className="text-emerald-600 font-black text-[9px]">
                                          (+{Math.round(((Number(u.price) - Number((u as any).buyingPrice)) / Number(u.price)) * 100)}%)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-primary">{formatBDT(p.price)}</span>
                                <span className="text-[10px] text-muted-foreground">/{p.unitType}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Single-Source Stock Cached */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${
                                stockCached > 0
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                              }`}
                            >
                              {stockCached > 0 ? `${stockCached} ${baseUnit} total` : 'Out of stock'}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-semibold">
                              FEFO Managed
                            </span>
                          </div>
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleFeatured(p.id)}
                            className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                            title={p.isFeatured ? 'Featured Product' : 'Make Featured'}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                p.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <ProductActionsMenu
                            product={p}
                            isBn={isBn}
                            onView={() => openViewModal(p)}
                            onAudit={() => openAuditModal(p)}
                            onEdit={() => openEditModal(p)}
                            onDuplicate={() => {
                              populateFormWithProduct(p);
                              setEditingProduct(null);
                              setFormData((prev) => ({ ...prev, name: `${p.name} (Copy)` }));
                              setIsAddModalOpen(true);
                              toast.info(isBn ? 'প্রোডাক্টের কপি তৈরি করা হচ্ছে' : 'Duplicating product details');
                            }}
                            onDelete={() => setDeletingProductId(p.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border bg-muted/20 p-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold">
                  {isBn ? 'প্রতি পেজে সারি:' : 'Rows per page:'}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="h-9 rounded-2xl border border-border bg-background px-3 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                >
                  <option value={10}>{formatNumber(10, isBn ? 'bn' : 'en')}</option>
                  <option value={20}>{formatNumber(20, isBn ? 'bn' : 'en')}</option>
                  <option value={50}>{formatNumber(50, isBn ? 'bn' : 'en')}</option>
                  <option value={100}>{formatNumber(100, isBn ? 'bn' : 'en')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
                </button>

                <div className="flex items-center gap-1 font-bold">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`h-8 w-8 rounded-xl font-extrabold transition-all cursor-pointer ${
                        p === currentPage
                          ? 'bg-primary text-white shadow-xs font-black'
                          : 'border border-border hover:bg-muted text-foreground'
                      }`}
                    >
                      {formatNumber(p, isBn ? 'bn' : 'en')}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Product Modal */}
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
              className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-background shrink-0">
                <h3 className="text-base font-bold text-foreground">
                  {editingProduct
                    ? isBn
                      ? 'ওষুধের তথ্য ও ইউনিট প্রাইজ এডিট করুন'
                      : 'Edit Medicine & Packaging Views'
                    : isBn
                    ? 'নতুন ওষুধ বা প্রোডাক্ট যোগ করুন'
                    : 'Add New Pharmaceutical Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body & Form */}
              <form onSubmit={handleFormSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Medicine Name */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Medicine / Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Napa Extra 500mg"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Generic Name */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Generic Name (API Name)
                      </label>
                      <input
                        type="text"
                        value={formData.genericName}
                        onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                        placeholder="Ex: Paracetamol + Caffeine"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category Selection */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Selection */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">Manufacturer Brand *</label>
                      <select
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                      >
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Base Unit Selection */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">
                        Base Stock Unit (একক) *
                      </label>
                      <select
                        value={formData.baseUnit}
                        onChange={(e) => setFormData({ ...formData, baseUnit: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-primary/50 bg-primary/10 px-4 text-xs font-bold text-primary shadow-2xs focus:border-primary focus:outline-none cursor-pointer transition-all"
                      >
                        <option value="pcs">Pcs / Piece (পিস)</option>
                        <option value="ml">Ml (মিলি)</option>
                        <option value="gm">Gm (গ্রাম)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dosage Form */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">Dosage Form</label>
                      <select
                        value={formData.dosageForm}
                        onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                      >
                        {DOSAGE_FORMS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Strength */}
                    <div>
                      <label className="font-bold text-foreground block mb-1">Strength</label>
                      <input
                        type="text"
                        value={formData.strength}
                        onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                        placeholder="Ex: 500mg, 100ml"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Packaging Views & Conversion Factors */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                          {isBn ? 'প্যাকেজিং ইউনিট প্রাইসিং, ক্রয় মূল্য ও কনভার্সন (Packaging Tiers)' : 'Packaging Unit Pricing, Procurement Cost & Conversion'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={addUnitPriceTier}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-primary-dark transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>{isBn ? '+ নতুন প্যাকেজিং ইউনিট' : '+ Add Packaging Tier'}</span>
                      </button>
                    </div>

                    {formData.unitPrices.map((tier, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end rounded-xl border border-border/80 bg-background p-3 shadow-2xs"
                      >
                        {/* Unit Selector */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            {isBn ? 'ইউনিট' : 'Unit'}
                          </label>
                          <select
                            value={tier.unit}
                            onChange={(e) => updateUnitPriceTier(idx, 'unit', e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-2 text-xs font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                          >
                            {UNIT_TYPES.map((u) => (
                              <option key={u.value} value={u.value}>
                                {u.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Conversion Factor (baseUnitQty) */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            {isBn ? `কত ${formData.baseUnit} = ১ ${tier.unit}` : `Base Qty per ${tier.unit}`}
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            onFocus={(e) => e.target.select()}
                            value={tier.baseUnitQty === 0 ? '' : tier.baseUnitQty}
                            onChange={(e) => updateUnitPriceTier(idx, 'baseUnitQty', e.target.value === '' ? '' : Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-primary/40 bg-primary/5 px-2 text-xs font-bold text-primary focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Buying Price / Cost Price per Unit */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            {isBn ? 'ক্রয় মূল্য (৳)' : 'Cost Price (৳)'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            onFocus={(e) => e.target.select()}
                            value={tier.buyingPrice === 0 ? '' : (tier.buyingPrice || '')}
                            onChange={(e) => updateUnitPriceTier(idx, 'buyingPrice', e.target.value === '' ? 0 : Number(e.target.value))}
                            placeholder="0.00"
                            className="h-9 w-full rounded-lg border border-border bg-background px-2 text-xs font-bold focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Selling Price */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            {isBn ? 'বিক্রয় মূল্য (৳)' : 'Selling Price (৳)'}
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            onFocus={(e) => e.target.select()}
                            value={tier.price === 0 ? '' : tier.price}
                            onChange={(e) => updateUnitPriceTier(idx, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-2 text-xs font-bold focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* MRP */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                            {isBn ? 'এমআরপি (৳)' : 'MRP (৳)'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            onFocus={(e) => e.target.select()}
                            value={tier.mrp === 0 ? '' : (tier.mrp || '')}
                            onChange={(e) => updateUnitPriceTier(idx, 'mrp', e.target.value === '' ? '' : Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-2 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Default Toggle & Delete */}
                        <div className="flex items-center justify-between pb-1">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-foreground">
                            <input
                              type="checkbox"
                              checked={tier.isDefault}
                              onChange={(e) => updateUnitPriceTier(idx, 'isDefault', e.target.checked)}
                              className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                            />
                            <span>{isBn ? 'ডিফল্ট' : 'Default'}</span>
                          </label>

                          {formData.unitPrices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUnitPriceTier(idx)}
                              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                              title="Remove Tier"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Initial Stock & FEFO Batch Intake Info (Only for New Products) */}
                  {!editingProduct && (
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-foreground block mb-1">
                          {isBn ? `প্রাথমিক স্টক পরিমাণ (${formData.baseUnit})` : `Initial Stock (${formData.baseUnit})`}
                        </label>
                        <input
                          type="number"
                          min={0}
                          onFocus={(e) => e.target.select()}
                          value={formData.stock === 0 ? '' : formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? 0 : Number(e.target.value) })}
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none font-bold transition-colors"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-foreground block mb-1">
                          {isBn ? 'ব্যাচ নম্বর (Batch No)' : 'Batch Number'}
                        </label>
                        <input
                          type="text"
                          value={formData.batchNumber}
                          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                          placeholder="Ex: B2026-08"
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-foreground block mb-1">
                          {isBn ? 'মেয়াদোত্তীর্ণের তারিখ (Expiry)' : 'Expiry Date'}
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Multi-Image File Upload */}
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Medicine Product Images (Max 5 images, up to 5MB each)
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden">
                          <Image src={img} alt="Product" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-0.5 right-0.5 rounded-full bg-rose-600 p-0.5 text-white hover:bg-rose-700 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {formData.images.length < 5 && (
                        <label className="flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-[9px] font-bold text-muted-foreground mt-1">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.requiresPrescription}
                        onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                        className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4"
                      />
                      <span>Prescription Required (Rx)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4"
                      />
                      <span>Featured Product</span>
                    </label>
                  </div>
                </div>

                {/* Modal Fixed Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3.5 bg-background shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer active:scale-95 transition-all"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Medicine'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batches & Audit Ledger Modal */}
      <AnimatePresence>
        {selectedAuditProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAuditProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4 sm:p-5 shrink-0 bg-background">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                    <Boxes className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">
                      {selectedAuditProduct.name} — Inventory Audit Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      FEFO Batches & Append-Only Audit Trail
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecalculateStock(selectedAuditProduct.id)}
                    className="rounded-xl border border-primary bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    Recalculate & Sync
                  </button>
                  <button
                    onClick={() => setSelectedAuditProduct(null)}
                    className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {isAuditLoading ? (
                  <div className="flex h-48 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                  {/* Active FEFO Batches */}
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-2">
                      Active FEFO Batches ({auditBatches.length})
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-border">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground">
                            <th className="py-2.5 px-3">Batch Number</th>
                            <th className="py-2.5 px-3">Expiry Date</th>
                            <th className="py-2.5 px-3">Remaining Base Qty</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {auditBatches.map((b) => (
                            <tr key={b._id} className="hover:bg-muted/20">
                              <td className="py-2.5 px-3 font-bold text-foreground">{b.batchNumber}</td>
                              <td className="py-2.5 px-3 font-medium">
                                {new Date(b.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3 font-extrabold text-primary">{b.quantity} pcs</td>
                              <td className="py-2.5 px-3">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${b.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                  {b.isActive ? 'Active FEFO' : 'Depleted'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Stock Audit Ledger */}
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-2">
                      Stock Audit Ledger (Append-Only Log)
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-border max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground">
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Change Qty</th>
                            <th className="py-2.5 px-3">Balance After</th>
                            <th className="py-2.5 px-3">Reference / Unit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {auditLedger.map((l) => (
                            <tr key={l._id} className="hover:bg-muted/20">
                              <td className="py-2 px-3 text-[11px] text-muted-foreground">
                                {new Date(l.createdAt).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 font-bold">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] uppercase ${
                                  l.type === 'SALE'
                                    ? 'bg-rose-500/10 text-rose-600'
                                    : l.type === 'PURCHASE'
                                    ? 'bg-emerald-500/10 text-emerald-600'
                                    : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {l.type}
                                </span>
                              </td>
                              <td className={`py-2 px-3 font-extrabold ${l.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {l.quantity > 0 ? `+${l.quantity}` : l.quantity}
                              </td>
                              <td className="py-2 px-3 font-bold text-foreground">{l.balanceAfter} pcs</td>
                              <td className="py-2 px-3 text-[11px] text-muted-foreground truncate max-w-[140px]">
                                {l.referenceId || l.unitSold || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProductId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingProductId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-2xl text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertTriangle className="h-7 w-7" />
              </div>

              <h3 className="text-base font-bold text-foreground">
                {isBn ? 'প্রোডাক্টটি মুছে ফেলতে চান?' : 'Delete Medicine Product?'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {isBn
                  ? 'আপনি কি নিশ্চিত যে এই ওষুধটি ডিলিট করতে চান? এই প্রক্রিয়াটি আর ফেরত আনা যাবে না।'
                  : 'Are you sure you want to delete this medicine product? This action cannot be undone.'}
              </p>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingProductId(null)}
                  className="w-full rounded-2xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="w-full rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>{isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete'}</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details View Modal */}
      <AnimatePresence>
        {(isLoadingViewingProduct || viewingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5"
            >
              {isLoadingViewingProduct ? (
                <div className="flex min-h-48 items-center justify-center text-sm font-bold text-muted-foreground">
                  {isBn ? 'ডাটা লোড হচ্ছে...' : 'Loading latest medicine details...'}
                </div>
              ) : viewingProduct ? <>
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-2 text-primary">
                    <Pill className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">
                      {viewingProduct.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {viewingProduct.genericName || 'Generic N/A'} • {viewingProduct.dosageForm} ({viewingProduct.strength || 'N/A'})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingProduct(null)}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border border-border">
                  <Image
                    src={viewingProduct.image && viewingProduct.image.trim() !== '' ? viewingProduct.image : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
                    alt={viewingProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Specs Info */}
                <div className="sm:col-span-2 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/30 p-3 border border-border">
                    <div>
                      <span className="text-muted-foreground font-semibold block">Brand:</span>
                      <span className="font-extrabold text-foreground">{typeof viewingProduct.brand === 'object' ? viewingProduct.brand?.name : viewingProduct.brand || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">Category:</span>
                      <span className="font-extrabold text-foreground">{typeof viewingProduct.category === 'object' ? viewingProduct.category?.name : viewingProduct.category || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">Requires Rx:</span>
                      <span className={`font-bold ${viewingProduct.requiresRx ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {viewingProduct.requiresRx ? 'Yes (Prescription Required)' : 'No (OTC)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">Total Stock:</span>
                      <span className="font-extrabold text-primary">{viewingProduct.stockCount || viewingProduct.stock} Base Units</span>
                    </div>
                  </div>

                  {/* Unit Prices Breakdown */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-foreground block">Packaging & Unit Prices:</span>
                    <div className="rounded-2xl border border-border overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-muted/50 font-bold uppercase text-muted-foreground">
                          <tr>
                            <th className="py-2 px-3">Unit</th>
                            <th className="py-2 px-3">Cost Price</th>
                            <th className="py-2 px-3">Selling Price</th>
                            <th className="py-2 px-3">MRP</th>
                            <th className="py-2 px-3">Unit Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {viewingProduct.unitPrices && viewingProduct.unitPrices.length > 0 ? (
                            viewingProduct.unitPrices.map((u, i) => (
                              <tr key={i} className="hover:bg-muted/20">
                                <td className="py-2 px-3 font-bold text-foreground">{u.unitLabelBn || u.unit}</td>
                                <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatBDT(Number((u as any).buyingPrice || 0))}</td>
                                <td className="py-2 px-3 font-bold text-primary">{formatBDT(u.price)}</td>
                                <td className="py-2 px-3 text-muted-foreground">{formatBDT(u.mrp || u.price)}</td>
                                <td className="py-2 px-3 font-semibold">{u.stock} {u.unit}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-2 px-3 font-bold text-foreground">{viewingProduct.unitType || 'pcs'}</td>
                              <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatBDT(Number((viewingProduct as any).buyingPrice || 0))}</td>
                              <td className="py-2 px-3 font-bold text-primary">{formatBDT(viewingProduct.price)}</td>
                              <td className="py-2 px-3 text-muted-foreground">{formatBDT(viewingProduct.mrp || viewingProduct.price)}</td>
                              <td className="py-2 px-3 font-semibold">{viewingProduct.stockCount || viewingProduct.stock}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Description */}
                  {viewingProduct.description && (
                    <div className="space-y-1">
                      <span className="font-extrabold text-foreground block">Product Description:</span>
                      <p className="text-muted-foreground text-xs leading-relaxed bg-muted/20 p-2.5 rounded-xl border border-border">
                        {viewingProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setViewingProduct(null)}
                  className="rounded-xl border border-border px-5 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  Close Preview
                </button>
              </div>
              </> : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
