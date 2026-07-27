import type { ComponentPropsWithoutRef } from 'react';

const SIZE_CLASSES = {
  sm: 'h-9 gap-1.5 px-3 text-xs',
  md: 'h-11 gap-2 px-4 text-sm',
  lg: 'h-14 gap-[7px] px-3 text-sm',
} as const;

export const VARIANT_CLASSES = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  size?: keyof typeof SIZE_CLASSES;
  variant?: ButtonVariant;
}

export function Button({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-2xl font-semibold shadow-[0_4px_8px_rgba(47,24,16,0.1)] disabled:cursor-not-allowed disabled:opacity-40 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
