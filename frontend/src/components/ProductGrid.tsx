import { humanizeSlug } from '@/lib/format';
import { groupByCategory } from '@/lib/products';
import type { ProductStory } from '@/lib/storyblok';
import { ProductCard } from '@/components/ProductCard';

export function ProductGrid({ products }: { products: ProductStory[] }) {
  const categories = groupByCategory(products);

  return (
    <div className="space-y-10">
      {categories.map(([category, items]) => (
        <section key={category}>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {humanizeSlug(category)}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((story) => (
              <ProductCard key={story.uuid} uuid={story.uuid} product={story.content} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
