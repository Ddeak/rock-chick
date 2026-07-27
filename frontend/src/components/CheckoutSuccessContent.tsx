'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';

type Status = 'checking' | 'success' | 'error';

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { dispatch, setPickupDate } = useCart();
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/checkout/session/${sessionId}`,
        );
        const data = (await res.json()) as { paid?: boolean };
        if (cancelled) {
          return;
        }
        if (res.ok && data.paid) {
          dispatch({ type: 'CLEAR_CART' });
          setPickupDate(null);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [sessionId, dispatch, setPickupDate]);

  return (
    <div className="text-center">
      {status === 'checking' && (
        <p className="text-muted-foreground">Confirming your order&hellip;</p>
      )}

      {status === 'success' && (
        <>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;ve received your order and will be in touch soon.
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            We couldn&apos;t confirm your order
          </h1>
          <p className="mt-2 text-muted-foreground">
            If you completed payment, please contact us so we can confirm it manually.
          </p>
        </>
      )}

      <Link href="/menu" className="mt-6 inline-block text-primary-strong">
        Back to Menu &rarr;
      </Link>
    </div>
  );
}
