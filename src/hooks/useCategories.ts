import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryService, Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/services/category.service';
import { toast } from 'sonner';

export function useCategories(includeInactive = true) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ['categories', includeInactive],
    queryFn: () => CategoryService.getAllCategories(includeInactive),
    staleTime: 5 * 60 * 1000,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => CategoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      CategoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update category');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => CategoryService.toggleFeaturedCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Featured status updated!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to toggle featured status');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete category');
    },
  });

  return {
    data: categories,
    categories,
    isLoading,
    isError,
    error,
    refetch,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    toggleFeatured: toggleFeaturedMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
  };
}
