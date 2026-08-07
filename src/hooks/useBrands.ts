import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BrandService, Brand, CreateBrandPayload, UpdateBrandPayload } from '@/services/brand.service';
import { toast } from 'sonner';

export function useBrands(includeInactive = true) {
  const queryClient = useQueryClient();

  const {
    data: brands = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Brand[]>({
    queryKey: ['brands', includeInactive],
    queryFn: () => BrandService.getAllBrands(includeInactive),
    staleTime: 5 * 60 * 1000,
  });

  const createBrandMutation = useMutation({
    mutationFn: (payload: CreateBrandPayload) => BrandService.createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create brand');
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBrandPayload }) =>
      BrandService.updateBrand(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update brand');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => BrandService.toggleFeaturedBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand featured status updated!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to toggle featured status');
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: string) => BrandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete brand');
    },
  });

  return {
    brands,
    isLoading,
    isError,
    error,
    refetch,
    createBrand: createBrandMutation.mutateAsync,
    updateBrand: updateBrandMutation.mutateAsync,
    toggleFeatured: toggleFeaturedMutation.mutateAsync,
    deleteBrand: deleteBrandMutation.mutateAsync,
    isCreating: createBrandMutation.isPending,
    isUpdating: updateBrandMutation.isPending,
  };
}
