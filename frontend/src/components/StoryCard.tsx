import Image from 'next/image';
import { Heading } from '@/components/common/Heading';
import { Pill } from '@/components/common/Pill';
import { Text } from '@/components/common/Text';
import { humanizeSlug } from '@/lib/format';
import type { StoryPost } from '@/lib/storyblok';

interface StoryCardProps {
  post: StoryPost;
}

export function StoryCard({ post }: StoryCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-[#FFF4F0] shadow-[0_4px_12px_rgba(47,24,16,0.16)]">
      {post.image?.filename && (
        <div className="relative h-56 w-full">
          <Image
            src={post.image.filename}
            alt={post.image.alt || post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="px-6 pb-6 pt-8">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Pill key={tag} variant="outline">
                {humanizeSlug(tag)}
              </Pill>
            ))}
          </div>
        )}

        <Heading size="h2" as="h3" className="mt-3.5">
          {post.title}
        </Heading>

        {post.excerpt && (
          <Text variant="body" className="mt-3">
            {post.excerpt}
          </Text>
        )}

        {post.stats && post.stats.length > 0 && (
          <div className="mt-4 flex items-center">
            {post.stats.map((stat, index) => (
              <div key={stat._uid} className="flex items-center">
                {index > 0 && <div className="mx-4 h-8 w-px bg-[#DFC9C2]" />}
                <div className="flex flex-col items-center">
                  <Text variant="stat">{stat.value}</Text>
                  <Text variant="tag" className="mt-1">
                    {stat.label}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
