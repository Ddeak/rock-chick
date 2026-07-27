import type { ComponentPropsWithoutRef, ElementType } from 'react';

const SIZE_CLASSES = {
  h1: 'text-[32px] leading-10 font-bold',
  h3: 'text-sm leading-5 font-semibold',
} as const;

const DEFAULT_ELEMENT: Record<keyof typeof SIZE_CLASSES, ElementType> = {
  h1: 'h1',
  h3: 'h3',
};

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  size?: keyof typeof SIZE_CLASSES;
  as?: ElementType;
}

export function Heading({ size = 'h1', as, className = '', ...props }: HeadingProps) {
  const Component = as ?? DEFAULT_ELEMENT[size];
  return (
    <Component
      className={`font-sans text-foreground ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    />
  );
}
