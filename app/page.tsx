import HeroCarousel from '@/components/sections/HeroCarousel';
import Categories from '@/components/sections/Categories';
import BooksGrid from '@/components/sections/BooksGrid';
import PrintingHub from '@/components/sections/PrintingHub';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import Books from '@/components/sections/Books';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroCarousel />
      <BooksGrid />
      <Categories />
      <Books />
      <PrintingHub />
      <Testimonials />
      <Contact />
    </main>
  );
}