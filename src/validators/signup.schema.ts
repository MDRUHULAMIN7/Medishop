import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createSignUpSchema(isBn: boolean = true) {
  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, {
          message: isBn
            ? 'সম্পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে'
            : 'Full name must be at least 2 characters long',
        }),
      identifier: z
        .string()
        .trim()
        .min(1, {
          message: isBn
            ? 'ইমেইল অথবা মোবাইল নম্বর দিন'
            : 'Please enter email or mobile number',
        })
        .refine(
          (val) => emailRegex.test(val) || bdPhoneRegex.test(val),
          {
            message: isBn
              ? 'সঠিক ইমেইল অথবা ১১ ডিজিটের মোবাইল নম্বর দিন'
              : 'Enter a valid email or 11-digit BD mobile number',
          }
        ),
      password: z
        .string()
        .min(6, {
          message: isBn
            ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
            : 'Password must be at least 6 characters long',
        })
        .refine((val) => /[A-Za-z]/.test(val), {
          message: isBn
            ? 'পাসওয়ার্ডে কমপক্ষে একটি অক্ষর (A-Z, a-z) থাকতে হবে'
            : 'Password must contain at least one letter',
        })
        .refine((val) => /\d/.test(val), {
          message: isBn
            ? 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে'
            : 'Password must contain at least one number',
        }),
      confirmPassword: z.string().min(1, {
        message: isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Please confirm password',
      }),
      agreeToTerms: z.boolean().refine((val) => val === true, {
        message: isBn
          ? 'টার্মস ও প্রাইভেসির সাথে সম্মত হতে টিক দিন'
          : 'You must accept Terms & Privacy Policy',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: isBn ? 'পাসওয়ার্ড দুটি হুবহু মিলছে না' : 'Passwords do not match',
      path: ['confirmPassword'],
    });
}

export type SignUpSchemaType = z.infer<ReturnType<typeof createSignUpSchema>>;
