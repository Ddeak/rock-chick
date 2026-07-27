export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;
export const MAX_CART_ITEMS = 50;

export function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(quantity)));
}

function getTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export type OrderType = 'weekly' | 'standing';

export interface CartItem {
  uuid: string;
  name: string;
  price: number;
  image?: { filename: string; alt?: string };
  quantity: number;
  orderType: OrderType;
}

// A cart can only contain one order type at a time — "This Week's Menu"
// and "Standing Menu" items have fundamentally different pickup-date rules
// (one fixed upcoming date vs. any future date), so mixing them in one
// checkout doesn't make sense. Exposed so the UI can check before adding,
// rather than silently no-op-ing on a rejected dispatch.
export function getCartOrderType(items: CartItem[]): OrderType | null {
  return items[0]?.orderType ?? null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'>; quantity: number }
  | { type: 'UPDATE_QUANTITY'; uuid: string; quantity: number }
  | { type: 'REMOVE_ITEM'; uuid: string }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const cartOrderType = getCartOrderType(state);
      if (cartOrderType && cartOrderType !== action.item.orderType) {
        return state;
      }
      const existing = state.find((i) => i.uuid === action.item.uuid);
      const othersTotal = getTotalQuantity(state) - (existing?.quantity ?? 0);
      const room = MAX_CART_ITEMS - othersTotal;
      if (room <= 0) {
        return state;
      }
      const quantity = clampQuantity(Math.min((existing?.quantity ?? 0) + action.quantity, room));
      if (existing) {
        return state.map((i) => (i.uuid === action.item.uuid ? { ...i, quantity } : i));
      }
      return [...state, { ...action.item, quantity }];
    }
    case 'UPDATE_QUANTITY': {
      const existing = state.find((i) => i.uuid === action.uuid);
      if (!existing) {
        return state;
      }
      const othersTotal = getTotalQuantity(state) - existing.quantity;
      const room = Math.max(MAX_CART_ITEMS - othersTotal, MIN_QUANTITY);
      const quantity = clampQuantity(Math.min(action.quantity, room));
      return state.map((i) => (i.uuid === action.uuid ? { ...i, quantity } : i));
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.uuid !== action.uuid);
    case 'CLEAR_CART':
      return [];
    case 'HYDRATE':
      return action.items;
    default:
      return state;
  }
}
