import type { ComponentPropsWithoutRef } from 'react';
import { VARIANT_CLASSES, type ButtonVariant } from './Button';

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  'aria-label': string;
}

export function IconButton({ variant = 'primary', className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full shadow-[0_2px_4px_rgba(47,24,16,0.08)] disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
