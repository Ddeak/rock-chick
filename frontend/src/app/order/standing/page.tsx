import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';
import { StandingOrderContent } from '@/components/StandingOrderContent';
import { getAllProducts } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Order Ahead',
};

export default async function StandingOrderPage() {
  const allProducts = await getAllProducts();
  const products = allProducts.filter((p) => p.content.order_type === 'standing');

  if (products.length === 0) {
    return <ComingSoon title="Order Ahead" />;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <StandingOrderContent products={products} />
    </main>
  );
}
