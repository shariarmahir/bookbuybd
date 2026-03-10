'use client';
import { useState } from 'react';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const AUTHORS_OF_WEEK = [
  { name: 'Sebastian Jeremy', img: '/images/authors/author1.jpg', initials: 'SJ', color: '#0d9488' },
  { name: 'Jonathan Doe', img: '/images/authors/author2.jpg', initials: 'JD', color: '#2563eb' },
  { name: 'Angeline Summer', img: '/images/authors/author3.jpg', initials: 'AS', color: '#7c3aed' },
  { name: 'Noah Jones', img: '/images/authors/author4.jpg', initials: 'NJ', color: '#b45309' },
  { name: 'Tommy Adam', img: '/images/authors/author5.jpg', initials: 'TA', color: '#be185d' },
  { name: 'Ian Cassandra', img: '/images/authors/author6.jpg', initials: 'IC', color: '#047857' },
];

const BOOKS_OF_YEAR = [
  { title: 'Big Magic: Creative Living Beyond Fear', author: 'by Elizabeth Gilbert', img: '/images/books/year1.jpg' },
  { title: 'Big Magic: Creative Living Beyond Fear', author: 'by Elizabeth Gilbert', img: '/images/books/year2.jpg' },
  { title: 'Big Magic: Creative Living Beyond Fear', author: 'by Elizabeth Gilbert', img: '/images/books/year3.jpg' },
  { title: 'Big Magic: Creative Living Beyond Fear', author: 'by Elizabeth Gilbert', img: '/images/books/year4.jpg' },
];

const GENRES = ['All Genres', 'Business', 'Science', 'Fiction', 'Philosophy', 'Biography'];

const GENRE_META: Record<string, { description: string; color: string; accent: string }> = {
  'All Genres': { description: 'Explore our full collection across all genres.', color: '#1e40af', accent: '#dbeafe' },
  'Business': { description: 'Master strategy, finance and entrepreneurship.', color: '#065f46', accent: '#d1fae5' },
  'Science': { description: 'Discover the universe — from quantum physics to biology.', color: '#1e3a5f', accent: '#e0f2fe' },
  'Fiction': { description: 'Lose yourself in captivating stories and unforgettable characters.', color: '#7c2d12', accent: '#ffedd5' },
  'Philosophy': { description: 'Question everything with the greatest thinkers of all time.', color: '#4c1d95', accent: '#ede9fe' },
  'Biography': { description: 'Real lives, real lessons — stories of people who shaped the world.', color: '#831843', accent: '#fce7f3' },
};

const BOOKS = [
  { id: 1, title: 'Act Like It', author: 'by Lucy Parker', genre: 'Fiction', rating: 4, reviews: 291, likes: 498, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book1.jpg', imgFallbackColor: '#e11d48', likedBy: 'Samantha William and 2 other friends like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 2, title: 'Alone On The Wall', author: 'by Alex Honnold', genre: 'Biography', rating: 4, reviews: 148, likes: 612, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book2.jpg', imgFallbackColor: '#0284c7', likedBy: 'Kimberly Jones like this', likedByImg: ['/images/avatars/av3.jpg'] },
  { id: 3, title: "The Painter's Daughter", author: 'by Lucy Parker', genre: 'Fiction', rating: 4, reviews: 291, likes: 384, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book3.jpg', imgFallbackColor: '#7c3aed', likedBy: 'Adam and Kimberly like this', likedByImg: ['/images/avatars/av4.jpg', '/images/avatars/av5.jpg'] },
  { id: 4, title: 'Dark Murder', author: 'by Alex Ferguson', genre: 'Fiction', rating: 5, reviews: 100, likes: 219, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book4.jpg', imgFallbackColor: '#1e293b', likedBy: 'Samantha William and 2 other friends like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 5, title: 'Alex Ferguson: My Auto...', author: 'by Alex Ferguson', genre: 'Biography', rating: 4, reviews: 291, likes: 742, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book5.jpg', imgFallbackColor: '#374151', likedBy: 'Samantha William and 2 other friends like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 6, title: 'The Devils Playground', author: 'by Elvis Freed', genre: 'Fiction', rating: 3, reviews: 80, likes: 155, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book6.jpg', imgFallbackColor: '#b45309', likedBy: 'Kimberly Jones like this', likedByImg: ['/images/avatars/av3.jpg'] },
  { id: 7, title: 'Inconceivable', author: 'by Tegan Wren', genre: 'Business', rating: 4, reviews: 115, likes: 329, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book7.jpg', imgFallbackColor: '#6b7280', likedBy: 'Adam and Kimberly like this', likedByImg: ['/images/avatars/av4.jpg', '/images/avatars/av5.jpg'] },
  { id: 8, title: 'Four Days', author: 'by Alex Ryan', genre: 'Science', rating: 4, reviews: 200, likes: 410, excerpt: 'Lorem ipsum dolor sit amet, consec te adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore si.', img: '/images/books/book8.jpg', imgFallbackColor: '#0d9488', likedBy: 'Samantha William and 2 other friends like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 9, title: 'The Lean Startup', author: 'by Eric Ries', genre: 'Business', rating: 5, reviews: 512, likes: 890, excerpt: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses from scratch.', img: '/images/books/book9.jpg', imgFallbackColor: '#0f766e', likedBy: 'Samantha William and 2 others like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 10, title: 'Zero to One', author: 'by Peter Thiel', genre: 'Business', rating: 5, reviews: 444, likes: 720, excerpt: 'Notes on startups, or how to build the future. A must-read for every entrepreneur.', img: '/images/books/book10.jpg', imgFallbackColor: '#1d4ed8', likedBy: 'Adam and Kimberly like this', likedByImg: ['/images/avatars/av4.jpg', '/images/avatars/av5.jpg'] },
  { id: 11, title: 'A Brief History of Time', author: 'by Stephen Hawking', genre: 'Science', rating: 5, reviews: 820, likes: 1200, excerpt: 'From the Big Bang to black holes, a landmark book by the world\'s most famous scientist.', img: '/images/books/book11.jpg', imgFallbackColor: '#1e3a8a', likedBy: 'Kimberly Jones and others like this', likedByImg: ['/images/avatars/av3.jpg'] },
  { id: 12, title: 'Sapiens', author: 'by Yuval Noah Harari', genre: 'Science', rating: 5, reviews: 950, likes: 1450, excerpt: 'A brief history of humankind — from the Stone Age to the twenty-first century.', img: '/images/books/book12.jpg', imgFallbackColor: '#0369a1', likedBy: 'Samantha William and 2 others like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 13, title: 'Meditations', author: 'by Marcus Aurelius', genre: 'Philosophy', rating: 5, reviews: 640, likes: 980, excerpt: 'Personal writings of Roman Emperor Marcus Aurelius — a timeless guide to Stoic wisdom.', img: '/images/books/book13.jpg', imgFallbackColor: '#5b21b6', likedBy: 'Adam and Kimberly like this', likedByImg: ['/images/avatars/av4.jpg', '/images/avatars/av5.jpg'] },
  { id: 14, title: 'The Republic', author: 'by Plato', genre: 'Philosophy', rating: 4, reviews: 310, likes: 540, excerpt: 'One of the most influential works in Western philosophy — exploring justice, beauty and equality.', img: '/images/books/book14.jpg', imgFallbackColor: '#4c1d95', likedBy: 'Kimberly Jones like this', likedByImg: ['/images/avatars/av3.jpg'] },
  { id: 15, title: 'Steve Jobs', author: 'by Walter Isaacson', genre: 'Biography', rating: 5, reviews: 730, likes: 1100, excerpt: 'The exclusive biography of Apple\'s visionary co-founder, based on more than forty interviews.', img: '/images/books/book15.jpg', imgFallbackColor: '#be185d', likedBy: 'Samantha William and 2 others like this', likedByImg: ['/images/avatars/av1.jpg', '/images/avatars/av2.jpg'] },
  { id: 16, title: 'Educated', author: 'by Tara Westover', genre: 'Biography', rating: 5, reviews: 610, likes: 870, excerpt: 'A memoir about a young woman who grows up in a strict survivalist family and goes on to earn a PhD from Cambridge.', img: '/images/books/book16.jpg', imgFallbackColor: '#9d174d', likedBy: 'Adam and Kimberly like this', likedByImg: ['/images/avatars/av4.jpg', '/images/avatars/av5.jpg'] },
];

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
type Book = typeof BOOKS[0];

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

function AvatarImg({ src, initials, size = 24, color = '#6b7280' }: { src: string; initials: string; size?: number; color?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, background: err ? color : undefined, fontSize: size * 0.38 }}
    >
      {!err
        ? <img src={src} alt={initials} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span>{initials[0]}</span>}
    </div>
  );
}

function BookCoverImg({ src, color, title }: { src: string; color: string; title: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="w-full h-full rounded overflow-hidden" style={{ background: err ? color : undefined }}>
      {!err
        ? <img src={src} alt={title} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : (
          <div className="w-full h-full flex items-center justify-center p-2" style={{ background: color }}>
            <span className="text-white text-[10px] font-bold text-center leading-tight">{title}</span>
          </div>
        )}
    </div>
  );
}

/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
function Sidebar({ onGenreClick }: { onGenreClick: (g: string) => void }) {
  return (
    <aside className="hidden md:flex flex-col gap-8" style={{ width: 180, minWidth: 180 }}>
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Author of the week</h3>
        <ul className="space-y-2.5">
          {AUTHORS_OF_WEEK.map((a, i) => (
            <li key={i} className="flex items-center gap-2.5 group cursor-pointer">
              <AvatarImg src={a.img} initials={a.initials} size={30} color={a.color} />
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
              <div className="flex-shrink-0 rounded-md shadow-sm overflow-hidden w-12 aspect-[2/3]">
                <BookCoverImg src={b.img} color={['#7c3aed', '#0d9488', '#b45309', '#be185d'][i % 4]} title={b.title} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-gray-800 group-hover:text-blue-600 transition leading-tight line-clamp-2">{b.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{b.author}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Genre quick links */}
      <div className="h-px bg-gray-100" />
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Browse Genres</h3>
        <ul className="space-y-1.5">
          {GENRES.filter(g => g !== 'All Genres').map(g => {
            const meta = GENRE_META[g];
            return (
              <li key={g}>
                <button
                  onClick={() => onGenreClick(g)}
                  className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-blue-600 transition font-medium py-1 px-2 rounded-lg hover:bg-blue-50 group"
                >
                  <span>{g}</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: meta.accent, color: meta.color }}
                  >
                    {BOOKS.filter(b => b.genre === g).length}
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

/* ══════════════════════════════════════
   BOOK CARD — horizontal
══════════════════════════════════════ */
function BookCard({ book }: { book: Book }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 group">
      <Link href={`/book`} className="flex-shrink-0 rounded-lg shadow-md overflow-hidden w-24 sm:w-28 aspect-[2/3] block">
        <BookCoverImg src={book.img} color={book.imgFallbackColor} title={book.title} />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/book`} className="block">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight mb-0.5 cursor-pointer line-clamp-1">{book.title}</h4>
        </Link>
        <p className="text-xs text-gray-400 mb-2">{book.author}</p>
        <div className="flex items-center gap-2 mb-2">
          <Stars count={book.rating} />
          <span className="text-[11px] text-gray-400">{book.reviews} ({book.reviews})</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">{book.excerpt}</p>
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {book.likedByImg.slice(0, 2).map((src, i) => (
              <div key={i} className="rounded-full border-2 border-white overflow-hidden" style={{ width: 20, height: 20 }}>
                <AvatarImg src={src} initials="U" size={20} color={['#0d9488', '#2563eb', '#7c3aed'][i]} />
              </div>
            ))}
          </div>
          <button onClick={() => setLiked(l => !l)} className={`flex items-center gap-0.5 transition ${liked ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
          <span className="text-[10px] text-gray-400 leading-tight">{book.likedBy}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   BOOK CARD — grid/detail (used in category detail page)
══════════════════════════════════════ */
function BookCardGrid({ book }: { book: Book }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <Link href={`/book`} className="relative overflow-hidden w-full aspect-[2/3] block">
        <BookCoverImg src={book.img} color={book.imgFallbackColor} title={book.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      <div className="p-3 flex-1 flex flex-col">
        <Link href={`/book`} className="block group-hover:text-blue-600 transition">
          <h4 className="text-xs font-bold text-gray-900 transition leading-tight mb-0.5 line-clamp-1 group-hover:text-blue-600">{book.title}</h4>
        </Link>
        <p className="text-[10px] text-gray-400 mb-1.5">{book.author}</p>
        <div className="flex items-center gap-1.5 mb-2">
          <Stars count={book.rating} />
          <span className="text-[10px] text-gray-400">({book.reviews})</span>
        </div>
        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mb-2">{book.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {book.likedByImg.slice(0, 2).map((src, i) => (
                <div key={i} className="rounded-full border border-white overflow-hidden" style={{ width: 16, height: 16 }}>
                  <AvatarImg src={src} initials="U" size={16} color={['#0d9488', '#2563eb'][i]} />
                </div>
              ))}
            </div>
            <span className="text-[9px] text-gray-400">{book.likes} likes</span>
          </div>
          <button
            onClick={() => setLiked(l => !l)}
            className={`transition ${liked ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CATEGORY DETAIL PAGE
══════════════════════════════════════ */
const DETAIL_PAGE_SIZE = 6;

function CategoryDetailPage({
  genre,
  onBack,
  onGenreSwitch,
}: {
  genre: string;
  onBack: () => void;
  onGenreSwitch: (g: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(DETAIL_PAGE_SIZE);
  const [sort, setSort] = useState<'popular' | 'rating' | 'reviews'>('popular');

  const meta = GENRE_META[genre] ?? GENRE_META['All Genres'];
  const allBooks = genre === 'All Genres' ? BOOKS : BOOKS.filter(b => b.genre === genre);

  const sorted = [...allBooks].sort((a, b) => {
    if (sort === 'popular') return b.likes - a.likes;
    if (sort === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const shown = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div>
      {/* ── Hero banner ── */}
      <div
        className="rounded-2xl px-6 py-6 md:px-8 md:py-8 mb-7 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}cc 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10 bg-white" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold mb-4 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all books
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between relative z-10 gap-4 sm:gap-2">
          <div>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2"
              style={{ background: meta.accent, color: meta.color }}
            >
              {allBooks.length} Books
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{genre}</h2>
            <p className="text-white/70 text-sm mt-1 max-w-sm">{meta.description}</p>
          </div>

          {/* Other genre quick links */}
          <div className="flex gap-2 flex-wrap sm:justify-end sm:max-w-xs">
            {GENRES.filter(g => g !== 'All Genres' && g !== genre).map(g => (
              <button
                key={g}
                onClick={() => onGenreSwitch(g)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sort bar ── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="text-gray-800 font-bold">{shown.length}</span> of <span className="text-gray-800 font-bold">{allBooks.length}</span> books
        </p>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-full">
          {(['popular', 'rating', 'reviews'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all capitalize ${sort === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Book grid ── */}
      {shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm font-medium">No books in this genre yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {shown.map(book => <BookCardGrid key={book.id} book={book} />)}
        </div>
      )}

      {/* ── Fixed-position View More ── */}
      {hasMore && (
        <div className="sticky bottom-6 flex justify-center mt-6 pointer-events-none">
          <button
            onClick={() => setVisibleCount(c => c + DETAIL_PAGE_SIZE)}
            className="pointer-events-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm px-8 py-3 rounded-full shadow-xl shadow-blue-300/40 transition-all duration-200"
            style={{ animation: 'viewMorePulse 2.5s ease-in-out infinite' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
            </svg>
            View More {genre === 'All Genres' ? 'Books' : genre + ' Books'}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              +{Math.min(DETAIL_PAGE_SIZE, sorted.length - visibleCount)} more
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN VIEW — genre cards grid
══════════════════════════════════════ */
const PREVIEW_SIZE = 4;

function GenrePreviewSection({
  genre,
  onViewMore,
}: {
  genre: string;
  onViewMore: (g: string) => void;
}) {
  const meta = GENRE_META[genre];
  const books = BOOKS.filter(b => b.genre === genre).slice(0, PREVIEW_SIZE);
  const total = BOOKS.filter(b => b.genre === genre).length;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
        style={{ background: meta.accent }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: meta.color }} />
          <h3 className="text-sm font-extrabold" style={{ color: meta.color }}>{genre}</h3>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: meta.color }}
          >
            {total} books
          </span>
        </div>

        {/* ── Fixed "View More" button always visible ── */}
        <button
          onClick={() => onViewMore(genre)}
          className="flex items-center gap-1.5 text-white font-bold text-xs px-4 py-2 rounded-full shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
          style={{ background: meta.color, boxShadow: `0 4px 12px ${meta.color}55` }}
        >
          View More
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Preview cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {books.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function Books() {
  const [activeGenre, setActiveGenre] = useState('All Genres');
  const [detailGenre, setDetailGenre] = useState<string | null>(null);
  const [allGenreVisible, setAllGenreVisible] = useState(PREVIEW_SIZE);

  // navigate to detail view
  const goToDetail = (g: string) => {
    setDetailGenre(g);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // back to list
  const goBack = () => setDetailGenre(null);

  /* ── filtered list for "All Genres" tab ── */
  const filteredAll = BOOKS.filter(b =>
    activeGenre === 'All Genres' ? true : b.genre === activeGenre
  );
  const shownAll = filteredAll.slice(0, allGenreVisible);
  const hasMoreAll = allGenreVisible < filteredAll.length;

  return (
    <>
      <style>{`
        @keyframes viewMorePulse {
          0%,100% { box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
          50%      { box-shadow: 0 8px 36px rgba(37,99,235,0.60); }
        }
      `}</style>

      <section className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Sidebar ── */}
          <Sidebar onGenreClick={goToDetail} />

          {/* ── Divider ── */}
          <div className="hidden md:block w-px bg-gray-100 flex-shrink-0" />

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* ════ DETAIL PAGE ════ */}
            {detailGenre ? (
              <CategoryDetailPage
                genre={detailGenre}
                onBack={goBack}
                onGenreSwitch={g => { setDetailGenre(g); }}
              />
            ) : (
              <>
                {/* Genre tab bar */}
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => { setActiveGenre(g); setAllGenreVisible(PREVIEW_SIZE); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeGenre === g
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="h-0.5 bg-gray-100 rounded-full mb-4" />

                {/* ── "All Genres" shows per-genre sections with fixed View More buttons ── */}
                {activeGenre === 'All Genres' ? (
                  <div>
                    {GENRES.filter(g => g !== 'All Genres').map(g => (
                      BOOKS.some(b => b.genre === g) && (
                        <GenrePreviewSection key={g} genre={g} onViewMore={goToDetail} />
                      )
                    ))}
                  </div>
                ) : (
                  /* ── Single genre filtered list ── */
                  <div>
                    {/* Genre banner */}
                    <div
                      className="rounded-xl px-5 py-4 mb-4 flex items-center justify-between"
                      style={{ background: GENRE_META[activeGenre]?.accent }}
                    >
                      <div>
                        <h3 className="text-base font-extrabold" style={{ color: GENRE_META[activeGenre]?.color }}>{activeGenre}</h3>
                        <p className="text-xs mt-0.5" style={{ color: GENRE_META[activeGenre]?.color, opacity: 0.75 }}>
                          {GENRE_META[activeGenre]?.description}
                        </p>
                      </div>
                      {/* ── Fixed View More button always visible ── */}
                      <button
                        onClick={() => goToDetail(activeGenre)}
                        className="flex items-center gap-1.5 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.97] flex-shrink-0"
                        style={{
                          background: GENRE_META[activeGenre]?.color,
                          boxShadow: `0 4px 14px ${GENRE_META[activeGenre]?.color}55`,
                        }}
                      >
                        View More
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {shownAll.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-sm font-medium">No books in this genre yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-6">
                        {shownAll.map(book => <BookCard key={book.id} book={book} />)}
                      </div>
                    )}

                    {hasMoreAll && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setAllGenreVisible(c => c + PREVIEW_SIZE)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm px-8 py-2.5 rounded-full shadow-md shadow-blue-200 transition-all duration-200"
                        >
                          Load More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}