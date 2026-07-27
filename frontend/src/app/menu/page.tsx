import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { MenuList } from '@/components/MenuList';
import { SoldOutNotice } from '@/components/SoldOutNotice';
import { getStockLevels } from '@/lib/stock';
import { getAllProducts } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Menu',
};

export default async function MenuPage() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <ComingSoon title="Menu" />;
  }

  const stockByUuid = await getStockLevels(products.map((p) => p.uuid));
  const allSoldOut = products.every((p) => (stockByUuid[p.uuid] ?? 0) <= 0);

  if (allSoldOut) {
    return <SoldOutNotice />;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <MenuList products={products} stockByUuid={stockByUuid} />
    </main>
  );
}
