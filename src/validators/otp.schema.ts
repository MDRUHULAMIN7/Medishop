import { z } from 'zod';

export function createOtpSchema(isBn: boolean = true) {
  return z.object({
    otpCode: z
      .string()
      .trim()
      .length(6, {
        message: isBn
          ? '৬ ডিজিটের সঠিক ওটিপি কোড দিন'
          : 'OTP code must be exactly 6 digits',
      })
      .regex(/^\d{6}$/, {
        message: isBn
          ? 'ওটিপি কোড শুধুমাত্র ৬ সংখ্যার হতে হবে'
          : 'OTP code must contain exactly 6 numeric digits',
      }),
  });
}

export type OtpSchemaType = z.infer<ReturnType<typeof createOtpSchema>>;
