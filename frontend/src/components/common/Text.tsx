import type { ComponentPropsWithoutRef, ElementType } from 'react';

const VARIANT_CLASSES = {
  subtitle: 'text-xs leading-[18px] font-normal text-muted-foreground',
  tag: 'text-[10px] leading-[15px] font-bold text-muted-foreground',
  price: 'text-sm leading-5 font-bold text-foreground',
} as const;

const DEFAULT_ELEMENT: Record<keyof typeof VARIANT_CLASSES, ElementType> = {
  subtitle: 'p',
  tag: 'p',
  price: 'span',
};

interface TextProps extends ComponentPropsWithoutRef<'p'> {
  variant?: keyof typeof VARIANT_CLASSES;
  as?: ElementType;
}

export function Text({ variant = 'subtitle', as, className = '', ...props }: TextProps) {
  const Component = as ?? DEFAULT_ELEMENT[variant];
  return <Component className={`font-sans ${VARIANT_CLASSES[variant]} ${className}`} {...props} />;
}
