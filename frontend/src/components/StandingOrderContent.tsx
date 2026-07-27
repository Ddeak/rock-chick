'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { PickupDateSelector } from '@/components/PickupDateSelector';
import { ProductGrid } from '@/components/ProductGrid';
import type { ProductStory } from '@/lib/storyblok';

export function StandingOrderContent({ products }: { products: ProductStory[] }) {
  const { pickupDate, setPickupDate } = useCart();
  const [stockByUuid, setStockByUuid] = useState<Record<string, number>>({});
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  useEffect(() => {
    if (!pickupDate) {
      setStockByUuid({});
      return;
    }

    let cancelled = false;

    async function loadStock() {
      setIsLoadingStock(true);
      try {
        const uuids = products.map((p) => p.uuid).join(',');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/standing-stock?date=${pickupDate}&uuids=${uuids}`,
        );
        const data = (await res.json()) as { stock?: Record<string, number> };
        if (!cancelled) {
          setStockByUuid(data.stock ?? {});
        }
      } catch {
        if (!cancelled) {
          setStockByUuid({});
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStock(false);
        }
      }
    }

    loadStock();
    return () => {
      cancelled = true;
    };
  }, [pickupDate, products]);

  const allSoldOut =
    !!pickupDate && !isLoadingStock && products.every((p) => (stockByUuid[p.uuid] ?? 0) <= 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Order Ahead</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a future pickup date for items we can always make.
        </p>
      </div>

      <PickupDateSelector selectedDate={pickupDate} onSelect={setPickupDate} orderType="standing" />

      {!pickupDate && (
        <p className="text-muted-foreground">
          Select a pickup date above to see what&apos;s available.
        </p>
      )}

      {pickupDate && isLoadingStock && (
        <p className="text-muted-foreground">Checking availability&hellip;</p>
      )}

      {pickupDate && !isLoadingStock && allSoldOut && (
        <p className="text-error">
          Everything is fully booked for this date. Please choose another date.
        </p>
      )}

      {pickupDate && !isLoadingStock && !allSoldOut && (
        <ProductGrid products={products} stockByUuid={stockByUuid} />
      )}
    </div>
  );
}
