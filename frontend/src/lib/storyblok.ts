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

export interface AboutSnippet {
  icon?: string;
  label: string;
  value: string;
}

export interface HomePageContent {
  heroImage: { filename: string; alt?: string };
  heroHeading?: string;
  stories: (StoryPost & { _uid: string })[];
  aboutImage?: { filename: string; alt?: string };
  aboutTitle?: string;
  aboutQuote?: string;
  aboutSnippets: (AboutSnippet & { _uid: string })[];
}

export async function getHomePageContent(): Promise<HomePageContent | null> {
  const story = await getStoryBySlug('home');
  const content = story?.content as
    | {
        hero_image?: { filename: string; alt?: string };
        hero_heading?: string;
        stories?: (StoryPost & { _uid: string })[];
        about_image?: { filename: string; alt?: string };
        about_title?: string;
        about_quote?: string;
        about_snippets?: (AboutSnippet & { _uid: string })[];
      }
    | undefined;

  if (!content?.hero_image?.filename) {
    return null;
  }

  return {
    heroImage: content.hero_image,
    heroHeading: content.hero_heading,
    stories: content.stories ?? [],
    aboutImage: content.about_image,
    aboutTitle: content.about_title,
    aboutQuote: content.about_quote,
    aboutSnippets: content.about_snippets ?? [],
  };
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
  order_type?: 'weekly' | 'standing';
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

export interface StoryStat {
  value: string;
  label: string;
}

export interface StoryPost {
  title: string;
  excerpt?: string;
  image?: { filename: string; alt?: string };
  tags?: string[];
  stats?: (StoryStat & { _uid: string })[];
}
