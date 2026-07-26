'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

export function StickyCartSummary() {
  const { items } = useCart();
  const pathname = usePathname();

  if (items.length === 0 || pathname === '/cart') {
    return null;
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-primary px-4 py-3 text-primary-foreground shadow-lg sm:inset-x-auto sm:bottom-4 sm:right-4 sm:rounded-full sm:px-5 sm:py-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <span className="flex items-center gap-2 font-medium">
        <ShoppingBag className="h-5 w-5" />
        {itemCount} {itemCount === 1 ? 'item' : 'items'} &middot; ${totalPrice.toFixed(2)}
      </span>
      <span className="flex items-center gap-1 font-medium">
        View Cart
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
