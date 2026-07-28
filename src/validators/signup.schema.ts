import { z } from 'zod';

export function createSignUpSchema(isBn: boolean = true) {
  return z
    .object({
      fullName: z.string().min(2, {
        message: isBn
          ? 'সম্পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে'
          : 'Full name must be at least 2 characters long',
      }),
      identifierType: z.enum(['email', 'phone']),
      email: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === '') return true;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          },
          {
            message: isBn
              ? 'সঠিক ইমেইল ফরম্যাট দিন (যেমন: name@example.com)'
              : 'Enter a valid email address',
          }
        ),
      phone: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === '') return true;
            return /^(?:\+88)?01[3-9]\d{8}$/.test(val);
          },
          {
            message: isBn
              ? '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 01700000000)'
              : 'Enter a valid 11-digit BD phone number (e.g. 01700000000)',
          }
        ),
      password: z
        .string()
        .min(8, {
          message: isBn
            ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে'
            : 'Password must be at least 8 characters long',
        })
        .regex(/[A-Z]/, {
          message: isBn
            ? 'কমপক্ষে একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে'
            : 'Password must contain at least one uppercase letter',
        })
        .regex(/[0-9]/, {
          message: isBn
            ? 'কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে'
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
      message: isBn
        ? 'পাসওয়ার্ড দুটি হুবহু মিলছে না'
        : 'Passwords do not match',
      path: ['confirmPassword'],
    })
    .refine(
      (data) => {
        if (data.identifierType === 'email') {
          return !!data.email && data.email.trim().length > 0;
        }
        if (data.identifierType === 'phone') {
          return !!data.phone && data.phone.trim().length > 0;
        }
        return true;
      },
      (data) => ({
        message: isBn
          ? data.identifierType === 'email'
            ? 'ইমেইল এড্রেস আবশ্যক'
            : 'মোবাইল নম্বর আবশ্যক'
          : data.identifierType === 'email'
          ? 'Email is required'
          : 'Phone number is required',
        path: [data.identifierType === 'email' ? 'email' : 'phone'],
      })
    );
}

export type SignUpSchemaType = z.infer<ReturnType<typeof createSignUpSchema>>;
