'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { booksService } from '@/lib/api';

interface FooterCategory {
  id: string;
  name: string;
  slug: string;
  count: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }
  return null;
}

function parseTotalFromPayload(payload: unknown): number | null {
  if (Array.isArray(payload)) {
    return payload.length;
  }

  if (!isRecord(payload)) {
    return null;
  }

  const explicitCount = parseCount(
    payload.count
    ?? payload.total
    ?? payload.total_books
    ?? payload.items_count
    ?? payload.item_count,
  );
  if (typeof explicitCount === 'number') {
    return explicitCount;
  }

  if (Array.isArray(payload.results)) {
    return payload.results.length;
  }
  if (Array.isArray(payload.items)) {
    return payload.items.length;
  }
  if (Array.isArray(payload.data)) {
    return payload.data.length;
  }

  return null;
}

async function resolveCategoryCount(slug: string): Promise<number> {
  if (!slug) return 0;
  try {
    const payload = await booksService.getCatalog({ category: slug });
    const total = parseTotalFromPayload(payload);
    return typeof total === 'number' ? total : 0;
  } catch {
    return 0;
  }
}

function extractFooterCategories(payload: unknown): FooterCategory[] {
  let list: unknown[] = [];

  if (Array.isArray(payload)) {
    list = payload;
  } else if (isRecord(payload)) {
    if (Array.isArray(payload.results)) {
      list = payload.results;
    } else if (Array.isArray(payload.items)) {
      list = payload.items;
    } else if (Array.isArray(payload.data)) {
      list = payload.data;
    }
  }

  const mapped = list
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = entry.trim();
        if (!name) return null;
        const slug = slugifyCategory(name);
        if (!slug) return null;
        return { id: slug, name, slug, count: null };
      }

      if (!isRecord(entry)) return null;

      const nameCandidate = typeof entry.name === 'string'
        ? entry.name
        : typeof entry.title === 'string'
          ? entry.title
          : typeof entry.category_name === 'string'
            ? entry.category_name
            : '';
      const name = nameCandidate.trim();
      if (!name) return null;

      const rawSlug = typeof entry.slug === 'string' ? entry.slug.trim() : '';
      const slug = rawSlug || slugifyCategory(name);
      if (!slug) return null;

      const idCandidate = entry.id ?? entry.category_id ?? slug;
      const id = typeof idCandidate === 'number' || typeof idCandidate === 'string'
        ? String(idCandidate)
        : slug;

      const count = parseCount(
        entry.count
        ?? entry.book_count
        ?? entry.books_count
        ?? entry.total_books
        ?? entry.total,
      );

      return { id, name, slug, count };
    })
    .filter((category): category is FooterCategory => category !== null);

  const unique = new Map<string, FooterCategory>();
  mapped.forEach((category) => {
    const key = category.slug;
    if (!unique.has(key)) {
      unique.set(key, category);
    }
  });

  return Array.from(unique.values());
}

export default function Footer() {
  const [footerCategories, setFooterCategories] = useState<FooterCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const payload = await booksService.getCategories();
        if (cancelled) return;

        const baseCategories = extractFooterCategories(payload).slice(0, 6);
        const withCounts = await Promise.all(
          baseCategories.map(async (category) => {
            if (typeof category.count === 'number') {
              return category;
            }

            const resolvedCount = await resolveCategoryCount(category.slug);
            return { ...category, count: resolvedCount };
          }),
        );

        if (cancelled) return;
        setFooterCategories(withCounts);
      } catch {
        if (!cancelled) {
          setFooterCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-14 bg-gradient-to-br from-[#3A9AFF] to-[#2d7acc] text-white sm:mt-20">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <Link href="/">
                <div className="bg-white inline-block rounded-lg p-2 mb-2">
                  <Image src="/logo.png" alt="BookBuyBD Logo" width={120} height={32} className="h-8 w-auto object-contain" />
                </div>
              </Link>
              <p className="text-xs text-white/80 mt-1">Nilkhet, Dhaka</p>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Your trusted bookstore in the heart of Nilkhet, offering a vast
              collection of books for every reader.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white/80 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white/80 transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white/80 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white/80 transition-colors">Cart</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white/80 transition-colors">Order Flow</Link>
              </li>
              <li>
                <Link href="/printing" className="hover:text-white/80 transition-colors">
                  Printing Service
                </Link>
              </li>
              <li>
                <Link href="/printing/checkout" className="hover:text-white/80 transition-colors">
                  Printing Checkout
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white/80 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categoriesLoading && (
                <li className="text-white/80">Loading categories...</li>
              )}
              {!categoriesLoading && footerCategories.length === 0 && (
                <li className="text-white/80">No categories available.</li>
              )}
              {!categoriesLoading && footerCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories?genre=${encodeURIComponent(category.slug)}`}
                    className="hover:text-white/80 transition-colors"
                  >
                    {category.name}
                    {typeof category.count === 'number' ? ` (${category.count})` : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-white/90 mb-4">
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/50 min-w-0"
              />
              <Button
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-full sm:w-auto"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="break-all">info@bookbuybd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Nilkhet, Dhaka-1205</span>
              </div>
            </div>
          </motion.div>
        </div >

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          <p>
            &copy; {new Date().getFullYear()} BookBuyBD. All rights reserved. |
            Developed by Delta-Cortex.
          </p>
        </div>
      </div >
    </footer >
  );
}
