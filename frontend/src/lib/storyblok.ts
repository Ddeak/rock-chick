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
