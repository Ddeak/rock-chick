import { ComingSoon } from '@/components/ComingSoon';
import { getStoryBySlug } from '@/lib/storyblok';

export default async function HomePage() {
  const story = await getStoryBySlug('home');
  const headline = story?.content?.body?.[0]?.headline as string | undefined;

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
