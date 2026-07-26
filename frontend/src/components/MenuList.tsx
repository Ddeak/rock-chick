import { humanizeSlug } from '@/lib/format';
import { groupByCategory } from '@/lib/products';
import type { ProductStory } from '@/lib/storyblok';

export function MenuList({ products }: { products: ProductStory[] }) {
  const categories = groupByCategory(products);

  return (
    <div className="space-y-8">
      {categories.map(([category, items]) => (
        <section key={category}>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {humanizeSlug(category)}
          </h2>
          <ul className="mt-3 divide-y divide-border">
            {items.map((story) => (
              <li key={story.uuid} className="flex items-baseline justify-between gap-4 py-2">
                <span className="text-foreground">
                  {story.content.name}
                  {story.content.labels && story.content.labels.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({story.content.labels.map(humanizeSlug).join(', ')})
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap font-medium text-foreground">
                  ${story.content.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
