import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createSignInSchema(isBn: boolean = true) {
  return z.object({
    identifier: z
      .string()
      .trim()
      .min(1, {
        message: isBn
          ? 'ইমেইল অথবা মোবাইল নম্বর দিন'
          : 'Please enter your email or mobile number',
      })
      .refine(
        (val) => emailRegex.test(val) || bdPhoneRegex.test(val),
        {
          message: isBn
            ? 'সঠিক ইমেইল (যেমন: name@domain.com) অথবা ১১ ডিজিটের মোবাইল নম্বর (যেমন: 01700000000) দিন'
            : 'Enter a valid email or 11-digit BD mobile number (e.g. 01700000000)',
        }
      ),
    password: z
      .string()
      .min(1, {
        message: isBn ? 'পাসওয়ার্ড প্রদান করুন' : 'Please enter your password',
      }),
    rememberMe: z.boolean().optional(),
  });
}

export type SignInSchemaType = z.infer<ReturnType<typeof createSignInSchema>>;
