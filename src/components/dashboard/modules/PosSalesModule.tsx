'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  X,
  Loader2,
  History,
  RotateCcw,
  CheckCircle2,
  Pill,
  User,
  UserCheck,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Tag,
  CreditCard,
  Banknote,
  DollarSign,
  QrCode,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductService, Product } from '@/services/product.service';
import { posService, PosSaleRecord } from '@/services/pos.service';
import { staffInvitationService, SearchedCustomer } from '@/services/staffInvitation.service';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useBranding } from '@/context/BrandingContext';
import { settingsService, DynamicPaymentMethod } from '@/services/settings.service';
import { PaymentBrandIcon } from '@/components/common/PaymentBrandIcon';
import { formatNumber } from '@/utils/cart';

interface PosSalesModuleProps {
  isBn?: boolean;
}

export interface CartPosItem {
  product: Product;
  selectedUnit: string;
  unitMultiplier: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const DOSAGE_FORMS = [
  { value: '', label: 'সকল ডোজ ফর্ম (All Forms)' },
  { value: 'tablet', label: 'Tablet (ট্যাবলেট)' },
  { value: 'syrup', label: 'Syrup (সিরাপ)' },
  { value: 'capsule', label: 'Capsule (ক্যাপসুল)' },
  { value: 'saline', label: 'Saline (স্যালাইন)' },
  { value: 'injection', label: 'Injection (ইনজেকশন)' },
  { value: 'drop', label: 'Eye/Ear Drop (ড্রপ)' },
  { value: 'ointment', label: 'Cream / Ointment' },
  { value: 'inhaler', label: 'Inhaler / Resp' },
];

const BD_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Sylhet',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];

export function PosSalesModule({ isBn = true }: PosSalesModuleProps) {
  const { settings } = useBranding();
  const { categories = [] } = useCategories(false);
  const { brands = [] } = useBrands(false);

  // Server-side Product Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter Toolbar States (Matching Admin Product Table)
  const [search, setSearch] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [brandQuery, setBrandQuery] = useState('');
  const [dosageQuery, setDosageQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Selected Unit map for table row items
  const [selectedUnits, setSelectedUnits] = useState<Record<string, { unit: string; multiplier: number; price: number }>>({});

  // POS Cart State
  const [cartItems, setCartItems] = useState<CartPosItem[]>([]);
  const [posStep, setPosStep] = useState<'products' | 'sale'>('products');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bkash' | 'nagad'>('cash');
  const [paymentMethods, setPaymentMethods] = useState<DynamicPaymentMethod[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [saleNote, setSaleNote] = useState('');
  const [submittingSale, setSubmittingSale] = useState(false);

  // Customer Mode: 'existing' | 'new'
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [searchedCustomers, setSearchedCustomers] = useState<SearchedCustomer[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<SearchedCustomer | null>(null);

  // New Customer Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newDivision, setNewDivision] = useState('Dhaka');
  const [newDistrict, setNewDistrict] = useState('Dhaka');
  const [newThana, setNewThana] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  // Completed Invoice Modal state
  const [completedInvoice, setCompletedInvoice] = useState<PosSaleRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Sales History Drawer state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [posSalesHistory, setPosSalesHistory] = useState<PosSaleRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    let mounted = true;
    settingsService.getPublicSettings().then((siteSettings) => {
      if (!mounted) return;
      const configured = (siteSettings.payment?.methods || []).filter((method) => method.isActive);
      const codes = configured.length > 0
        ? configured
        : (siteSettings.payment?.enabledGateways || []).map((code) => ({
            id: code,
            code,
            nameBn: code,
            nameEn: code,
            isActive: true,
          }));
      setPaymentMethods(codes);
      if (codes.length > 0 && !codes.some((method) => (method.code || method.id) === paymentMethod)) {
        const firstCode = (codes[0].code || codes[0].id) === 'cod' ? 'cash' : (codes[0].code || codes[0].id);
        if (['cash', 'card', 'bkash', 'nagad'].includes(firstCode)) setPaymentMethod(firstCode as typeof paymentMethod);
      }
    }).catch(() => setPaymentMethods([]));
    return () => { mounted = false; };
  }, []);

  // Available packaging units for a product
  const getProductUnitOptions = useCallback((p: Product) => {
    const options: { unit: string; multiplier: number; price: number }[] = [];
    const baseUnit = p.unitType || (p as any).baseUnit || 'pcs';

    // Base unit
    options.push({
      unit: baseUnit,
      multiplier: 1,
      price: p.price,
    });

    // Packaging array
    const rawPackaging = (p as any).packaging;
    if (Array.isArray(rawPackaging)) {
      rawPackaging.forEach((pkg: any) => {
        if (pkg.unit && pkg.unit !== baseUnit && pkg.isActive !== false) {
          options.push({
            unit: pkg.unit,
            multiplier: pkg.baseUnitQty || 1,
            price: pkg.price || p.price * (pkg.baseUnitQty || 1),
          });
        }
      });
    }

    // Common pharmaceutical unit fallbacks
    if (options.length === 1) {
      if (p.dosageForm === 'tablet' || p.dosageForm === 'capsule') {
        options.push({
          unit: 'strip (10 pcs)',
          multiplier: 10,
          price: p.price * 10,
        });
        options.push({
          unit: 'box (100 pcs)',
          multiplier: 100,
          price: p.price * 100,
        });
      }
    }

    return options;
  }, []);

  // Fetch product catalog server-side
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const queryParams: any = {
        page,
        limit,
        search: search.trim() || undefined,
        category: categoryQuery || undefined,
        brand: brandQuery || undefined,
        dosageForm: dosageQuery || undefined,
        includeInactive: false,
      };

      const res = await ProductService.getProducts(queryParams);
      let list = res.products || [];

      // Apply client-side stock filter on returned results if applicable
      if (stockFilter === 'in_stock') {
        list = list.filter((p) => p.stock > 10);
      } else if (stockFilter === 'low_stock') {
        list = list.filter((p) => p.stock > 0 && p.stock <= 10);
      } else if (stockFilter === 'out_of_stock') {
        list = list.filter((p) => p.stock <= 0);
      }

      setProducts(list);
      setTotalCount(res.total || res.totalCount || list.length);
      setTotalPages(res.totalPages || Math.ceil((res.total || 1) / limit) || 1);

      // Initialize selected units
      const initialUnits: Record<string, any> = {};
      list.forEach((p) => {
        const opts = getProductUnitOptions(p);
        initialUnits[p.id] = opts[0];
      });
      setSelectedUnits((prev) => ({ ...initialUnits, ...prev }));
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ওষুধ ক্যাটালগ লোড ব্যর্থ হয়েছে' : 'Failed to load medicine catalog'));
    } finally {
      setLoadingProducts(false);
    }
  }, [page, limit, search, categoryQuery, brandQuery, dosageQuery, stockFilter, getProductUnitOptions, isBn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Real-time Customer Search (Only triggers when user types 2+ characters)
  useEffect(() => {
    const clean = customerSearchQuery.trim();
    if (customerMode !== 'existing' || clean.length < 2) {
      setSearchedCustomers([]);
      setIsSearchingCustomer(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingCustomer(true);
        const results = await staffInvitationService.searchCustomers(clean);
        setSearchedCustomers(results || []);
      } catch (err) {
        console.error('Customer search error:', err);
      } finally {
        setIsSearchingCustomer(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearchQuery, customerMode]);

  // Add Item to POS Cart
  const handleAddToCart = (product: Product, unitOption?: { unit: string; multiplier: number; price: number }) => {
    const activeUnit = unitOption || selectedUnits[product.id] || getProductUnitOptions(product)[0];

    // Check central stock
    const requiredPieces = activeUnit.multiplier;
    if (product.stock < requiredPieces) {
      toast.error(
        isBn
          ? `দুঃখিত! ${product.name} ওষুধটির প্রয়োজনীয় স্টক (${requiredPieces} pcs) নেই`
          : `Insufficient stock for ${product.name} (Requires ${requiredPieces} pcs)`
      );
      return;
    }

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedUnit === activeUnit.unit
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const nextQty = updated[existingIdx].quantity + 1;
        const totalPieces = nextQty * activeUnit.multiplier;

        if (product.stock < totalPieces) {
          toast.error(isBn ? 'স্টকের চেয়ে বেশি পরিমাণ যুক্ত করা সম্ভব নয়' : 'Cannot exceed available stock');
          return prev;
        }

        updated[existingIdx].quantity = nextQty;
        updated[existingIdx].totalPrice = nextQty * activeUnit.price;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedUnit: activeUnit.unit,
          unitMultiplier: activeUnit.multiplier,
          quantity: 1,
          unitPrice: activeUnit.price,
          totalPrice: activeUnit.price,
        },
      ];
    });

    toast.success(
      isBn
        ? `${product.name} (${activeUnit.unit}) কার্টে যুক্ত হয়েছে`
        : `Added ${product.name} (${activeUnit.unit}) to cart`
    );
  };

  // Modify Cart Item Qty
  const handleUpdateQty = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const newQty = target.quantity + delta;

      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }

      const totalRequired = newQty * target.unitMultiplier;
      if (target.product.stock < totalRequired) {
        toast.error(isBn ? 'স্টকের চেয়ে বেশি পরিমাণ দেওয়া সম্ভব নয়' : 'Stock limit reached');
        return prev;
      }

      target.quantity = newQty;
      target.totalPrice = newQty * target.unitPrice;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateUnit = (index: number, unit: string) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const option = getProductUnitOptions(target.product).find((item) => item.unit === unit);
      if (!option) return prev;

      const existingBaseQty = target.quantity * target.unitMultiplier;
      const nextQty = Math.max(1, Math.ceil(existingBaseQty / option.multiplier));
      if (target.product.stock < nextQty * option.multiplier) {
        toast.error(isBn ? 'নির্বাচিত ইউনিটের জন্য পর্যাপ্ত স্টক নেই' : 'Not enough stock for the selected unit');
        return prev;
      }

      updated[index] = {
        ...target,
        selectedUnit: option.unit,
        unitMultiplier: option.multiplier,
        quantity: nextQty,
        unitPrice: option.price,
        totalPrice: nextQty * option.price,
      };
      return updated;
    });
  };

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  const grandTotal = useMemo(() => {
    const total = subtotal - (discountAmount || 0);
    return Math.max(0, total);
  }, [subtotal, discountAmount]);

  const changeAmount = useMemo(() => {
    if (paidAmount <= 0) return 0;
    return Math.max(0, paidAmount - grandTotal);
  }, [paidAmount, grandTotal]);

  // Submit POS Sale Checkout
  const handleProcessSale = async () => {
    if (cartItems.length === 0) {
      toast.error(isBn ? 'কার্ট খালি! প্রথমে ওষুধ যুক্ত করুন।' : 'Cart is empty!');
      return;
    }

    let custName = '';
    let custPhone = '';
    let custEmail = '';
    let custAddress = '';
    let customerUserId: string | undefined = undefined;

    if (customerMode === 'existing') {
      if (!selectedCustomer) {
        toast.error(
          isBn
            ? 'দয়া করে বিদ্যমান গ্রাহক নির্বাচন করুন অথবা "নতুন গ্রাহক" মোড ব্যবহার করুন'
            : 'Please select an existing customer or switch to New Customer mode'
        );
        return;
      }
      custName = selectedCustomer.name;
      custPhone = selectedCustomer.phone || '';
      custEmail = selectedCustomer.email || '';
      customerUserId = selectedCustomer._id;
      if (selectedCustomer.addresses && selectedCustomer.addresses.length > 0) {
        custAddress = `${selectedCustomer.addresses[0].address || ''}, ${selectedCustomer.addresses[0].district || ''}`;
      }
    } else {
      if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
        toast.error(
          isBn
            ? 'নতুন গ্রাহকের নাম এবং মোবাইল নম্বর আবশ্যক'
            : 'New customer Name and Phone number are required'
        );
        return;
      }
      custName = newCustomerName.trim();
      custPhone = newCustomerPhone.trim();
      custEmail = newCustomerEmail.trim();
      custAddress = `${newAddressLine || ''}, ${newThana || ''}, ${newDistrict || ''}, ${newDivision} Division`;
    }

    try {
      setSubmittingSale(true);

      const itemsPayload = cartItems.map((ci) => ({
        productId: ci.product.id,
        quantity: ci.quantity * ci.unitMultiplier,
        unit: ci.selectedUnit,
        unitPrice: ci.unitMultiplier > 0 ? Number((ci.unitPrice / ci.unitMultiplier).toFixed(2)) : ci.product.price,
      }));

      const payload = {
        customerName: custName,
        customerPhone: custPhone,
        customerEmail: custEmail || undefined,
        customerAddress: custAddress || undefined,
        customerUser: customerUserId,
        items: itemsPayload,
        paidAmount: paidAmount > 0 ? paidAmount : grandTotal,
        paymentMethod,
        discountAmount: discountAmount || 0,
        taxAmount: 0,
        note:
          customerMode === 'new' && (newDivision || newAddressLine)
            ? `Address: ${custAddress}. Note: ${saleNote}`
            : saleNote,
      };

      const result = await posService.processPosSale(payload);

      setCompletedInvoice(result);
      setIsReceiptModalOpen(true);
      toast.success(
        isBn
          ? `বিক্রয় সফল হয়েছে! ইনভয়েস: #${result.invoiceNumber}`
          : `Sale completed! Invoice #${result.invoiceNumber}`
      );

      // Reset POS Cart
      setCartItems([]);
      setDiscountAmount(0);
      setPaidAmount(0);
      setSaleNote('');
      setSelectedCustomer(null);
      setCustomerSearchQuery('');
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerEmail('');
      setNewAddressLine('');
      setNewThana('');

      // Refresh product list stock
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'বিক্রয় সম্পন্ন করা যায়নি' : 'Failed to complete sale'));
    } finally {
      setSubmittingSale(false);
    }
  };

  // Open Sales History Drawer
  const handleOpenHistory = async () => {
    setIsHistoryModalOpen(true);
    try {
      setLoadingHistory(true);
      const data = await posService.getPosSales();
      setPosSalesHistory(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'হিস্ট্রি লোড করা যায়নি' : 'Failed to load sales history'));
    } finally {
      setLoadingHistory(false);
    }
  };

  // Void Sale
  const handleVoidSale = async (invoiceNumber: string) => {
    if (
      !confirm(
        isBn
          ? `আপনি কি ইনভয়েস #${invoiceNumber} বাতিল করে সেন্ট্রাল স্টক রিস্টোর করতে চান?`
          : `Are you sure you want to void invoice #${invoiceNumber} and restore stock?`
      )
    ) {
      return;
    }

    try {
      await posService.voidPosSale(invoiceNumber);
      toast.success(isBn ? 'ইনভয়েস বাতিল এবং স্টক রিস্টোর হয়েছে!' : 'Invoice voided and stock restored!');
      handleOpenHistory();
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভয়েস বাতিল করা যায়নি' : 'Failed to void invoice'));
    }
  };

  const handleDownloadReceipt = async (invoiceNumber: string) => {
    try {
      const blob = await posService.downloadInvoice(invoiceNumber);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `receipt-${invoiceNumber}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Receipt download failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar (Same Design as Admin Product Management) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {isBn ? 'ইন-স্টোর পিওএস বিলিং টার্মিনাল' : 'In-Store POS Billing Terminal'}
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {isBn
                ? `মোট ${formatNumber(totalCount, 'bn')} টি ওষুধ ক্যাটালগে মজুদ আছে`
                : `Total ${formatNumber(totalCount, 'en')} products available for billing`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenHistory}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-all cursor-pointer shrink-0"
        >
          <History className="h-4 w-4 text-primary" />
          <span>{isBn ? 'আজকের বিক্রয় হিস্ট্রি' : 'Sales Receipts Log'}</span>
        </button>
      </div>

      {/* 2. Main POS Workspace Grid: Left 7 Cols (Product Table), Right 5 Cols (Billing Cart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Filter Bar, Table & Pagination (7 Cols) */}
        <div className={`${posStep === 'products' ? 'block' : 'hidden'} lg:col-span-12 space-y-4`}>
          {/* Filter and Search Toolbar (Exact Same Design as Admin Product Manager) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={isBn ? 'ওষুধের নাম বা জেনেরিক...' : 'Search medicine name...'}
                className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:ring-0 focus:outline-none transition-colors shadow-2xs"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Category Filter */}
            <CustomSelect
              value={categoryQuery}
              onChange={(val) => {
                setCategoryQuery(val);
                setPage(1);
              }}
              options={[
                { value: '', label: isBn ? 'সকল ক্যাটাগরি' : 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />

            {/* Brand Filter */}
            <CustomSelect
              value={brandQuery}
              onChange={(val) => {
                setBrandQuery(val);
                setPage(1);
              }}
              options={[
                { value: '', label: isBn ? 'সকল ব্র‍্যান্ড' : 'All Brands' },
                ...brands.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />

            {/* Dosage Form Filter */}
            <CustomSelect
              value={dosageQuery}
              onChange={(val) => {
                setDosageQuery(val);
                setPage(1);
              }}
              options={DOSAGE_FORMS}
            />
          </div>

          {/* Stock Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: 'all', labelBn: 'সকল ওষুধ', labelEn: 'All Medicines' },
              { id: 'in_stock', labelBn: 'মজুদ আছে (In Stock)', labelEn: 'In Stock' },
              { id: 'low_stock', labelBn: 'স্বল্প মজুদ (Low Stock)', labelEn: 'Low Stock' },
              { id: 'out_of_stock', labelBn: 'স্টক শেষ (Out of Stock)', labelEn: 'Out of Stock' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStockFilter(st.id as any);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-black whitespace-nowrap transition-all cursor-pointer ${
                  stockFilter === st.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {isBn ? st.labelBn : st.labelEn}
              </button>
            ))}
          </div>

          {/* Product Data Table (Exact Same Layout & Typography as Admin Product Manager) */}
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-2xs">
            {loadingProducts ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-xs font-bold text-muted-foreground space-y-1">
                <p>{isBn ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicines found matching criteria'}</p>
                <p className="text-[11px] font-normal text-muted-foreground/70">
                  {isBn ? 'ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন' : 'Try adjusting your search filters'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto min-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                      <th className="py-3 px-3.5">{isBn ? 'প্রোডাক্ট' : 'Product'}</th>
                      <th className="py-3 px-3">{isBn ? 'ডোজ ও ফর্ম' : 'Dosage'}</th>
                      <th className="py-3 px-3">{isBn ? 'ব্র্যান্ড' : 'Brand'}</th>
                      <th className="py-3 px-3">{isBn ? 'প্যাকেজিং ও প্রাইস' : 'Packaging & Price'}</th>
                      <th className="py-3 px-3">{isBn ? 'স্টক' : 'Stock'}</th>
                      <th className="py-3 px-3.5 text-right">{isBn ? 'কার্টে যুক্ত করুন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {products.map((p) => {
                      const unitOptions = getProductUnitOptions(p);
                      const currentSelected = selectedUnits[p.id] || unitOptions[0];
                      const isOutOfStock = p.stock <= 0;
                      const isLowStock = p.stock > 0 && p.stock <= 10;
                      const brandName = typeof p.brand === 'object' ? p.brand?.name : p.brandName || p.brand || 'Pharma';

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isOutOfStock ? 'opacity-60 bg-muted/10' : ''
                          }`}
                        >
                          {/* Image & Title */}
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                                <Image
                                  src={
                                    p.image && p.image.trim() !== ''
                                      ? p.image
                                      : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'
                                  }
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-foreground truncate max-w-[140px] text-xs">
                                    {p.name}
                                  </span>
                                  {p.requiresRx && (
                                    <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-600 border border-rose-500/20">
                                      Rx
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                                  {p.genericName || '-'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Dosage & Strength */}
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center rounded-lg bg-primary/10 px-1.5 py-0.5 text-[9px] font-black text-primary uppercase">
                              {p.dosageForm}
                            </span>
                            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                              {p.strength || '-'}
                            </p>
                          </td>

                          {/* Brand */}
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-foreground text-[11px] truncate max-w-[100px]">{brandName}</p>
                          </td>

                          {/* Unit Selection & Packaging Price */}
                          <td className="py-2.5 px-3">
                            {unitOptions.length > 1 ? (
                              <select
                                value={currentSelected?.unit}
                                onChange={(e) => {
                                  const targetOpt = unitOptions.find((u) => u.unit === e.target.value);
                                  if (targetOpt) {
                                    setSelectedUnits((prev) => ({ ...prev, [p.id]: targetOpt }));
                                  }
                                }}
                                className="h-7 rounded-xl border border-border bg-background px-2 text-[10px] font-extrabold text-foreground shadow-2xs cursor-pointer focus:border-primary focus:outline-none"
                              >
                                {unitOptions.map((opt, oIdx) => (
                                  <option key={oIdx} value={opt.unit}>
                                    {opt.unit} (৳{opt.price.toFixed(2)})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="font-extrabold text-foreground text-xs">
                                ৳{p.price.toFixed(2)}
                                <span className="text-[10px] text-muted-foreground font-normal ml-0.5">/{unitOptions[0]?.unit || 'pcs'}</span>
                              </span>
                            )}
                          </td>

                          {/* Stock Status Badge */}
                          <td className="py-2.5 px-3">
                            {isOutOfStock ? (
                              <span className="inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-600 border border-rose-500/20">
                                {isBn ? 'স্টক শেষ' : '0 Stock'}
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-600 border border-amber-500/20">
                                {p.stock} pcs
                              </span>
                            ) : (
                              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary border border-primary/20">
                                {p.stock} pcs
                              </span>
                            )}
                          </td>

                          {/* Action: 1-Click Add to Cart Button */}
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() => handleAddToCart(p, currentSelected)}
                              className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-extrabold text-white shadow-2xs hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>{isBn ? 'যোগ করুন' : 'Add'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls (Exact Same Design as Admin Product Manager) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border bg-muted/20 p-3.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold">
                  {isBn ? 'প্রতি পেজে সারি:' : 'Rows per page:'}
                </span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-8 rounded-xl border border-border bg-background px-2 text-xs font-bold text-foreground shadow-2xs cursor-pointer focus:border-primary focus:outline-none"
                >
                  <option value={10}>{formatNumber(10, isBn ? 'bn' : 'en')}</option>
                  <option value={20}>{formatNumber(20, isBn ? 'bn' : 'en')}</option>
                  <option value={50}>{formatNumber(50, isBn ? 'bn' : 'en')}</option>
                </select>
                <span className="text-muted-foreground ml-2">
                  {isBn
                    ? `মোট ${formatNumber(totalCount, 'bn')} টির মধ্যে ${(page - 1) * limit + 1}-${Math.min(
                        page * limit,
                        totalCount
                      )} দেখাচ্ছে`
                    : `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, totalCount)} of ${totalCount} entries`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1 || loadingProducts}
                  onClick={() => setPage(1)}
                  className="h-8 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  {isBn ? 'প্রথম' : 'First'}
                </button>
                <button
                  type="button"
                  disabled={page <= 1 || loadingProducts}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl border border-border bg-background text-foreground shadow-2xs hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-black text-foreground">
                  {formatNumber(page, isBn ? 'bn' : 'en')} / {formatNumber(totalPages, isBn ? 'bn' : 'en')}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || loadingProducts}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-xl border border-border bg-background text-foreground shadow-2xs hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loadingProducts}
                  onClick={() => setPage(totalPages)}
                  className="h-8 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  {isBn ? 'শেষ' : 'Last'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => setPosStep('sale')}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-black text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBn ? 'সেল স্ক্রিনে যান' : 'Continue to Sale'} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: POS Billing Terminal Cart (5 Cols) */}
        <div className={`${posStep === 'sale' ? 'block' : 'hidden'} lg:col-span-12 rounded-3xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between space-y-4`}>
          <div className="space-y-4">
            {/* Terminal Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-black text-foreground font-serif-title">
                  {isBn ? 'কাউন্টার সেলস কার্ট' : 'POS Sales Cart'}
                </h3>
              </div>
              <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {cartItems.length} {isBn ? 'টি আইটেম' : 'items'}
              </span>
            </div>

            {/* Customer Mode Selection Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/40 p-1 text-[11px] font-extrabold">
              <button
                type="button"
                onClick={() => setCustomerMode('existing')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  customerMode === 'existing'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>{isBn ? '১. বিদ্যমান গ্রাহক সার্চ' : '1. Existing Customer'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerMode('new')}
                className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  customerMode === 'new'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isBn ? '২. নতুন গ্রাহক ও ঠিকানা' : '2. New Customer & Address'}</span>
              </button>
            </div>

            {/* Existing Customer Autocomplete Search */}
            {customerMode === 'existing' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder={isBn ? 'নাম, ফোন নম্বর বা ইমেইল দিয়ে সার্চ করুন...' : 'Search by name, phone or email...'}
                    className="w-full rounded-2xl border border-border bg-muted/20 py-2 pl-9 pr-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
                  />
                  {isSearchingCustomer && (
                    <Loader2 className="absolute right-3 top-2.5 h-3.5 w-3.5 animate-spin text-primary" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchedCustomers.length > 0 && !selectedCustomer && (
                  <div className="rounded-2xl border border-border bg-background p-2 shadow-lg max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                    {searchedCustomers.map((cust) => (
                      <div
                        key={cust._id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setCustomerSearchQuery('');
                        }}
                        className="p-2 rounded-xl hover:bg-muted/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-foreground">{cust.name}</p>
                          <p className="text-[10px] text-muted-foreground">{cust.phone || cust.email}</p>
                        </div>
                        <span className="text-[10px] text-primary font-bold capitalize bg-primary/10 px-2 py-0.5 rounded-full">
                          {cust.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Existing Customer Card */}
                {selectedCustomer && (
                  <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span className="font-black text-foreground">{selectedCustomer.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{selectedCustomer.phone || selectedCustomer.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      {isBn ? 'পরিবর্তন' : 'Change'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* New Customer Registration Fields */}
            {customerMode === 'new' && (
              <div className="space-y-2.5 p-3 rounded-2xl border border-border bg-muted/10 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder={isBn ? 'গ্রাহকের পুরো নাম *' : 'Full Name *'}
                    required
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 font-semibold text-foreground focus:border-primary focus:outline-hidden"
                  />
                  <input
                    type="tel"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder={isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                    required
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 font-semibold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder={isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                  />
                  <select
                    value={newDivision}
                    onChange={(e) => {
                      setNewDivision(e.target.value);
                      setNewDistrict(e.target.value);
                    }}
                    className="rounded-2xl border border-border bg-background px-3 py-2 font-semibold text-foreground shadow-2xs focus:border-primary focus:outline-hidden cursor-pointer"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div} Division
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newThana}
                    onChange={(e) => setNewThana(e.target.value)}
                    placeholder={isBn ? 'থানা / উপজেলা' : 'Thana / Upazila'}
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    placeholder={isBn ? 'রাস্তা / বাড়ি / ফ্ল্যাট নং' : 'Street / Area Address'}
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground font-semibold">
                  {isBn ? 'কার্টে কোনো ওষুধ যুক্ত করা হয়নি' : 'No medicine added to cart'}
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedUnit}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-2xl border border-border bg-muted/20 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-foreground truncate">{item.product.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <select
                          value={item.selectedUnit}
                          onChange={(event) => handleUpdateUnit(idx, event.target.value)}
                          className="max-w-[135px] rounded-lg border border-border bg-background px-1.5 py-1 text-[10px] font-bold text-foreground focus:border-primary focus:outline-none"
                        >
                          {getProductUnitOptions(item.product).map((option) => (
                            <option key={option.unit} value={option.unit}>{option.unit}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-muted-foreground">৳{item.unitPrice.toFixed(2)} / unit</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(idx, -1)}
                          className="px-2 py-1 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-black text-xs min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(idx, 1)}
                          className="px-2 py-1 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-black text-foreground min-w-[55px] text-right">
                        ৳{item.totalPrice.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveCartItem(idx)}
                        className="p-1 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Pricing, Payment & Checkout */}
          <div className="pt-3 border-t border-border space-y-3">
            <button
              type="button"
              onClick={() => setPosStep('products')}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> {isBn ? 'পণ্য বাছাইয়ে ফিরুন' : 'Back to products'}
            </button>
            {/* Pricing Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground font-semibold">
                <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">{isBn ? 'ডিসকাউন্ট (৳)' : 'Discount (৳)'}</span>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-24 text-right rounded-xl border border-border bg-background px-2 py-1 text-xs font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex justify-between text-base font-black text-foreground pt-1 border-t border-border/60">
                <span>{isBn ? 'মোট প্রদেয়' : 'Grand Total'}</span>
                <span className="text-primary">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[10px] font-black">
              {paymentMethods.map((pm) => {
                const rawCode = (pm.code || pm.id).toLowerCase();
                const code = rawCode === 'cod' ? 'cash' : rawCode;
                return (
                  <button
                    key={pm.id || code}
                    type="button"
                    onClick={() => ['cash', 'card', 'bkash', 'nagad'].includes(code) && setPaymentMethod(code as typeof paymentMethod)}
                    className={`py-2 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      paymentMethod === code
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <PaymentBrandIcon code={code} logo={pm.logo || pm.icon} className="gap-0" isBn={isBn} />
                    <span>{isBn ? pm.nameBn : pm.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Paid Amount & Change Calculation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  {isBn ? 'গ্রাহক দিয়েছেন (৳)' : 'Customer Paid (৳)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  placeholder={grandTotal.toFixed(2)}
                  className="w-full rounded-xl border border-border bg-background px-2.5 py-1.5 font-black text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  {isBn ? 'ফেরত দিন (৳)' : 'Change Due (৳)'}
                </label>
                <div className="rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 font-black text-primary">
                  ৳{changeAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Complete Sale Action Button */}
            <button
              type="button"
              disabled={cartItems.length === 0 || submittingSale}
              onClick={handleProcessSale}
              className="w-full rounded-2xl bg-primary hover:bg-primary-dark text-white py-3 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingSale ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBn ? 'বিল তৈরি হচ্ছে...' : 'Processing Sale...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {isBn
                      ? `বিক্রয় সম্পন্ন করুন (৳${grandTotal.toFixed(2)})`
                      : `Complete Sale (৳${grandTotal.toFixed(2)})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Thermal Cash Receipt Modal */}
      {isReceiptModalOpen && completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-black text-sm font-serif-title">{isBn ? 'মেমো ক্যাশ রিসিপ্ট' : 'Thermal Print Receipt'}</h3>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-border bg-white text-slate-900 space-y-3">
              <div className="text-center space-y-0.5">
                <h2 className="text-lg font-black tracking-tight">{settings?.general?.siteName || 'mediShop'} Pharmacy</h2>
                <p className="text-[10px] text-slate-600">Central Pharmacy Counter • Hotline: 16780</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 text-[11px] space-y-0.5">
                <p>
                  <strong>Invoice:</strong> {completedInvoice.invoiceNumber}
                </p>
                <p>
                  <strong>Cashier:</strong> {completedInvoice.sellerName || 'Staff'}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(completedInvoice.createdAt).toLocaleString()}
                </p>

                {/* Customer Profile Details */}
                <div className="pt-1 mt-1 border-t border-dotted border-slate-200 space-y-0.5">
                  <p>
                    <strong>Customer:</strong> {completedInvoice.customerName || 'Walk-in Customer'}
                  </p>
                  {completedInvoice.customerPhone && (
                    <p>
                      <strong>Phone:</strong> {completedInvoice.customerPhone}
                    </p>
                  )}
                  {completedInvoice.customerEmail && (
                    <p>
                      <strong>Email:</strong> {completedInvoice.customerEmail}
                    </p>
                  )}
                  {(completedInvoice.customerAddress ||
                    completedInvoice.customerUser?.addresses?.[0]?.address) && (
                    <p>
                      <strong>Address:</strong>{' '}
                      {completedInvoice.customerAddress ||
                        `${completedInvoice.customerUser?.addresses?.[0]?.address || ''}, ${
                          completedInvoice.customerUser?.addresses?.[0]?.district || ''
                        }`}
                    </p>
                  )}
                </div>

                <p className="pt-1">
                  <strong>Payment:</strong> {completedInvoice.paymentMethod?.toUpperCase()}
                </p>
              </div>

              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Unit / Qty</th>
                    <th className="py-1 text-right">Unit Price</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-semibold">{item.productName}</td>
                      <td className="py-1 text-center">{item.unit || 'pcs'} / {item.quantity}</td>
                      <td className="py-1 text-right">৳{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1 text-right">৳{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-right font-semibold">
                <p>Subtotal: ৳{completedInvoice.subtotal?.toFixed(2)}</p>
                {completedInvoice.discountAmount > 0 && <p>Discount: -৳{completedInvoice.discountAmount?.toFixed(2)}</p>}
                <p>Paid: ৳{completedInvoice.paidAmount?.toFixed(2)}</p>
                <p>Change / Due: ৳{Math.max(0, completedInvoice.changeAmount || 0).toFixed(2)}</p>
                <p className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  Grand Total: ৳{completedInvoice.grandTotal?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-2xl border border-border bg-background py-3 font-bold text-foreground shadow-xs hover:bg-muted flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>{isBn ? 'প্রিন্ট মেমো' : 'Print Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!completedInvoice) return;
                  void handleDownloadReceipt(completedInvoice.invoiceNumber);
                  if (Boolean(false)) {
                  const printWin = window.open('', '_blank');
                  if (!printWin) {
                    window.print();
                    return;
                  }
                  const html = `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>${completedInvoice.invoiceNumber}.pdf</title>
                        <style>
                          body { font-family: monospace; font-size: 12px; margin: 20px; color: #0f172a; }
                          .box { max-width: 360px; margin: 0 auto; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 8px; }
                          .text-center { text-align: center; }
                          .divider { border-top: 1px dashed #cbd5e1; margin: 8px 0; }
                          .row { display: flex; justify-content: space-between; margin: 3px 0; }
                          table { width: 100%; border-collapse: collapse; margin: 8px 0; }
                          th { text-align: left; border-bottom: 1px solid #cbd5e1; padding: 4px 0; font-size: 11px; }
                          td { padding: 4px 0; font-size: 11px; }
                          .text-right { text-align: right; }
                          .text-center { text-align: center; }
                          .total { font-size: 14px; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 5px; margin-top: 5px; }
                        </style>
                      </head>
                      <body>
                        <div class="box">
                          <div class="text-center">
                            <h2 style="margin:0;font-size:18px;">mediShop Pharmacy</h2>
                            <p style="margin:2px 0 0;font-size:10px;color:#64748b;">Central Pharmacy Counter • Hotline: 16780</p>
                          </div>
                          <div class="divider"></div>
                          <div class="row"><span><strong>Invoice:</strong></span><span>${completedInvoice.invoiceNumber}</span></div>
                          <div class="row"><span><strong>Date:</strong></span><span>${new Date(completedInvoice.createdAt).toLocaleString()}</span></div>
                          <div class="row"><span><strong>Customer:</strong></span><span>${completedInvoice.customerName || 'Walk-in'}</span></div>
                          ${completedInvoice.customerPhone ? `<div class="row"><span><strong>Phone:</strong></span><span>${completedInvoice.customerPhone}</span></div>` : ''}
                          ${completedInvoice.customerEmail ? `<div class="row"><span><strong>Email:</strong></span><span>${completedInvoice.customerEmail}</span></div>` : ''}
                          ${completedInvoice.customerAddress ? `<div class="row"><span><strong>Address:</strong></span><span>${completedInvoice.customerAddress}</span></div>` : ''}
                          <div class="row"><span><strong>Payment:</strong></span><span>${completedInvoice.paymentMethod?.toUpperCase()}</span></div>
                          <div class="divider"></div>
                          <table>
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th class="text-center">Qty</th>
                                <th class="text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${completedInvoice.items?.map((i) => `
                                <tr>
                                  <td>${i.productName}</td>
                                  <td class="text-center">${i.quantity}</td>
                                  <td class="text-right">৳${i.totalPrice.toFixed(2)}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          <div class="divider"></div>
                          <div class="row"><span>Subtotal:</span><span>৳${completedInvoice.subtotal?.toFixed(2)}</span></div>
                          ${completedInvoice.discountAmount > 0 ? `<div class="row"><span>Discount:</span><span>-৳${completedInvoice.discountAmount?.toFixed(2)}</span></div>` : ''}
                          <div class="row total"><span>Grand Total:</span><span>৳${completedInvoice.grandTotal?.toFixed(2)}</span></div>
                          <div class="row"><span>Paid Amount:</span><span>৳${completedInvoice.paidAmount?.toFixed(2)}</span></div>
                          ${completedInvoice.changeAmount > 0 ? `<div class="row"><span>Change:</span><span>৳${completedInvoice.changeAmount?.toFixed(2)}</span></div>` : ''}
                        </div>
                        <script>
                          window.onload = function() { window.print(); };
                        </script>
                      </body>
                    </html>
                  `;
                  printWin.document.write(html);
                  printWin.document.close();
                  }
                }}
                className="rounded-2xl bg-primary py-3 font-extrabold text-white shadow-md hover:bg-primary-dark flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="h-4 w-4" />
                <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Sales History Drawer / Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'আজকের বিক্রয় মেমো লেজার ও গ্রাহক প্রোফাইল' : 'Today POS Invoices & Customer Profiles'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar pr-1">
              {loadingHistory ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : posSalesHistory.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground font-bold">
                  {isBn ? 'আজকে কোনো মেমো তৈরি হয়নি' : 'No sales invoices created yet today'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {posSalesHistory.map((sale, idx) => (
                    <div
                      key={sale._id || sale.id || sale.invoiceNumber || idx}
                      className="p-3.5 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-black text-xs shrink-0 border border-primary/20">
                          {sale.customerUser?.avatar ? (
                            <img
                              src={sale.customerUser.avatar}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            (sale.customerName || 'W').charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-foreground">#{sale.invoiceNumber}</span>
                            <span className="uppercase text-[9px] font-black text-primary bg-primary/10 px-2 py-0.2 rounded-full">
                              {sale.paymentMethod}
                            </span>
                            {sale.customerUser?.role && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-1.5 py-0.2 rounded-full font-bold capitalize">
                                {sale.customerUser.role}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-foreground">
                            {sale.customerName || 'Walk-in Customer'}
                            {sale.customerPhone && <span className="ml-2 font-normal text-muted-foreground">Phone: {sale.customerPhone}</span>}
                            {!sale.customerPhone && sale.customerEmail && <span className="ml-2 font-normal text-muted-foreground">Email: {sale.customerEmail}</span>}
                          </p>
                          {(sale.customerAddress || (sale.customerUser?.addresses && sale.customerUser.addresses.length > 0)) && (
                            <p className="text-[10px] text-muted-foreground/80 truncate max-w-[280px]">
                              📍 {sale.customerAddress || `${sale.customerUser?.addresses[0]?.address || ''}, ${sale.customerUser?.addresses[0]?.district || ''}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:justify-end">
                        <div className="text-right">
                          <span className="font-black text-foreground text-sm block">৳{sale.grandTotal.toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(sale.createdAt).toLocaleTimeString()}</span>
                        </div>
                        {sale.status === 'completed' ? (
                          <button
                            type="button"
                            onClick={() => handleVoidSale(sale.invoiceNumber)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-rose-200 bg-rose-50 text-[10px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>{isBn ? 'ভয়েড' : 'Void'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            Voided
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
