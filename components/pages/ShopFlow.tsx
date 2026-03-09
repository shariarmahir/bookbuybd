'use client';
import { useState } from 'react';
import Link from 'next/link';
import Cart from './cart';
import Checkout from './checkout';
import EditCheckout from './editcheckout';
import ConfirmOrder from './confirmorder';
import { CartItem, CheckoutForm, EMPTY_FORM } from './cartStore';

type Page = 'cart' | 'checkout' | 'editcheckout' | 'confirm';

export default function ShopFlow() {
  const [page, setPage] = useState<Page>('cart');
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);

  return (
    <>
      {/* ── Page router ── */}
      {page === 'cart' && (
        <Cart
          onCheckout={(cartItems) => {
            setItems(cartItems);
            setPage('checkout');
          }}
        />
      )}

      {page === 'checkout' && (
        <Checkout
          items={items}
          onBack={() => setPage('cart')}
          onConfirm={(f) => {
            setForm(f);
            setPage('confirm');
          }}
          onEdit={(f) => {
            setForm(f);
            setPage('editcheckout');
          }}
        />
      )}

      {page === 'editcheckout' && (
        <EditCheckout
          initial={form}
          onSave={(f) => {
            setForm(f);
            setPage('checkout');
          }}
          onBack={() => setPage('checkout')}
        />
      )}

      {page === 'confirm' && (
        <ConfirmOrder
          items={items}
          form={form}
          onContinueShopping={() => {
            setPage('cart');
            setItems([]);
            setForm({ fullName: '', phone: '', email: '', address: '', city: '', district: '', postalCode: '', note: '', paymentMethod: 'cod' });
          }}
        />
      )}
    </>
  );
}
