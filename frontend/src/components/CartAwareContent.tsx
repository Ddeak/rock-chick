'use client';

import type { ReactNode } from 'react';
import { useCart } from '@/components/CartProvider';

export function CartAwareContent({ children }: { children: ReactNode }) {
  const { items } = useCart();
  const hasItems = items.length > 0;

  return <div className={hasItems ? 'pb-24 sm:pb-0' : ''}>{children}</div>;
}
