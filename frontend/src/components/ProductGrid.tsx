import { humanizeSlug } from '@/lib/format';
import type { ProductStory } from '@/lib/storyblok';
import { ProductCard } from '@/components/ProductCard';

export function ProductGrid({ products }: { products: ProductStory[] }) {
  const byCategory = new Map<string, ProductStory[]>();
  for (const story of products) {
    const categories = story.content.categories?.length
      ? story.content.categories
      : ['uncategorized'];
    for (const category of categories) {
      const existing = byCategory.get(category) ?? [];
      existing.push(story);
      byCategory.set(category, existing);
    }
  }

  return (
    <div className="space-y-10">
      {Array.from(byCategory.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {humanizeSlug(category)}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((story) => (
              <ProductCard key={story.uuid} product={story.content} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
