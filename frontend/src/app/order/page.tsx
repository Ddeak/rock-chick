import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { ProductGrid } from '@/components/ProductGrid';
import { getAllProducts } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Order',
};

export default async function OrderPage() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <ComingSoon title="Order" />;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <ProductGrid products={products} />
    </main>
  );
}
