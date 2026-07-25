import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: 'eu' },
});

export async function getStoryBySlug(slug: string) {
  const storyblokApi = getStoryblokApi();
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
    });
    return data.story;
  } catch {
    return null;
  }
}

export interface Product {
  name: string;
  price: number;
  image?: { filename: string; alt?: string };
  description?: string;
  nutritional_info?: string;
  labels?: string[];
  categories?: string[];
  season?: string[];
}

export interface ProductStory {
  uuid: string;
  content: Product;
}

export async function getAllProducts(): Promise<ProductStory[]> {
  const storyblokApi = getStoryblokApi();
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      starts_with: 'products/',
      content_type: 'product',
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
    });
    const stories = data.stories as ProductStory[];
    // Storyblok's Number field type serializes as a string over the CDN API.
    return stories.map((story) => ({
      ...story,
      content: { ...story.content, price: Number(story.content.price) },
    }));
  } catch {
    return [];
  }
}
