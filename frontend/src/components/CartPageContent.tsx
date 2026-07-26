'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { QuantitySelector } from '@/components/QuantitySelector';

export function CartPageContent() {
  const { items, dispatch } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/order" className="mt-4 inline-block text-primary-strong">
          Browse items to order &rarr;
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.uuid} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-4">
              {item.image?.filename && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.image.filename}
                    alt={item.image.alt || item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <QuantitySelector
                value={item.quantity}
                onChange={(quantity) =>
                  dispatch({ type: 'UPDATE_QUANTITY', uuid: item.uuid, quantity })
                }
              />
              <span className="w-16 text-right font-medium text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => dispatch({ type: 'REMOVE_ITEM', uuid: item.uuid })}
                aria-label={`Remove ${item.name} from cart`}
                className="text-muted-foreground hover:text-error"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="font-display text-xl font-semibold text-foreground">Total</span>
        <span className="font-display text-xl font-semibold text-foreground">
          ${total.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-full bg-primary px-4 py-3 text-center font-medium text-primary-foreground opacity-50"
      >
        Checkout (coming soon)
      </button>
    </div>
  );
}
