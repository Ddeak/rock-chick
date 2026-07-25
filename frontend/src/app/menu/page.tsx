import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Menu',
};

export default function MenuPage() {
  return <ComingSoon title="Menu" />;
}
