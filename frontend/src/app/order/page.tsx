import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Order',
};

export default function OrderPage() {
  return <ComingSoon title="Order" />;
}
