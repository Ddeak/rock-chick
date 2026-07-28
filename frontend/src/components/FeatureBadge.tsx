import type { LucideIcon } from 'lucide-react';
import { Text } from '@/components/common/Text';

const VARIANT_CLASSES = {
  primary: 'bg-primary/20 text-primary-strong',
  secondary: 'bg-secondary/50 text-secondary-strong',
} as const;

interface FeatureBadgeProps {
  icon: LucideIcon;
  label: string;
  variant?: keyof typeof VARIANT_CLASSES;
}

export function FeatureBadge({ icon: Icon, label, variant = 'primary' }: FeatureBadgeProps) {
  return (
    <div className="flex w-16 flex-col items-center gap-1.5 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${VARIANT_CLASSES[variant]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <Text variant="tag">{label}</Text>
    </div>
  );
}
