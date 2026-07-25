import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { ProductGrid } from '@/components/ProductGrid';
import { getAllProducts } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Menu',
};

export default async function MenuPage() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <ComingSoon title="Menu" />;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <ProductGrid products={products} />
    </main>
  );
}
