import type { Metadata } from 'next';
import { CmsRichText } from '@/components/CmsRichText';
import { ComingSoon } from '@/components/ComingSoon';
import { getStoryBySlug } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'About Me',
};

export default async function AboutPage() {
  const story = await getStoryBySlug('about');
  const pageContent = story?.content?.content;

  if (!pageContent) {
    return <ComingSoon title="About Me" />;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <CmsRichText document={pageContent} />
    </main>
  );
}
