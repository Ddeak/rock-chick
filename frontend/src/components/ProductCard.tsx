'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { QuantitySelector } from '@/components/QuantitySelector';
import { getCartOrderType } from '@/lib/cart';
import { humanizeSlug } from '@/lib/format';
import type { Product } from '@/lib/storyblok';

export function ProductCard({
  uuid,
  product,
  stock,
}: {
  uuid: string;
  product: Product;
  stock: number;
}) {
  const { items, dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const seasons = (product.season ?? []).filter((s) => s !== 'year-round');
  const isSoldOut = stock <= 0;
  const orderType = product.order_type ?? 'weekly';

  function handleAddToCart() {
    const cartOrderType = getCartOrderType(items);
    if (cartOrderType && cartOrderType !== orderType) {
      setBlockedMessage(
        cartOrderType === 'weekly'
          ? "Finish or clear your This Week's Menu order before adding a Standing Menu item."
          : "Finish or clear your Standing Menu order before adding a This Week's Menu item.",
      );
      return;
    }
    setBlockedMessage(null);
    dispatch({
      type: 'ADD_ITEM',
      item: {
        uuid,
        name: product.name,
        price: product.price,
        image: product.image,
        orderType,
      },
      quantity,
    });
    setQuantity(1);
  }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      {product.image?.filename && (
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={product.image.filename}
            alt={product.image.alt || product.name}
            fill
            className={`object-cover ${isSoldOut ? 'grayscale' : ''}`}
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
        <span className="whitespace-nowrap font-medium text-foreground">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {product.description && (
        <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
      )}

      {seasons.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {seasons.map((season) => (
            <span
              key={season}
              className="inline-block w-fit rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
            >
              {humanizeSlug(season)} special
            </span>
          ))}
        </div>
      )}

      {product.labels && product.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {humanizeSlug(label)}
            </span>
          ))}
        </div>
      )}

      <p className={`mt-2 text-xs font-medium ${isSoldOut ? 'text-error' : 'text-success'}`}>
        {isSoldOut ? 'Sold out' : `${stock} left this week`}
      </p>

      {blockedMessage && <p className="mt-2 text-xs text-error">{blockedMessage}</p>}

      <div className="mt-4 flex items-center justify-between gap-2">
        <QuantitySelector value={quantity} onChange={setQuantity} max={stock} />
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
