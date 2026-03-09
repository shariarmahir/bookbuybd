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
}

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

export const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    title: 'Bald Bearded Boss',
    author: 'Elliott Holt',
    cover: '/images/book-detail/cover.jpg',
    coverFallback: '#c2410c',
    price: 320,
    originalPrice: 420,
    qty: 1,
    edition: 'Paperback',
  },
  {
    id: 2,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    cover: '/images/books/book9.jpg',
    coverFallback: '#0f766e',
    price: 450,
    originalPrice: 550,
    qty: 2,
    edition: 'Hardback',
  },
  {
    id: 3,
    title: 'Meditations',
    author: 'Marcus Aurelius',
    cover: '/images/books/book13.jpg',
    coverFallback: '#5b21b6',
    price: 280,
    qty: 1,
    edition: 'Paperback',
  },
];

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
