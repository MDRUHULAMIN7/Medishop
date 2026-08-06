'use client';

import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import { UserProfileService, UpdateProfilePayload } from '@/services/userProfile.service';
import { createUserProfileSchema } from '@/validators/userProfile.schema';
import { ApiError } from '@/lib/apiClient';
import { toast } from 'sonner';

export function useUserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Fetch latest profile from backend API (/users/me) and sync to Redux state.
   */
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await UserProfileService.getProfile();
      if (profile) {
        dispatch(setUser(profile));
      }
      return profile;
    } catch (err: any) {
      console.warn('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  /**
   * Update profile details (Name, Email, Phone, Avatar).
   */
  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setFieldErrors({});

      // Client-side Zod validation
      const schema = createUserProfileSchema(isBn);
      const validationResult = schema.safeParse(payload);
      if (!validationResult.success) {
        const errorsMap: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errorsMap[err.path[0].toString()] = err.message;
          }
        });
        setFieldErrors(errorsMap);
        const firstErrorMsg = validationResult.error.errors[0]?.message || 'Validation failed';
        toast.error(firstErrorMsg);
        return { success: false, errors: errorsMap };
      }

      try {
        setIsSaving(true);
        const updatedUser = await UserProfileService.updateProfile(payload);
        if (updatedUser) {
          dispatch(setUser(updatedUser));
          toast.success(
            isBn ? 'পাসওয়ার্ড/প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!'
          );
          return { success: true, user: updatedUser };
        }
        return { success: false };
      } catch (err: any) {
        let message = isBn
          ? 'প্রোফাইল আপডেট করা সম্ভব হয়নি।'
          : 'Failed to update profile. Please try again.';
        let errors: Record<string, string> = {};

        if (err instanceof ApiError) {
          message = err.message || message;
          errors = err.fieldErrors || {};
        } else if (err?.message) {
          message = err.message;
        }

        setFieldErrors(errors);
        toast.error(message);
        return { success: false, message, errors };
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, isBn]
  );

  /**
   * Upload Avatar image file with strict 5MB size limit validation.
   */
  const uploadAvatar = useCallback(
    async (file: File) => {
      const MAX_SIZE_MB = 5;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

      if (file.size > MAX_SIZE_BYTES) {
        const errorMsg = isBn
          ? `ছবিটির সাইজ ${(file.size / (1024 * 1024)).toFixed(
              2
            )}MB, যা অনুমোদিত সর্বোচ্চ limit (${MAX_SIZE_MB}MB) এর চেয়ে বেশি।`
          : `File size is ${(file.size / (1024 * 1024)).toFixed(
              2
            )}MB. Maximum allowed avatar size is ${MAX_SIZE_MB}MB.`;
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }

      return new Promise<{ success: boolean; avatarUrl?: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const result = await updateProfile({ avatar: base64String });
          if (result.success && result.user?.avatar) {
            resolve({ success: true, avatarUrl: result.user.avatar });
          } else {
            resolve({ success: false });
          }
        };
        reader.onerror = () => {
          toast.error(isBn ? 'ছবিটি প্রসেস করতে ব্যর্থ হয়েছে' : 'Failed to read image file');
          resolve({ success: false });
        };
        reader.readAsDataURL(file);
      });
    },
    [isBn, updateProfile]
  );

  return {
    user,
    isLoading,
    isSaving,
    fieldErrors,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  };
}
