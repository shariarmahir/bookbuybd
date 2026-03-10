'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
type Book = {
    id: number;
    title: string;
    author: string;
    genre: string;
    rating: number;
    reviews: number;
    likes: number;
    price: string;
    excerpt: string;
    img: string;
    imgFallbackColor: string;
    badge?: string;
    likedBy: string;
    likedByImg: string[];
    expected?: string;
};

type CartItem = { book: Book; qty: number };

/* ══════════════════════════════════════════════════════
   DATA — all 20 books merged from Books.tsx + BooksGrid.tsx
══════════════════════════════════════════════════════ */
const BOOKS: Book[] = [
    { id: 1, title: 'Act Like It', author: 'by Lucy Parker', genre: 'Fiction', rating: 4, reviews: 291, likes: 498, price: '9.58 TK', excerpt: 'A witty romantic comedy set in the world of London theatre — sparkling with tension and charm.', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80', imgFallbackColor: '#e11d48', likedBy: 'Samantha William and 2 other friends like this', likedByImg: [] },
    { id: 2, title: 'Alone On The Wall', author: 'by Alex Honnold', genre: 'Biography', rating: 4, reviews: 148, likes: 612, price: '11.16 TK', excerpt: 'The breathtaking story of the world\'s greatest solo free climber — told in his own fearless words.', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', imgFallbackColor: '#0284c7', likedBy: 'Kimberly Jones likes this', likedByImg: [] },
    { id: 3, title: "The Painter's Daughter", author: 'by Lucy Parker', genre: 'Fiction', rating: 4, reviews: 291, likes: 384, price: '8.40 TK', excerpt: 'A sweeping historical romance about art, identity, and the choices that define us across generations.', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80', imgFallbackColor: '#7c3aed', likedBy: 'Adam and Kimberly like this', likedByImg: [] },
    { id: 4, title: 'Dark Murder', author: 'by Alex Ferguson', genre: 'Fiction', rating: 5, reviews: 100, likes: 219, price: '12.61 TK', excerpt: 'A gripping crime thriller that keeps you guessing until the very last page — masterfully plotted.', img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80', imgFallbackColor: '#1e293b', likedBy: 'Samantha and friends like this', likedByImg: [], badge: 'TOP PICK' },
    { id: 5, title: 'Alex Ferguson: My Autobiography', author: 'by Alex Ferguson', genre: 'Biography', rating: 4, reviews: 291, likes: 742, price: '12.61 TK', excerpt: 'The definitive memoir from one of the greatest football managers of all time — frank, revealing, and compelling.', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&q=80', imgFallbackColor: '#374151', likedBy: 'Samantha and friends like this', likedByImg: [] },
    { id: 6, title: 'The Devils Playground', author: 'by Elvis Freed', genre: 'Fiction', rating: 3, reviews: 80, likes: 155, price: '7.99 TK', excerpt: 'A dark atmospheric tale of moral ambiguity set in post-war America where nothing is quite what it seems.', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&q=80', imgFallbackColor: '#b45309', likedBy: 'Kimberly Jones likes this', likedByImg: [] },
    { id: 7, title: 'Inconceivable', author: 'by Tegan Wren', genre: 'Business', rating: 4, reviews: 115, likes: 329, price: '9.58 TK', excerpt: 'A captivating look at how bold entrepreneurs turned impossible ideas into billion-dollar realities.', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80', imgFallbackColor: '#6b7280', likedBy: 'Adam and Kimberly like this', likedByImg: [] },
    { id: 8, title: 'Four Days', author: 'by Alex Ryan', genre: 'Science', rating: 4, reviews: 200, likes: 410, price: '8.28 TK', excerpt: 'A riveting account of humanity\'s greatest scientific race told through four decisive days that changed everything.', img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80', imgFallbackColor: '#0d9488', likedBy: 'Samantha and friends like this', likedByImg: [] },
    { id: 9, title: 'The Lean Startup', author: 'by Eric Ries', genre: 'Business', rating: 5, reviews: 512, likes: 890, price: '11.06 TK', excerpt: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses from scratch.', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', imgFallbackColor: '#0f766e', likedBy: 'Samantha and others like this', likedByImg: [], badge: 'BESTSELLER' },
    { id: 10, title: 'Zero to One', author: 'by Peter Thiel', genre: 'Business', rating: 5, reviews: 444, likes: 720, price: '11.06 TK', excerpt: 'Notes on startups, or how to build the future. A must-read for every entrepreneur and visionary.', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80', imgFallbackColor: '#1d4ed8', likedBy: 'Adam and Kimberly like this', likedByImg: [] },
    { id: 11, title: 'A Brief History of Time', author: 'by Stephen Hawking', genre: 'Science', rating: 5, reviews: 820, likes: 1200, price: '12.61 TK', excerpt: 'From the Big Bang to black holes — a landmark book that made the universe accessible to every curious reader.', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80', imgFallbackColor: '#1e3a8a', likedBy: 'Kimberly and others like this', likedByImg: [], badge: 'CLASSIC' },
    { id: 12, title: 'Sapiens', author: 'by Yuval Noah Harari', genre: 'Science', rating: 5, reviews: 950, likes: 1450, price: '11.04 TK', excerpt: 'A brief history of humankind from the Stone Age to the twenty-first century — told with brilliant clarity.', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', imgFallbackColor: '#0369a1', likedBy: 'Samantha and others like this', likedByImg: [] },
    { id: 13, title: 'Meditations', author: 'by Marcus Aurelius', genre: 'Philosophy', rating: 5, reviews: 640, likes: 980, price: '8.40 TK', excerpt: 'Personal writings of Roman Emperor Marcus Aurelius — a timeless guide to Stoic wisdom still revered today.', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80', imgFallbackColor: '#5b21b6', likedBy: 'Adam and Kimberly like this', likedByImg: [], badge: 'TIMELESS' },
    { id: 14, title: 'The Republic', author: 'by Plato', genre: 'Philosophy', rating: 4, reviews: 310, likes: 540, price: '7.99 TK', excerpt: 'One of the most influential works in Western philosophy, exploring justice, beauty, and equality.', img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80', imgFallbackColor: '#4c1d95', likedBy: 'Kimberly Jones likes this', likedByImg: [] },
    { id: 15, title: 'Steve Jobs', author: 'by Walter Isaacson', genre: 'Biography', rating: 5, reviews: 730, likes: 1100, price: '12.61 TK', excerpt: 'The exclusive biography of Apple\'s visionary co-founder, based on over forty in-depth interviews.', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&q=80', imgFallbackColor: '#be185d', likedBy: 'Samantha and others like this', likedByImg: [], badge: 'TOP PICK' },
    { id: 16, title: 'Educated', author: 'by Tara Westover', genre: 'Biography', rating: 5, reviews: 610, likes: 870, price: '11.16 TK', excerpt: 'A memoir about a young woman who escapes a survivalist family to earn a PhD from Cambridge University.', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&q=80', imgFallbackColor: '#9d174d', likedBy: 'Adam and Kimberly like this', likedByImg: [] },
    // Coming Soon — from BooksGrid.tsx
    { id: 17, title: "Teneref's Autochthon", author: 'by Shaun Walker', genre: 'Fiction', rating: 5, reviews: 0, likes: 0, price: '11.04 TK', excerpt: 'An epic speculative fantasy set on an alien world where ancient myths collide with present-day politics.', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80', imgFallbackColor: '#1e40af', likedBy: '', likedByImg: [], expected: '2024-12-25', badge: 'UPCOMING' },
    { id: 18, title: 'The Subtle Art of Not Giving a F*ck', author: 'by Mark Manson', genre: 'Philosophy', rating: 5, reviews: 0, likes: 0, price: '11.06 TK', excerpt: 'A counterintuitive approach to living a good life — raw, funny, and surprisingly profound self-help.', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80', imgFallbackColor: '#b45309', likedBy: '', likedByImg: [], expected: '2025-01-15', badge: 'UPCOMING' },
    { id: 19, title: 'The Power of Now', author: 'by Eckhart Tolle', genre: 'Philosophy', rating: 4, reviews: 0, likes: 0, price: '11.06 TK', excerpt: 'A guide to spiritual enlightenment showing how living in the present moment transforms every aspect of life.', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', imgFallbackColor: '#047857', likedBy: '', likedByImg: [], expected: '2025-02-01', badge: 'UPCOMING' },
    { id: 20, title: "Harry Potter and the Philosopher's Stone", author: 'by J.K. Rowling', genre: 'Fiction', rating: 5, reviews: 0, likes: 0, price: '8.28 TK', excerpt: 'The iconic first chapter of Harry\'s journey into Hogwarts — a story of magic, friendship, and belonging.', img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80', imgFallbackColor: '#b91c1c', likedBy: '', likedByImg: [], expected: '2025-03-10', badge: 'UPCOMING' },
];

const GENRES = ['All Genres', 'Business', 'Science', 'Fiction', 'Philosophy', 'Biography'];

const GENRE_META: Record<string, { description: string; color: string; accent: string }> = {
    'All Genres': { description: 'Explore our full collection across all genres.', color: '#1e40af', accent: '#dbeafe' },
    'Business': { description: 'Master strategy, finance and entrepreneurship.', color: '#065f46', accent: '#d1fae5' },
    'Science': { description: 'Discover the universe — from quantum physics to biology.', color: '#1e3a5f', accent: '#e0f2fe' },
    'Fiction': { description: 'Lose yourself in captivating stories and characters.', color: '#7c2d12', accent: '#ffedd5' },
    'Philosophy': { description: 'Question everything with the greatest thinkers.', color: '#4c1d95', accent: '#ede9fe' },
    'Biography': { description: 'Real lives, real lessons — stories that shaped the world.', color: '#831843', accent: '#fce7f3' },
};

const AUTHORS_OF_WEEK = [
    { name: 'Sebastian Jeremy', initials: 'SJ', color: '#0d9488' },
    { name: 'Jonathan Doe', initials: 'JD', color: '#2563eb' },
    { name: 'Angeline Summer', initials: 'AS', color: '#7c3aed' },
    { name: 'Noah Jones', initials: 'NJ', color: '#b45309' },
    { name: 'Tommy Adam', initials: 'TA', color: '#be185d' },
    { name: 'Ian Cassandra', initials: 'IC', color: '#047857' },
];

const BOOKS_OF_YEAR = BOOKS.filter(b => [11, 12, 13, 15].includes(b.id));
const BESTSELLERS = BOOKS.filter(b => [9, 4, 11, 15, 12, 13].includes(b.id));
const COMING_SOON = BOOKS.filter(b => !!b.expected);
const PREVIEW_SIZE = 4;
const DETAIL_SIZE = 6;

/* ══════════════════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════════════════ */
function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < count ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function BookCover({ src, color, title }: { src: string; color: string; title: string }) {
    const [err, setErr] = useState(false);
    return (
        <div className="w-full h-full" style={{ borderRadius: 'inherit' }}>
            {!err
                ? <img src={src} alt={title} className="w-full h-full object-cover" onError={() => setErr(true)} />
                : <div className="w-full h-full flex items-center justify-center p-2" style={{ background: color }}>
                    <span className="text-white text-[10px] font-bold text-center leading-tight">{title}</span>
                </div>}
        </div>
    );
}

function Avatar({ initials, color, size = 20 }: { initials: string; color: string; size?: number }) {
    return (
        <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
            {initials[0]}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════ */
function CartDrawer({ cart, onClose, onQty, onRemove }: {
    cart: CartItem[]; onClose: () => void;
    onQty: (id: number, d: number) => void;
    onRemove: (id: number) => void;
}) {
    const total = cart.reduce((s, ci) => s + parseFloat(ci.book.price) * ci.qty, 0);
    const qty = cart.reduce((s, ci) => s + ci.qty, 0);
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-extrabold text-gray-900">Your Cart ({qty})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm font-medium">Your cart is empty</p>
                        </div>
                    ) : cart.map(ci => (
                        <div key={ci.book.id} className="flex gap-3 px-4 py-3">
                            <div className="w-12 flex-shrink-0 rounded-md overflow-hidden" style={{ aspectRatio: '2/3' }}>
                                <BookCover src={ci.book.img} color={ci.book.imgFallbackColor} title={ci.book.title} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{ci.book.title}</p>
                                <p className="text-[10px] text-gray-400 mb-1.5">{ci.book.author}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1.5 py-0.5">
                                        <button onClick={() => onQty(ci.book.id, -1)} className="w-5 h-5 rounded-full bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 text-sm font-bold flex items-center justify-center shadow-sm transition">−</button>
                                        <span className="text-xs font-bold text-gray-700 w-4 text-center">{ci.qty}</span>
                                        <button onClick={() => onQty(ci.book.id, +1)} className="w-5 h-5 rounded-full bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 text-sm font-bold flex items-center justify-center shadow-sm transition">+</button>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">{ci.book.price}</span>
                                </div>
                            </div>
                            <button onClick={() => onRemove(ci.book.id)} className="text-gray-300 hover:text-red-400 transition self-start mt-0.5 text-sm">✕</button>
                        </div>
                    ))}
                </div>
                {cart.length > 0 && (
                    <div className="px-5 py-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">Total</span>
                            <span className="text-base font-extrabold text-gray-900">{total.toFixed(2)} TK</span>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition active:scale-[0.98]">
                            Checkout →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════
   BOOK CARD — horizontal list
══════════════════════════════════════════════════════ */
function BookCardList({ book, onAdd }: { book: Book; onAdd: (b: Book) => void }) {
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    const handleAdd = () => { onAdd(book); setAdded(true); setTimeout(() => setAdded(false), 1500); };
    return (
        <div className="flex gap-4 py-5 border-b border-gray-100 group">
            <Link href="/book" className="flex-shrink-0 rounded-lg shadow-md overflow-hidden block" style={{ width: 72, aspectRatio: '2/3' }}>
                <BookCover src={book.img} color={book.imgFallbackColor} title={book.title} />
            </Link>
            <div className="flex-1 min-w-0">
                {book.badge && <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mb-1 bg-blue-50 text-blue-700">{book.badge}</span>}
                <Link href="/book"><h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight line-clamp-1 mb-0.5">{book.title}</h4></Link>
                <p className="text-xs text-gray-400 mb-1.5">{book.author}</p>
                <div className="flex items-center gap-1.5 mb-1.5"><Stars count={book.rating} /><span className="text-[11px] text-gray-400">({book.reviews})</span></div>
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2.5">{book.excerpt}</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleAdd} className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-[0.97] ${added ? 'bg-green-500 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}>
                        {added ? '✓ Added' : 'Add to Cart'}
                    </button>
                    <Link href="/book" className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all active:scale-[0.97]">
                        Shop Now
                    </Link>
                    <button onClick={() => setLiked(l => !l)} className={`transition ${liked ? 'text-brand-500' : 'text-gray-300 hover:text-brand-400'}`}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                    </button>
                    <span className="text-xs font-bold text-gray-800 ml-auto">{book.price}</span>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   BOOK CARD — grid (detail page)
══════════════════════════════════════════════════════ */
function BookCardGrid({ book, onAdd }: { book: Book; onAdd: (b: Book) => void }) {
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); onAdd(book); setAdded(true); setTimeout(() => setAdded(false), 1500); };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <Link href="/book" className="relative overflow-hidden block" style={{ aspectRatio: '2/3' }}>
                <BookCover src={book.img} color={book.imgFallbackColor} title={book.title} />
                {book.badge && <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: book.badge === 'UPCOMING' ? '#f59e0b' : '#2563eb' }}>{book.badge}</span>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <div className="p-3 flex-1 flex flex-col">
                <Link href="/book"><h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight line-clamp-1 mb-0.5">{book.title}</h4></Link>
                <p className="text-[10px] text-gray-400 mb-1">{book.author}</p>
                <div className="flex items-center gap-1.5 mb-1.5"><Stars count={book.rating} /><span className="text-[10px] text-gray-400">({book.reviews})</span></div>
                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mb-2 flex-1">{book.excerpt}</p>
                {book.expected && <p className="text-[10px] text-amber-600 font-bold mb-1.5">Expected: {book.expected}</p>}
                <div className="flex items-center justify-between">
                    <button onClick={handleAdd} className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all active:scale-[0.97] ${added ? 'bg-green-500 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}>
                        {added ? '✓ Added' : 'Add to Cart'}
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-brand-600">{book.price}</span>
                        <button onClick={() => setLiked(l => !l)} className={`transition ml-1 ${liked ? 'text-brand-500' : 'text-gray-300 hover:text-brand-400'}`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   BESTSELLER MINI CARD
══════════════════════════════════════════════════════ */
function BestsellerCard({ book, onAdd }: { book: Book; onAdd: (b: Book) => void }) {
    const [added, setAdded] = useState(false);
    return (
        <Link href="/book" className="flex gap-3 group cursor-pointer">
            <div className="flex-shrink-0 rounded-md shadow-md overflow-hidden relative" style={{ width: 56, aspectRatio: '2/3' }}>
                <BookCover src={book.img} color={book.imgFallbackColor} title={book.title} />
                {book.badge && <span className="absolute top-0 left-0 text-[7px] bg-blue-600 text-white px-1 font-bold leading-tight">{book.badge}</span>}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 uppercase truncate">{book.author}</p>
                <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition line-clamp-2">{book.title}</p>
                <div className="flex items-center gap-1 mt-0.5 mb-1.5"><span className="text-xs font-bold text-gray-900">{book.price}</span><Stars count={book.rating} /></div>
                <button onClick={e => { e.preventDefault(); onAdd(book); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${added ? 'bg-green-500 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}>
                    {added ? '✓ Added' : 'Add to Cart'}
                </button>
            </div>
        </Link>
    );
}

function ComingBookCard({ book }: { book: Book }) {
    return (
        <Link href="/book" className="flex gap-3 group cursor-pointer">
            <div className="flex-shrink-0 rounded-md shadow-md overflow-hidden" style={{ width: 56, aspectRatio: '2/3' }}>
                <BookCover src={book.img} color={book.imgFallbackColor} title={book.title} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 truncate">{book.author}</p>
                <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition line-clamp-2">{book.title}</p>
                <div className="flex items-center gap-1 mt-0.5"><span className="text-xs font-bold text-blue-600">{book.price}</span><Stars count={book.rating} /></div>
                <p className="text-[10px] text-amber-600 font-bold mt-0.5">Expected: {book.expected}</p>
            </div>
        </Link>
    );
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
function Sidebar({ onGenreClick }: { onGenreClick: (g: string) => void }) {
    return (
        <aside className="flex flex-col gap-6" style={{ width: 185, minWidth: 185 }}>
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Author of the week</h3>
                <ul className="space-y-2.5">
                    {AUTHORS_OF_WEEK.map((a, i) => (
                        <li key={i} className="flex items-center gap-2.5 group cursor-pointer">
                            <Avatar initials={a.initials} color={a.color} size={28} />
                            <span className="text-xs text-gray-700 group-hover:text-blue-600 transition font-medium">{a.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="h-px bg-gray-100" />
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Books of the year</h3>
                <ul className="space-y-3">
                    {BOOKS_OF_YEAR.map((b, i) => (
                        <li key={i} className="flex gap-2.5 group cursor-pointer">
                            <div className="flex-shrink-0 rounded-md shadow-sm overflow-hidden" style={{ width: 36, aspectRatio: '2/3' }}>
                                <BookCover src={b.img} color={b.imgFallbackColor} title={b.title} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-gray-800 group-hover:text-blue-600 transition leading-tight line-clamp-2">{b.title}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{b.author}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="h-px bg-gray-100" />
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Browse Genres</h3>
                <ul className="space-y-1">
                    {GENRES.filter(g => g !== 'All Genres').map(g => {
                        const m = GENRE_META[g];
                        return (
                            <li key={g}>
                                <button onClick={() => onGenreClick(g)}
                                    className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-blue-600 transition font-medium py-1 px-2 rounded-lg hover:bg-blue-50">
                                    <span>{g}</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: m.accent, color: m.color }}>
                                        {BOOKS.filter(b => b.genre === g && !b.expected).length}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}

/* ══════════════════════════════════════════════════════
   GENRE PREVIEW SECTION
══════════════════════════════════════════════════════ */
function GenrePreviewSection({ genre, onViewMore, onAdd }: {
    genre: string; onViewMore: (g: string) => void; onAdd: (b: Book) => void;
}) {
    const m = GENRE_META[genre];
    const [previewSize, setPreviewSize] = useState(PREVIEW_SIZE);
    const allGenreBooks = BOOKS.filter(b => b.genre === genre && !b.expected);
    const books = allGenreBooks.slice(0, previewSize);
    const total = allGenreBooks.length;
    const hasMore = previewSize < total;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3" style={{ background: m.accent }}>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: m.color }} />
                    <h3 className="text-sm font-extrabold" style={{ color: m.color }}>{genre}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: m.color }}>{total} books</span>
                </div>
                <button onClick={() => onViewMore(genre)}
                    className="flex items-center gap-2 bg-white/40 hover:bg-white/60 text-gray-900 font-bold text-[10px] px-4 py-1.5 rounded-full transition backdrop-blur-sm">
                    Shop {genre}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
                {books.map(b => <BookCardList key={b.id} book={b} onAdd={onAdd} />)}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-4">
                    <button onClick={() => setPreviewSize(prev => prev + PREVIEW_SIZE)}
                        className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition px-6 py-2 rounded-full border border-brand-100 hover:bg-brand-50">
                        View More {genre}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   CATEGORY DETAIL PAGE
══════════════════════════════════════════════════════ */
function CategoryDetailPage({ genre, onBack, onGenreSwitch, onAdd }: {
    genre: string; onBack: () => void; onGenreSwitch: (g: string) => void; onAdd: (b: Book) => void;
}) {
    const [visible, setVisible] = useState(DETAIL_SIZE);
    const [sort, setSort] = useState<'popular' | 'rating' | 'reviews'>('popular');
    const m = GENRE_META[genre] ?? GENRE_META['All Genres'];
    const allBooks = (genre === 'All Genres' ? BOOKS : BOOKS.filter(b => b.genre === genre)).filter(b => !b.expected);
    const sorted = [...allBooks].sort((a, b) => sort === 'popular' ? b.likes - a.likes : sort === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);
    const shown = sorted.slice(0, visible);
    const hasMore = visible < sorted.length;

    return (
        <div>
            {/* Hero banner */}
            <div className="rounded-2xl p-5 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
                <div className="relative flex items-center justify-between gap-4">
                    <div>
                        <button onClick={onBack} className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium mb-2 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            All Categories
                        </button>
                        <h2 className="text-2xl font-extrabold text-white mb-1">{genre}</h2>
                        <p className="text-sm text-white/80">{m.description}</p>
                        <p className="text-xs text-white/60 mt-1">{allBooks.length} books available</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end max-w-xs">
                        {GENRES.filter(g => g !== 'All Genres' && g !== genre).map(g => (
                            <button key={g} onClick={() => onGenreSwitch(g)}
                                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition">{g}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">Showing <strong className="text-gray-800">{shown.length}</strong> of <strong className="text-gray-800">{allBooks.length}</strong> books</p>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-full">
                    {(['popular', 'rating', 'reviews'] as const).map(s => (
                        <button key={s} onClick={() => setSort(s)}
                            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all capitalize ${sort === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {shown.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-300">
                    <p className="text-sm font-medium">No books in this genre yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {shown.map(b => <BookCardGrid key={b.id} book={b} onAdd={onAdd} />)}
                </div>
            )}

            {hasMore && (
                <div className="sticky bottom-6 flex justify-center mt-6 pointer-events-none">
                    <button onClick={() => setVisible(c => c + DETAIL_SIZE)}
                        className="pointer-events-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm px-8 py-3 rounded-full shadow-xl transition-all">
                        View More {genre === 'All Genres' ? 'Books' : genre + ' Books'}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/25">+{Math.min(DETAIL_SIZE, sorted.length - visible)} more</span>
                    </button>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   BOOKS GRID PANEL — Bestsellers + Coming Soon
══════════════════════════════════════════════════════ */
function BooksGridPanel({ onAdd }: { onAdd: (b: Book) => void }) {
    const [bestsellerVisible, setBestsellerVisible] = useState(BESTSELLERS.length / 2); // Initial split-like view
    const [comingVisible, setComingVisible] = useState(3);

    const shownBestsellers = BESTSELLERS.slice(0, bestsellerVisible);
    const hasMoreBestsellers = bestsellerVisible < BESTSELLERS.length;

    const shownComing = COMING_SOON.slice(0, comingVisible);
    const hasMoreComing = comingVisible < COMING_SOON.length;

    return (
        <section className="border-t border-gray-100 pt-8 mt-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-5">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Bestsellers</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Our most popular books right now</p>
                        </div>
                        {hasMoreBestsellers && (
                            <button onClick={() => setBestsellerVisible(v => v + 2)} className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition">
                                View All <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {shownBestsellers.map(b => <BestsellerCard key={b.id} book={b} onAdd={onAdd} />)}
                    </div>
                    {hasMoreBestsellers && (
                        <button onClick={() => setBestsellerVisible(v => v + 2)} className="mt-4 block text-[10px] text-brand-600 font-black hover:underline tracking-widest uppercase">VIEW MORE</button>
                    )}
                </div>
                <div className="hidden lg:block w-px bg-gray-100" />
                <div className="w-full lg:w-64 lg:flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Coming Soon</h2>
                        <div className="flex gap-1">
                            {[false, true].map((_, i) => (
                                <button key={i} className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i === 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">{shownComing.map(b => <ComingBookCard key={b.id} book={b} />)}</div>
                    {hasMoreComing && (
                        <button onClick={() => setComingVisible(v => v + 3)} className="mt-4 block text-[10px] text-brand-600 font-black hover:underline tracking-widest uppercase">VIEW MORE</button>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function CategoryDetails() {
    const [activeGenre, setActiveGenre] = useState('All Genres');
    const [detailGenre, setDetailGenre] = useState<string | null>(null);
    const [genreVisible, setGenreVisible] = useState(PREVIEW_SIZE);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);

    const cartCount = cart.reduce((s, c) => s + c.qty, 0);

    const addToCart = useCallback((book: Book) => {
        setCart(prev => {
            const ex = prev.find(c => c.book.id === book.id);
            return ex ? prev.map(c => c.book.id === book.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { book, qty: 1 }];
        });
        setCartOpen(true);
    }, []);

    const updateQty = (id: number, d: number) => setCart(prev => prev.map(c => c.book.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c));
    const removeItem = (id: number) => setCart(prev => prev.filter(c => c.book.id !== id));
    const goToDetail = (g: string) => { setDetailGenre(g); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const goBack = () => setDetailGenre(null);

    const handleSearch = (q: string) => {
        setSearch(q);
        setSearchResults(q.length > 1
            ? BOOKS.filter(b => b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()) || b.genre.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
            : []);
    };

    const filteredAll = BOOKS.filter(b => (activeGenre === 'All Genres' || b.genre === activeGenre) && !b.expected);
    const shownAll = filteredAll.slice(0, genreVisible);
    const hasMoreAll = genreVisible < filteredAll.length;

    return (
        <div className="bg-[#fcfdfe]">
            <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}.faded{animation:fadeDown .18s ease}`}</style>

            {/* Local Cart Drawer - for items on this page */}
            {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQty={updateQty} onRemove={removeItem} />}

            {/* ── BODY ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb */}
                <nav className="text-[11px] text-gray-400 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-brand-600 transition">Homepage</Link>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    {detailGenre ? (
                        <><button onClick={goBack} className="hover:text-brand-600 transition">All Categories</button><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg><span className="text-gray-700 font-bold">{detailGenre}</span></>
                    ) : <span className="text-gray-700 font-bold">Categories</span>}
                </nav>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <Sidebar onGenreClick={goToDetail} />
                    </div>

                    <div className="hidden lg:block w-px bg-gray-100 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        {detailGenre ? (
                            <CategoryDetailPage genre={detailGenre} onBack={goBack} onGenreSwitch={g => setDetailGenre(g)} onAdd={addToCart} />
                        ) : (
                            <>
                                {/* Heading + Shop Now CTA */}
                                <div className="flex items-end justify-between mb-6">
                                    <div className="animate-in fade-in slide-in-from-left duration-700">
                                        <h1 className="text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Lora', serif" }}>Explore Categories</h1>
                                        <p className="text-sm text-gray-500 mt-1">Discover over {filteredAll.length} curated titles just for you</p>
                                    </div>
                                    <button onClick={() => goToDetail('Fiction')}
                                        className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-brand-500/20 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5 active:scale-[0.97]">
                                        Shop Best Fiction
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>

                                {/* Genre tabs */}
                                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                                    {GENRES.map(g => (
                                        <button key={g} onClick={() => { setActiveGenre(g); setGenreVisible(PREVIEW_SIZE); }}
                                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeGenre === g ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600'}`}>
                                            {g}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-100 rounded-full mb-8" />

                                {activeGenre === 'All Genres' ? (
                                    <div className="space-y-4">
                                        {GENRES.filter(g => g !== 'All Genres').map(g =>
                                            BOOKS.some(b => b.genre === g && !b.expected) && (
                                                <div key={g} className="animate-in fade-in duration-1000">
                                                    <GenrePreviewSection genre={g} onViewMore={goToDetail} onAdd={addToCart} />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="rounded-2xl px-6 py-5 mb-8 flex items-center justify-between shadow-sm border border-brand-100" style={{ background: `linear-gradient(to right, ${GENRE_META[activeGenre]?.accent}44, ${GENRE_META[activeGenre]?.accent}88)` }}>
                                            <div>
                                                <h3 className="text-lg font-bold" style={{ color: GENRE_META[activeGenre]?.color }}>{activeGenre}</h3>
                                                <p className="text-xs mt-1 max-w-lg" style={{ color: GENRE_META[activeGenre]?.color, opacity: 0.8 }}>{GENRE_META[activeGenre]?.description}</p>
                                            </div>
                                            <button onClick={() => goToDetail(activeGenre)}
                                                className="hidden sm:flex items-center gap-2 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-95 hover:scale-105 active:scale-95 flex-shrink-0"
                                                style={{ background: GENRE_META[activeGenre]?.color }}>
                                                View Collection
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                            {shownAll.map(b => <BookCardList key={b.id} book={b} onAdd={addToCart} />)}
                                        </div>
                                        {hasMoreAll && (
                                            <div className="flex justify-center mt-10">
                                                <button onClick={() => setGenreVisible(c => c + PREVIEW_SIZE)}
                                                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-600 active:scale-[0.98] font-bold text-sm px-10 py-3 rounded-full shadow-sm transition-all">
                                                    Load More Books
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {!detailGenre && (
                    <div className="mt-16 pt-12 border-t border-gray-100">
                        <BooksGridPanel onAdd={addToCart} />
                    </div>
                )}
            </main>
        </div>
    );
}
