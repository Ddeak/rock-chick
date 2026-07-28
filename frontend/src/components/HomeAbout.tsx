import { Award, Calendar, Clock, Heart, Leaf, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { Heading } from '@/components/common/Heading';
import { Text } from '@/components/common/Text';
import type { AboutSnippet } from '@/lib/storyblok';

const SNIPPET_ICONS = {
  heart: Heart,
  award: Award,
  calendar: Calendar,
  users: Users,
  leaf: Leaf,
  star: Star,
  clock: Clock,
} as const;

interface HomeAboutProps {
  image?: { filename: string; alt?: string };
  title?: string;
  quote?: string;
  snippets: (AboutSnippet & { _uid: string })[];
}

export function HomeAbout({ image, title, quote, snippets }: HomeAboutProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      {(image?.filename || title) && (
        <div className="flex items-center gap-4">
          {image?.filename && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
              <Image
                src={image.filename}
                alt={image.alt || title || ''}
                fill
                className="object-cover"
              />
            </div>
          )}
          {title && <Heading size="h2">{title}</Heading>}
        </div>
      )}

      {quote && <Text variant="quote">{quote}</Text>}

      {snippets.length > 0 && (
        <div className="flex flex-col gap-3">
          {snippets.map((snippet) => {
            const Icon = snippet.icon
              ? SNIPPET_ICONS[snippet.icon as keyof typeof SNIPPET_ICONS]
              : undefined;
            return (
              <div
                key={snippet._uid}
                className="flex items-center gap-3 rounded-xl border border-[#E0DEC8] bg-card p-3"
              >
                {Icon && <Icon className="h-6 w-6 shrink-0 text-primary-strong" />}
                <div className="flex flex-col">
                  <Text variant="eyebrow">{snippet.label}</Text>
                  <Text variant="emphasis">{snippet.value}</Text>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
