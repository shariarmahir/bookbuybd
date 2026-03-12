import { Suspense } from 'react';
import HeroCarousel from '@/components/sections/HeroCarousel';
import Categories from '@/components/sections/Categories';
import BooksGrid from '@/components/sections/BooksGrid';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import BooksNoSSR from '@/components/sections/BooksNoSSR';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroCarousel />
      <BooksGrid />
      <Categories />
      <Suspense fallback={<div className="py-8 text-center text-sm text-gray-400">Loading books...</div>}>
        <BooksNoSSR />
      </Suspense>
      <Testimonials />
      <Contact />
    </main>
  );
}
