import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | mediShop',
      description: 'The requested medicine or healthcare product could not be found.',
    };
  }

  return {
    title: `${product.nameEn} (${product.nameBn}) - ${product.brand}`,
    description: `Buy ${product.nameEn} online at best price ৳${product.price} in Bangladesh. 100% authentic medicine from ${product.brand} with same-day delivery in Dhaka.`,
    openGraph: {
      title: `${product.nameEn} | mediShop`,
      description: `Buy authentic ${product.nameEn} online in Bangladesh.`,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6">
      <ProductDetailClient product={product} />
    </div>
  );
}
