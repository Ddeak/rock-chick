'use client';

import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY, MIN_QUANTITY, clampQuantity } from '@/lib/cart';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value - 1))}
        disabled={value <= MIN_QUANTITY}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        value={value}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (!Number.isNaN(parsed)) {
            onChange(clampQuantity(parsed));
          }
        }}
        aria-label="Quantity"
        className="w-10 border-0 bg-transparent text-center text-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value + 1))}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
