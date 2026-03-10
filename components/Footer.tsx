'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Send,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#3A9AFF] to-[#2d7acc] text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <Link href="/">
                <div className="bg-white inline-block rounded-lg p-2 mb-2">
                  <img src="/logo.png" alt="BookBuyBD Logo" className="h-8 w-auto object-contain" />
                </div>
              </Link>
              <p className="text-xs text-white/80 mt-1">Nilkhet, Dhaka</p>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Your trusted bookstore in the heart of Nilkhet, offering a vast
              collection of books and custom printing services.
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
                <a
                  href="#about"
                  className="hover:text-white/80 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#printing"
                  className="hover:text-white/80 transition-colors"
                >
                  Custom Printing
                </a>
              </li>
              <li>
                <Link href="/book" className="hover:text-white/80 transition-colors">Book Details</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white/80 transition-colors">Cart</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white/80 transition-colors">Checkout Flow</Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white/80 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white/80 transition-colors">
                  Admin Panel
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
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <a
                    href={`#category-${category.id}`}
                    className="hover:text-white/80 transition-colors"
                  >
                    {category.name} ({category.count})
                  </a>
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
            <div className="flex gap-2 mb-6">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/50 min-w-0"
              />
              <Button
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+880 1601-007703</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@bookbuybd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Nilkhet, Dhaka-1205</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          <p>
            &copy; {new Date().getFullYear()} BookBuyBD. All rights reserved. |
            Developed by Delta-Cortex.
          </p>
        </div>
      </div>
    </footer>
  );
}
