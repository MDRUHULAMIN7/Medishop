import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProductService,
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/services/product.service';
import { toast } from 'sonner';

export function useProducts(params: ProductQueryParams = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => ProductService.getProducts(params, undefined, undefined, signal),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const createProductMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => ProductService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create product');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      ProductService.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update product');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => ProductService.toggleFeaturedProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product feature status updated!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to toggle featured status');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete product');
    },
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading,
    isError,
    error,
    refetch,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    toggleFeatured: toggleFeaturedMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
  };
}
