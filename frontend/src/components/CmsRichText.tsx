import { StoryblokServerRichText } from '@storyblok/react/rsc';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof StoryblokServerRichText>;

export function CmsRichText({ document, ...rest }: Props) {
  return (
    <div
      className="prose prose-neutral max-w-none
        prose-headings:font-display prose-headings:text-foreground
        prose-p:text-foreground prose-li:text-foreground
        prose-a:text-primary-strong prose-strong:text-foreground"
    >
      <StoryblokServerRichText document={document} {...rest} />
    </div>
  );
}
