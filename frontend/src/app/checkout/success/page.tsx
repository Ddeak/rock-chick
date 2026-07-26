import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccessContent } from '@/components/CheckoutSuccessContent';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <Suspense fallback={<p className="text-center text-muted-foreground">Loading&hellip;</p>}>
        <CheckoutSuccessContent />
      </Suspense>
    </main>
  );
}
