import type { Metadata } from 'next';
import { CmsRichText } from '@/components/CmsRichText';
import { ComingSoon } from '@/components/ComingSoon';
import { getStoryBySlug } from '@/lib/storyblok';

export const metadata: Metadata = {
  title: 'Contact',
};

export default async function ContactPage() {
  const story = await getStoryBySlug('contact');
  const pageContent = story?.content?.content;

  if (!pageContent) {
    return <ComingSoon title="Contact" />;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <CmsRichText document={pageContent} />
    </main>
  );
}
