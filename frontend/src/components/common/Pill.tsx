import type { ComponentPropsWithoutRef } from 'react';
import { VARIANT_CLASSES } from './Button';

const PILL_VARIANT_CLASSES = {
  ...VARIANT_CLASSES,
  outline: 'border border-[#BEA095] bg-transparent text-foreground',
} as const;

type PillVariant = keyof typeof PILL_VARIANT_CLASSES;

interface PillProps extends ComponentPropsWithoutRef<'span'> {
  variant?: PillVariant;
}

export function Pill({ variant = 'secondary', className = '', ...props }: PillProps) {
  return (
    <span
      className={`inline-flex h-5 items-center justify-center rounded-full px-1.5 font-sans text-xs font-semibold leading-5 ${PILL_VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
