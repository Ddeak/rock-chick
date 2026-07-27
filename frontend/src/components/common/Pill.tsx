import type { ComponentPropsWithoutRef } from 'react';
import { VARIANT_CLASSES, type ButtonVariant } from './Button';

interface PillProps extends ComponentPropsWithoutRef<'span'> {
  variant?: ButtonVariant;
}

export function Pill({ variant = 'secondary', className = '', ...props }: PillProps) {
  return (
    <span
      className={`inline-flex h-5 items-center justify-center rounded-full px-1.5 font-sans text-xs font-semibold leading-5 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
