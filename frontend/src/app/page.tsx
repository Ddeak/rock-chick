import { ComingSoon } from '@/components/ComingSoon';
import { HomeAbout } from '@/components/HomeAbout';
import { HomeFeatures } from '@/components/HomeFeatures';
import { HomeHero } from '@/components/HomeHero';
import { SectionDivider } from '@/components/SectionDivider';
import { StoryCard } from '@/components/StoryCard';
import { getHomePageContent } from '@/lib/storyblok';

export default async function HomePage() {
  const home = await getHomePageContent();

  if (!home) {
    return <ComingSoon title="Home" />;
  }

  return (
    <>
      <HomeHero image={home.heroImage} heading={home.heroHeading} />
      <HomeFeatures />
      {home.stories.length > 0 && (
        <>
          <SectionDivider />
          <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-8">
            {home.stories.map((story) => (
              <StoryCard key={story._uid} post={story} />
            ))}
          </div>
        </>
      )}
      <SectionDivider />
      <HomeAbout
        image={home.aboutImage}
        title={home.aboutTitle}
        quote={home.aboutQuote}
        snippets={home.aboutSnippets}
      />
    </>
  );
}
