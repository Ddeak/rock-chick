import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';

interface HomeHeroProps {
  image: { filename: string; alt?: string };
  heading?: string;
}

export function HomeHero({ image, heading }: HomeHeroProps) {
  return (
    <div className="relative h-[480px] w-full overflow-hidden">
      <Image
        src={image.filename}
        alt={image.alt || 'Rock Chick Farm'}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 pb-8">
        {heading && <Heading className="text-center text-foreground">{heading}</Heading>}
        <Button href="/order" size="lg" className="w-full max-w-md">
          Start Ordering
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
