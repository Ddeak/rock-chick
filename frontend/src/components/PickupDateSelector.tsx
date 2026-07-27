'use client';

import { useEffect, useState } from 'react';
import type { OrderType } from '@/lib/cart';

interface PickupDateSelectorProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  orderType: OrderType;
}

// Pickup dates are calendar days, not moments in time — parsing "YYYY-MM-DD"
// via `new Date(string)` treats it as UTC midnight, which shifts to the
// previous day when formatted in any timezone behind UTC. Building the Date
// from local components avoids that off-by-one-day bug entirely.
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function PickupDateSelector({ selectedDate, onSelect, orderType }: PickupDateSelectorProps) {
  const [dates, setDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/availability?type=${orderType}`,
        );
        const data = (await res.json()) as { dates?: string[] };
        if (!cancelled) {
          setDates(data.dates ?? []);
        }
      } catch {
        if (!cancelled) {
          setDates([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [orderType]);

  return (
    <div>
      <p className="text-sm font-medium text-foreground">Pickup date</p>

      {isLoading && (
        <p className="mt-2 text-sm text-muted-foreground">Loading pickup dates&hellip;</p>
      )}

      {!isLoading && dates.length === 0 && (
        <p className="mt-2 text-sm text-error">
          Unable to load pickup dates. Please try again later.
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`rounded-full border px-3 py-2 text-sm font-medium ${
              selectedDate === date
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-foreground'
            }`}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>
    </div>
  );
}
