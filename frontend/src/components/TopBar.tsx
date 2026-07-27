'use client';

import { Menu, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/menu', label: 'Menu' },
  { href: '/order', label: 'Order' },
  { href: '/order/standing', label: 'Order Ahead' },
  { href: '/contact', label: 'Contact' },
  { href: '/cart', label: 'Cart' },
];

export function TopBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  function navContent(link: (typeof NAV_LINKS)[number]) {
    if (link.href !== '/cart') {
      return link.label;
    }
    return (
      <span className="relative inline-flex">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-semibold leading-none text-secondary-foreground ring-1 ring-background">
            {cartCount}
          </span>
        )}
      </span>
    );
  }

  function navAriaLabel(link: (typeof NAV_LINKS)[number]) {
    if (link.href !== '/cart') {
      return undefined;
    }
    return cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart';
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-foreground"
          onClick={() => setIsMenuOpen(false)}
        >
          Rock Chick Farm
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-label={navAriaLabel(link)}
              className={`text-sm font-medium ${
                pathname === link.href ? 'text-primary-strong' : 'text-foreground'
              }`}
            >
              {navContent(link)}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="text-foreground md:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              aria-label={navAriaLabel(link)}
              className={`rounded-md px-2 py-2 text-sm font-medium ${
                pathname === link.href ? 'bg-muted text-primary-strong' : 'text-foreground'
              }`}
            >
              {navContent(link)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
