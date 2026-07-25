import { ComingSoon } from '@/components/ComingSoon';
import { getStoryblokApi } from '@/lib/storyblok';

export default async function HomePage() {
  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get('cdn/stories/home', {
    version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
  });
  const headline = data.story.content.body?.[0]?.headline as string | undefined;

  return (
    <>
      <ComingSoon title="Home" />
      {headline && (
        <p className="mx-auto max-w-2xl px-8 text-sm text-muted-foreground">
          Live from Storyblok: &ldquo;{headline}&rdquo;
        </p>
      )}
    </>
  );
}
