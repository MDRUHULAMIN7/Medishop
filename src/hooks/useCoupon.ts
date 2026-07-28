import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  selectAppliedCoupon,
  selectSubtotal,
} from '@/store/slices/cartSlice';
import { couponService } from '@/services/coupon.service';
import { couponSchema } from '@/validators/coupon.schema';
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

  const { trackCouponApplied } = useCartAnalytics();

  const handleApplyCoupon = useCallback(
    async (codeToApply?: string) => {
      const targetCode = codeToApply || couponCodeInput;
      setErrorMsg(null);

      // Validate input with Zod schema
      const validationResult = couponSchema.safeParse({ code: targetCode });
      if (!validationResult.success) {
        const firstErr = validationResult.error.errors[0]?.message;
        setErrorMsg(firstErr);
        toast.error(firstErr);
        return false;
      }

      const cleanCode = validationResult.data.code;
      setIsLoading(true);

      try {
        const result = await couponService.validateCoupon(cleanCode, subtotal);

        if (result.success && result.coupon) {
          dispatch(applyCouponAction(result.coupon));
          trackCouponApplied(result.coupon);

          cartEventBus.emit({
            type: 'CouponApplied',
            items: [],
            coupon: result.coupon,
            timestamp: Date.now(),
          });

          toast.success(isBn ? result.messageBn : result.messageEn);
          setCouponCodeInput('');
          setIsLoading(false);
          return true;
        } else {
          setErrorMsg(isBn ? result.messageBn : result.messageEn);
          toast.error(isBn ? result.messageBn : result.messageEn);
          setIsLoading(false);
          return false;
        }
      } catch (err) {
        const msg = isBn ? 'কুপন যাচাই করতে সমস্যা হয়েছে' : 'Failed to validate coupon';
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

  return {
    couponCodeInput,
    setCouponCodeInput,
    appliedCoupon,
    isLoading,
    errorMsg,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    availableCoupons: couponService.getAvailableCoupons(),
  };
}
