import type { Metadata } from 'next';
import { CartPageContent } from '@/components/CartPageContent';

export const metadata: Metadata = {
  title: 'Cart',
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">Your Cart</h1>
      <div className="mt-6">
        <CartPageContent />
      </div>
    </main>
  );
}
