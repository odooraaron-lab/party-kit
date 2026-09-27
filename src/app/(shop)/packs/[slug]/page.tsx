import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProduct, PRODUCTS } from '@/lib/catalog';
import { Builder } from './Builder';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <Suspense>
      <Builder productId={product.id} />
    </Suspense>
  );
}
