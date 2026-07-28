import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, { message: 'Coupon code must be at least 3 characters long' })
    .max(20, { message: 'Coupon code must not exceed 20 characters' })
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => /^[A-Z0-9_-]+$/.test(val), {
      message: 'Coupon code can only contain uppercase letters, numbers, hyphens, and underscores',
    }),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
