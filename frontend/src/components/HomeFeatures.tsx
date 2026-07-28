import { Calendar, Heart, Home, Leaf, MapPin, Sparkles } from 'lucide-react';
import { FeatureBadge } from '@/components/FeatureBadge';

export function HomeFeatures() {
  return (
    <div className="grid grid-cols-3 justify-items-center gap-4 px-6 py-8 sm:flex sm:flex-wrap sm:justify-center">
      <FeatureBadge icon={Leaf} label="Organic" variant="primary" />
      <FeatureBadge icon={Heart} label="Handmade" variant="secondary" />
      <FeatureBadge icon={MapPin} label="Local" variant="primary" />
      <FeatureBadge icon={Sparkles} label="Fresh Daily" variant="secondary" />
      <FeatureBadge icon={Home} label="Family Owned" variant="primary" />
      <FeatureBadge icon={Calendar} label="Custom Orders" variant="secondary" />
    </div>
  );
}
