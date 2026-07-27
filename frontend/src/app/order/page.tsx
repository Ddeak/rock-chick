import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { ProductGrid } from '@/components/ProductGrid';
import { SoldOutNotice } from '@/components/SoldOutNotice';
import { getStockLevels } from '@/lib/stock';
import { getAllProducts } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Order',
};

export default async function OrderPage() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <ComingSoon title="Order" />;
  }

  const stockByUuid = await getStockLevels(products.map((p) => p.uuid));
  const allSoldOut = products.every((p) => (stockByUuid[p.uuid] ?? 0) <= 0);

  if (allSoldOut) {
    return <SoldOutNotice />;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <ProductGrid products={products} stockByUuid={stockByUuid} />
    </main>
  );
}
