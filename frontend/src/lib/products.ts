import type { ProductStory } from '@/lib/storyblok';

export function groupByCategory(products: ProductStory[]): [string, ProductStory[]][] {
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
  return Array.from(byCategory.entries());
}
