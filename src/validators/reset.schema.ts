import { z } from 'zod';

export function createResetPasswordSchema(isBn: boolean = true) {
  return z
    .object({
      password: z
        .string()
        .min(6, {
          message: isBn
            ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
            : 'Password must be at least 6 characters long',
        })
        .refine((val) => /[A-Za-z]/.test(val), {
          message: isBn
            ? 'পাসওয়ার্ডে কমপক্ষে একটি অক্ষর থাকতে হবে'
            : 'Password must contain at least one letter',
        })
        .refine((val) => /\d/.test(val), {
          message: isBn
            ? 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে'
            : 'Password must contain at least one number',
        }),
      confirmPassword: z.string().min(1, {
        message: isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Please confirm new password',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: isBn ? 'পাসওয়ার্ড দুটি হুবহু মিলছে না' : 'Passwords do not match',
      path: ['confirmPassword'],
    });
}

export type ResetPasswordSchemaType = z.infer<ReturnType<typeof createResetPasswordSchema>>;
