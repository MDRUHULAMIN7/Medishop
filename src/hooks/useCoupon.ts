import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  selectAppliedCoupon,
  selectSubtotal,
} from '@/store/slices/cartSlice';
import { CouponService, PublicCoupon } from '@/services/coupon.service';
import { AppliedCoupon } from '@/types/cart';
import { cartEventBus } from '@/utils/cartEvents';
import { useCartAnalytics } from './useCartAnalytics';

export function useCoupon() {
  const dispatch = useAppDispatch();
  const subtotal = useAppSelector(selectSubtotal);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publicCoupons, setPublicCoupons] = useState<PublicCoupon[]>([]);

  const { trackCouponApplied } = useCartAnalytics();

  // Load active public coupons for promo chips
  useEffect(() => {
    CouponService.getValidPublicCoupons()
      .then((data) => {
        if (Array.isArray(data)) setPublicCoupons(data);
      })
      .catch(() => {
        setPublicCoupons([]);
      });
  }, []);

  const handleApplyCoupon = useCallback(
    async (codeToApply?: string) => {
      const targetCode = (codeToApply || couponCodeInput).trim().toUpperCase();
      setErrorMsg(null);

      if (!targetCode) {
        const msg = isBn ? 'দয়া করে একটি কুপন কোড লিখুন' : 'Please enter a coupon code';
        setErrorMsg(msg);
        toast.error(msg);
        return false;
      }

      setIsLoading(true);

      try {
        const res = await CouponService.applyCoupon(targetCode, subtotal);

        const appliedCouponObj: AppliedCoupon = {
          code: res.coupon.code,
          type: res.coupon.discountType === 'percentage' ? 'percentage' : 'flat',
          value: res.coupon.discountValue,
          discountAmount: res.discountAmount,
          descriptionEn: res.message,
          descriptionBn: res.message,
        };

        dispatch(applyCouponAction(appliedCouponObj));
        trackCouponApplied(appliedCouponObj);

        cartEventBus.emit({
          type: 'CouponApplied',
          items: [],
          coupon: appliedCouponObj,
          timestamp: Date.now(),
        });

        toast.success(res.message);
        setCouponCodeInput('');
        setIsLoading(false);
        return true;
      } catch (err: any) {
        const msg = err?.message || (isBn ? 'কুপন কোডটি প্রযোজ্য নয়' : 'Invalid coupon code');
        setErrorMsg(msg);
        toast.error(msg);
        setIsLoading(false);
        return false;
      }
    },
    [dispatch, subtotal, couponCodeInput, isBn, trackCouponApplied]
  );

  const handleRemoveCoupon = useCallback(() => {
    dispatch(removeCouponAction());
    cartEventBus.emit({
      type: 'CouponRemoved',
      items: [],
      coupon: null,
      timestamp: Date.now(),
    });
    toast.info(isBn ? 'কুপন সেশন বাতিল করা হয়েছে' : 'Coupon removed');
  }, [dispatch, isBn]);

  const availableCoupons = publicCoupons.map((c) => ({
    code: c.code,
    descriptionEn: `Save ${c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}`,
    descriptionBn: `${c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`} ছাড়`,
  }));

  return {
    couponCodeInput,
    setCouponCodeInput,
    appliedCoupon,
    isLoading,
    errorMsg,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    availableCoupons,
  };
}
