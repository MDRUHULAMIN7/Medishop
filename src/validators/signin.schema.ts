import { z } from 'zod';

export function createSignInSchema(isBn: boolean = true) {
  return z.object({
    identifier: z
      .string()
      .min(1, {
        message: isBn
          ? 'ইমেইল অথবা মোবাইল নম্বর দিন'
          : 'Please enter your email or mobile number',
      })
      .refine(
        (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
          return emailRegex.test(val) || bdPhoneRegex.test(val);
        },
        {
          message: isBn
            ? 'সঠিক ইমেইল (যেমন: name@domain.com) অথবা ১১ ডিজিটের মোবাইল নম্বর (যেমন: 01700000000) দিন'
            : 'Enter a valid email or 11-digit BD mobile number (e.g. 01700000000)',
        }
      ),
    password: z.string().min(6, {
      message: isBn
        ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
        : 'Password must be at least 6 characters long',
    }),
    rememberMe: z.boolean().optional(),
  });
}

export type SignInSchemaType = z.infer<ReturnType<typeof createSignInSchema>>;
