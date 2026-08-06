import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function createUserProfileSchema(isBn: boolean = true) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, {
          message: isBn
            ? 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'
            : 'Name must be at least 2 characters long',
        })
        .optional(),
      email: z
        .string()
        .trim()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === '') return true;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          },
          {
            message: isBn
              ? 'সঠিক ইমেইল ঠিকানা দিন (যেমন: name@example.com)'
              : 'Please enter a valid email address',
          }
        ),
      phone: z
        .string()
        .trim()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === '') return true;
            return bdPhoneRegex.test(val);
          },
          {
            message: isBn
              ? '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 01700000000)'
              : 'Enter a valid 11-digit BD mobile number (e.g. 01700000000)',
          }
        ),
      avatar: z
        .string()
        .trim()
        .optional()
        .nullable()
        .refine(
          (val) => {
            if (!val) return true;
            // Limit base64 or URL length string size to max 5MB
            return val.length <= MAX_AVATAR_SIZE_BYTES * 1.35;
          },
          {
            message: isBn
              ? 'প্রোফাইল ছবির সাইজ ৫ মেগাবাইটের (5MB) বেশি হওয়া যাবে না'
              : 'Profile picture must not exceed 5MB in size',
          }
        ),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.email !== undefined ||
        data.phone !== undefined ||
        data.avatar !== undefined,
      {
        message: isBn
          ? 'কমপক্ষে একটি তথ্য পরিবর্তন করতে হবে'
          : 'At least one field must be provided',
      }
    );
}

export type UserProfileSchemaType = z.infer<ReturnType<typeof createUserProfileSchema>>;
