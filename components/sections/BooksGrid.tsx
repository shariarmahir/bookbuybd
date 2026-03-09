'use client';

import Link from 'next/link';

const BESTSELLERS = [
  { title: 'The Christmas Gift DVD', author: 'Miro Jaroš', price: '12.61 TK', rating: 4, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80', badge: 'TOP PICK' },
  { title: 'The Secret List', author: 'Jacqueline Canesi', price: '11.16 TK', rating: 5, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80' },
  { title: 'The Mushroom Forest', author: 'Bufo Stiong', price: '8.40 TK', rating: 4, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80' },
  { title: 'The Expedition of Donald', author: 'Tana Reinharová Horst', price: '12.61 TK', rating: 5, img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80' },
  { title: 'The Hidden Truth', author: 'Karin Slaughter', price: '7.99 TK', rating: 4, img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&q=80' },
  { title: 'I Am Ideal: Just Like That', author: 'Marta Hrbátu', price: '9.58 TK', rating: 3, img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&q=80' },
];

const COMING_SOON = [
  { title: 'Teneref\'s Autochthon', author: 'Shaun Walker', price: '11.04 TK', rating: 5, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80', badge: 'UPCOMING', expected: '2024-12-25' },
  { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', price: '11.06 TK', rating: 5, img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80', expected: '2025-01-15' },
  { title: 'The Power of Now', author: 'Eckhart Tolle', price: '11.06 TK', rating: 4, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', expected: '2025-02-01' },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', price: '8.28 TK', rating: 5, img: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=200&q=80', expected: '2025-03-10' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w - 3 h - 3 ${s <= rating ? 'text-brand-500' : 'text-gray-200'} `} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function BookCard({ book }: { book: typeof BESTSELLERS[0] }) {
  return (
    <Link href="/book" className="flex gap-3 group cursor-pointer block">
      <div className="w-20 sm:w-24 aspect-[2/3] flex-shrink-0 rounded-md shadow-md overflow-hidden bg-gray-100 relative">
        <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
        {book.badge && (
          <span className="absolute top-0 left-0 text-[8px] bg-brand-500 text-white px-1 font-bold leading-tight">{book.badge}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase">{book.author}</p>
        <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-brand-600 transition line-clamp-2">{book.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-bold text-gray-900">{book.price}</span>
          <StarRating rating={book.rating} />
          <span className="text-[10px] text-gray-400">({book.rating * 12})</span>
        </div>
        <button className="mt-1 text-[10px] text-gray-400 hover:text-brand-600 flex items-center gap-1 transition">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </Link>
  );
}

function ComingBookCard({ book }: { book: typeof COMING_SOON[0] }) {
  return (
    <Link href="/book" className="flex gap-3 group cursor-pointer block">
      <div className="w-20 sm:w-24 aspect-[2/3] flex-shrink-0 rounded-md shadow-md overflow-hidden bg-gray-100">
        <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400">{book.author}</p>
        <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-brand-600 transition line-clamp-2">{book.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-bold text-brand-600">{book.price}</span>
          <StarRating rating={book.rating} />
        </div>
        <p className="text-xs text-brand-600 font-bold mt-1">Expected: {book.expected}</p>
      </div>
    </Link>
  );
}

export default function BooksGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bestsellers */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Bestsellers</h2>
              <p className="text-sm text-gray-500 mt-1">Our most popular books right now</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex text-sm font-bold text-brand-600 hover:text-brand-700 items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BESTSELLERS.map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>
          <Link href="/shop" className="mt-4 text-xs text-brand-600 font-semibold hover:underline">VIEW MORE</Link>
        </div>

        {/* Divider - hidden on mobile */}
        <div className="hidden lg:block w-px bg-gray-100" />

        {/* Coming Soon */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Coming Soon</h2>
            <div className="flex gap-1">
              <button className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {COMING_SOON.map((book, i) => (
              <ComingBookCard key={i} book={book} />
            ))}
          </div>
          <Link href="/shop" className="mt-4 text-xs text-brand-600 font-semibold hover:underline">VIEW MORE</Link>
        </div>
      </div>
    </section>
  );
}