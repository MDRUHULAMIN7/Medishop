import { z } from 'zod';

export function createOtpSchema(isBn: boolean = true) {
  return z.object({
    otpCode: z
      .string()
      .length(6, {
        message: isBn
          ? '৬ ডিজিটের সঠিক ওটিপি কোড দিন'
          : 'OTP code must be exactly 6 digits',
      })
      .regex(/^\d+$/, {
        message: isBn
          ? 'ওটিপি কোড শুধুমাত্র সংখ্যা হতে হবে'
          : 'OTP code must contain only numbers',
      }),
  });
}

export type OtpSchemaType = z.infer<ReturnType<typeof createOtpSchema>>;
