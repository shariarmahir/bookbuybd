/* ═══════════════════════════════════════════════
   SHARED CART TYPES  (used by all 4 pages)
═══════════════════════════════════════════════ */

export interface CartItem {
  id: number;
  title: string;
  author: string;
  cover: string;
  coverFallback: string;
  price: number;
  originalPrice?: number;
  qty: number;
  edition: string;
  variant?: CartItemVariant;
  quality?: string;
  stockQuantity?: number;
}

export type CartItemVariant = 'paperback' | 'hardcover';

export interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  note: string;
  paymentMethod: 'cod';
}

export const INITIAL_CART: CartItem[] = [];

export const EMPTY_FORM: CheckoutForm = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  postalCode: '',
  note: '',
  paymentMethod: 'cod',
};

export const DISTRICTS = [
  'Dhaka','Chittagong','Rajshahi','Khulna','Sylhet',
  'Barisal','Rangpur','Mymensingh','Comilla','Gazipur',
  'Narayanganj','Tangail','Bogra','Dinajpur','Jessore',
];

export const DELIVERY_CHARGE = 60;
export const FREE_DELIVERY_THRESHOLD = 1000;

export interface DeliverySettings {
  deliveryCharge: number;
  freeDeliveryThreshold: number;
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  deliveryCharge: DELIVERY_CHARGE,
  freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
};

export function calculateDeliveryCharge(
  subtotal: number,
  settings: DeliverySettings = DEFAULT_DELIVERY_SETTINGS,
): number {
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const threshold = Number.isFinite(settings.freeDeliveryThreshold) ? settings.freeDeliveryThreshold : FREE_DELIVERY_THRESHOLD;
  const charge = Number.isFinite(settings.deliveryCharge) ? settings.deliveryCharge : DELIVERY_CHARGE;
  return safeSubtotal >= threshold ? 0 : charge;
}

const CART_STORAGE_KEY = 'bookbuybd_cart_v1';
export const CART_UPDATED_EVENT = 'bookbuybd:cart-updated';

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emitCartUpdated(items: CartItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, {
      detail: {
        items,
        totalQty: items.reduce((sum, entry) => sum + entry.qty, 0),
      },
    }));
  } catch {
    // Intentionally ignore event dispatch errors.
  }
}

function normalizeVariant(value: unknown): CartItemVariant | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'paperback' || normalized === 'hardcover') {
    return normalized;
  }
  return undefined;
}

export function getCartItemKey(item: Pick<CartItem, 'id' | 'variant'>): string {
  const variant = item.variant ?? 'paperback';
  return `${item.id}:${variant}`;
}

function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== 'object') return null;

  const rec = raw as Partial<CartItem>;
  const id = Number(rec.id);
  const title = typeof rec.title === 'string' ? rec.title.trim() : '';
  const author = typeof rec.author === 'string' ? rec.author.trim() : '';
  const cover = typeof rec.cover === 'string' ? rec.cover : '';
  const coverFallback = typeof rec.coverFallback === 'string' ? rec.coverFallback : '#e2e8f0';
  const price = Number(rec.price);
  const originalPrice = rec.originalPrice === undefined ? undefined : Number(rec.originalPrice);
  const qty = Math.max(1, Number(rec.qty) || 1);
  const edition = typeof rec.edition === 'string' && rec.edition.trim() ? rec.edition.trim() : 'Standard';
  const variant = normalizeVariant((rec as Record<string, unknown>).variant);
  const quality =
    typeof (rec as Record<string, unknown>).quality === 'string'
      ? ((rec as Record<string, unknown>).quality as string).trim()
      : '';
  const stockQuantity =
    (rec.stockQuantity ?? (rec as Record<string, unknown>).stock_quantity) === undefined
      ? undefined
      : Math.max(0, Math.trunc(Number(rec.stockQuantity ?? (rec as Record<string, unknown>).stock_quantity) || 0));

  if (!Number.isFinite(id) || id <= 0 || !title || !author || !Number.isFinite(price) || price < 0) {
    return null;
  }

  return {
    id,
    title,
    author,
    cover,
    coverFallback,
    price,
    originalPrice: Number.isFinite(originalPrice) ? originalPrice : undefined,
    qty,
    edition,
    ...(variant ? { variant } : {}),
    ...(quality ? { quality } : {}),
    stockQuantity: stockQuantity === undefined ? undefined : stockQuantity,
  };
}

function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => normalizeCartItem(entry))
    .filter((entry): entry is CartItem => entry !== null);
}

export function getStoredCartItems(): CartItem[] {
  if (!hasLocalStorage()) return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return normalizeCartItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function persistCartItems(items: CartItem[]): void {
  if (!hasLocalStorage()) return;

  try {
    const normalizedItems = normalizeCartItems(items);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedItems));
    emitCartUpdated(normalizedItems);
  } catch {
    // Intentionally ignore storage write errors.
  }
}

export function clearStoredCartItems(): void {
  if (!hasLocalStorage()) return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    emitCartUpdated([]);
  } catch {
    // Intentionally ignore storage write errors.
  }
}

export function addItemToStoredCart(item: CartItem): CartItem[] {
  const normalizedItem = normalizeCartItem(item);
  if (!normalizedItem) return getStoredCartItems();

  const current = getStoredCartItems();
  const maxQuantity = normalizedItem.stockQuantity;
  if (typeof maxQuantity === 'number' && maxQuantity <= 0) {
    return current;
  }
  const nextItemKey = getCartItemKey(normalizedItem);
  const existingIndex = current.findIndex((entry) => getCartItemKey(entry) === nextItemKey);

  let next;
  if (existingIndex === -1) {
    next = [...current, normalizedItem];
  } else {
    next = current.map((entry, index) => {
      if (index !== existingIndex) return entry;
      const mergedMax = normalizedItem.stockQuantity ?? entry.stockQuantity;
      const nextQtyRaw = entry.qty + normalizedItem.qty;
      const boundedQty = typeof mergedMax === 'number'
        ? Math.min(nextQtyRaw, Math.max(0, mergedMax))
        : nextQtyRaw;
      if (boundedQty <= 0) {
        return entry;
      }
      return {
        ...normalizedItem,
        qty: boundedQty,
        stockQuantity: mergedMax,
      };
    });
  }

  persistCartItems(next);
  return next;
}

export function removeItemFromStoredCart(itemId: number, variant?: CartItemVariant): CartItem[] {
  const current = getStoredCartItems();
  if (!variant) {
    const next = current.filter((entry) => entry.id !== itemId);
    persistCartItems(next);
    return next;
  }

  const next = current.filter((entry) => !(entry.id === itemId && (entry.variant ?? 'paperback') === variant));
  persistCartItems(next);
  return next;
}

export function getCartQuantityByBookId(
  bookId: number,
  items: CartItem[] = getStoredCartItems(),
  variant?: CartItemVariant,
): number {
  return items
    .filter((entry) => {
      if (entry.id !== bookId) return false;
      if (!variant) return true;
      return (entry.variant ?? 'paperback') === variant;
    })
    .reduce((sum, entry) => sum + entry.qty, 0);
}

export function getEffectiveStock(
  stockQuantity: number,
  bookId: number,
  items: CartItem[] = getStoredCartItems(),
  variant?: CartItemVariant,
): number {
  const normalizedStock = Math.max(0, Math.trunc(Number(stockQuantity) || 0));
  const reserved = getCartQuantityByBookId(bookId, items, variant);
  return Math.max(0, normalizedStock - reserved);
}
