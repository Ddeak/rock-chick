import { ComingSoon } from '@/components/ComingSoon';
import { HomeHero } from '@/components/HomeHero';
import { getHomePageContent } from '@/lib/storyblok';

export default async function HomePage() {
  const home = await getHomePageContent();

  if (!home) {
    return <ComingSoon title="Home" />;
  }

  return <HomeHero image={home.heroImage} heading={home.heroHeading} />;
}
