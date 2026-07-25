import Image from 'next/image';
import { humanizeSlug } from '@/lib/format';
import type { Product } from '@/lib/storyblok';

export function ProductCard({ product }: { product: Product }) {
  const seasons = (product.season ?? []).filter((s) => s !== 'year-round');

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      {product.image?.filename && (
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={product.image.filename}
            alt={product.image.alt || product.name}
            fill
            className="object-cover"
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
    </div>
  );
}
