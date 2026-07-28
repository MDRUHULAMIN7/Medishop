import { z } from 'zod';

export function createForgotSchema(isBn: boolean = true) {
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
            ? 'সঠিক ইমেইল অথবা ১১ ডিজিটের মোবাইল নম্বর দিন'
            : 'Enter a valid email or 11-digit BD mobile number',
        }
      ),
  });
}

export type ForgotSchemaType = z.infer<ReturnType<typeof createForgotSchema>>;
