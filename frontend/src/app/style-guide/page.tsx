import { Calendar, Heart, Home, Leaf, MapPin, Plus, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import { IconButton } from '@/components/common/IconButton';
import { Pill } from '@/components/common/Pill';
import { Text } from '@/components/common/Text';
import { FeatureBadge } from '@/components/FeatureBadge';

export const metadata: Metadata = {
  title: 'Style Guide',
};

export default function StyleGuidePage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="font-display text-4xl font-semibold text-foreground">Style Guide</h1>
        <p className="mt-2 text-muted-foreground">
          Living reference for the theme tokens defined in globals.css.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="md" disabled>
          Disabled
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm">
          Small
        </Button>
        <Button variant="secondary" size="md">
          Medium
        </Button>
        <Button variant="secondary" size="lg">
          Large
        </Button>
        <Button variant="secondary" size="md" disabled>
          Disabled
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <IconButton aria-label="Add">
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton variant="secondary" aria-label="Add">
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton aria-label="Add" disabled>
          <Plus className="h-4 w-4" />
        </IconButton>
      </div>

      <Heading>Fresh Baked Daily</Heading>

      <div className="flex flex-wrap items-center gap-3">
        <Pill>New</Pill>
        <Pill variant="primary">Sale</Pill>
      </div>

      <div className="relative max-w-xs rounded-lg border border-border bg-card p-3">
        <Pill className="absolute right-2 top-2">New</Pill>
        <div className="flex items-start justify-between gap-2">
          <Heading size="h3">Wedding Cake</Heading>
          <Text variant="price">$45.00</Text>
        </div>
        <Text>Three tiers, vanilla and raspberry filling</Text>
        <Text variant="tag">GLUTEN FREE</Text>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <FeatureBadge icon={Leaf} label="Organic" variant="primary" />
        <FeatureBadge icon={Heart} label="Handmade" variant="secondary" />
        <FeatureBadge icon={MapPin} label="Local" variant="primary" />
        <FeatureBadge icon={Sparkles} label="Fresh Daily" variant="secondary" />
        <FeatureBadge icon={Home} label="Family Owned" variant="primary" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-primary px-5 py-2 font-medium text-primary-foreground">
          Order Now
        </button>
        <button className="rounded-full bg-secondary px-5 py-2 font-medium text-secondary-foreground">
          View Menu
        </button>
        <button className="rounded-full bg-secondary-strong px-5 py-2 font-medium text-secondary-strong-foreground">
          Featured Sale
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-primary-strong">Golden link text — readable on the cream background.</p>
        <p className="text-success">In stock</p>
        <p className="text-error">Sold out</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        {[
          ['background', 'bg-background border border-border'],
          ['primary', 'bg-primary'],
          ['primary-strong', 'bg-primary-strong'],
          ['secondary', 'bg-secondary'],
          ['secondary-strong', 'bg-secondary-strong'],
          ['card', 'bg-card border border-border'],
          ['muted', 'bg-muted'],
          ['success', 'bg-success'],
          ['error', 'bg-error'],
        ].map(([label, cls]) => (
          <div key={label} className="space-y-1">
            <div className={`h-16 w-full rounded-md ${cls}`} />
            <div className="text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
