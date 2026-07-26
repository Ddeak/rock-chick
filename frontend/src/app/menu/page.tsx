import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { MenuList } from '@/components/MenuList';
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
    <main className="mx-auto max-w-2xl p-8">
      <MenuList products={products} />
    </main>
  );
}
