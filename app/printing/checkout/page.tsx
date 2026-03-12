"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { checkoutPrinting } from "@/lib/api/printing";
import { PrintingCheckoutResponse } from "@/lib/types/printing";
import { printingCheckoutSchema } from "@/lib/validations/printing";
import { usePrintingCart } from "@/hooks/printing/use-printing-cart";

type CheckoutFormState = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  district: string;
  postal_code: string;
  notes: string;
  payment_method: string;
};

function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatCurrency(amount: number, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const INITIAL_FORM: CheckoutFormState = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  shipping_address: "",
  city: "Dhaka",
  district: "Dhaka",
  postal_code: "",
  notes: "",
  payment_method: "cod",
};

export default function PrintingCheckoutPage() {
  const { cart, isCartLoading, cartError, reloadCart } = usePrintingCart();
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [order, setOrder] = useState<PrintingCheckoutResponse | null>(null);

  const hasItems = cart.items.length > 0;
  const cartTotal = useMemo(() => toNumber(cart.total_amount), [cart.total_amount]);

  function updateField<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const parsed = printingCheckoutSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await checkoutPrinting({
        ...parsed.data,
        customer_email: parsed.data.customer_email || undefined,
        notes: parsed.data.notes?.trim() || undefined,
      });
      setOrder(response);
      await reloadCart();
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to place printing order"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 md:px-8 lg:py-10">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:rounded-3xl sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Order Confirmed</p>
            <h1 className="mt-2 text-xl font-bold text-emerald-900 sm:text-2xl">Printing Order Submitted</h1>
            <p className="mt-2 text-sm text-emerald-800">
              Order ID: <span className="font-semibold">{order.order_id}</span>
            </p>
            <p className="text-sm text-emerald-800">Status: {order.status}</p>
            <p className="text-sm text-emerald-800">Submitted: {new Date(order.submitted_at).toLocaleString()}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
            <div className="mt-4 space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-3 sm:p-4">
                  <p className="break-words text-sm font-semibold text-slate-900">
                    {item.item_icon} {item.item_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.category_label}</p>
                  <p className="mt-1 text-sm text-slate-700">Qty: {item.quantity}</p>
                  <p className="break-words text-sm text-slate-700">
                    Line total: {formatCurrency(toNumber(item.line_total))}
                  </p>
                  {(item.primary_file_url || item.secondary_file_url) && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      {item.primary_file_url && (
                        <a
                          href={item.primary_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-brand-700 underline"
                        >
                          Primary file
                        </a>
                      )}
                      {item.secondary_file_url && (
                        <a
                          href={item.secondary_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-brand-700 underline"
                        >
                          Secondary file
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-700">
                Total paid on {order.payment_method.toUpperCase()}:{" "}
                <span className="font-semibold">{formatCurrency(toNumber(order.total_amount))}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/printing" className="w-full rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto">
                Back to Printing
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 md:px-8 lg:py-10">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-6">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Printing Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Provide delivery details to submit your printing order.</p>
        </div>

        <div className="mt-6 grid items-start gap-4 sm:gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
            {!hasItems && !isCartLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-6">
                <p className="text-sm text-slate-600">Your printing cart is empty.</p>
                <Link href="/printing" className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">
                  Go to Printing Page
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-700">
                    Customer Name
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(event) => updateField("customer_name", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.customer_name && <p className="mt-1 text-xs text-rose-600">{errors.customer_name}</p>}
                  </label>

                  <label className="text-sm text-slate-700">
                    Phone
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={(event) => updateField("customer_phone", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.customer_phone && <p className="mt-1 text-xs text-rose-600">{errors.customer_phone}</p>}
                  </label>

                  <label className="text-sm text-slate-700 sm:col-span-2">
                    Email (optional)
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={(event) => updateField("customer_email", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.customer_email && <p className="mt-1 text-xs text-rose-600">{errors.customer_email}</p>}
                  </label>

                  <label className="text-sm text-slate-700 sm:col-span-2">
                    Shipping Address
                    <input
                      type="text"
                      value={form.shipping_address}
                      onChange={(event) => updateField("shipping_address", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.shipping_address && (
                      <p className="mt-1 text-xs text-rose-600">{errors.shipping_address}</p>
                    )}
                  </label>

                  <label className="text-sm text-slate-700">
                    City
                    <input
                      type="text"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
                  </label>

                  <label className="text-sm text-slate-700">
                    District
                    <input
                      type="text"
                      value={form.district}
                      onChange={(event) => updateField("district", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.district && <p className="mt-1 text-xs text-rose-600">{errors.district}</p>}
                  </label>

                  <label className="text-sm text-slate-700">
                    Postal Code
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={(event) => updateField("postal_code", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    {errors.postal_code && <p className="mt-1 text-xs text-rose-600">{errors.postal_code}</p>}
                  </label>

                  <label className="text-sm text-slate-700">
                    Payment Method
                    <select
                      value={form.payment_method}
                      onChange={(event) => updateField("payment_method", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option value="cod">Cash on Delivery</option>
                    </select>
                    {errors.payment_method && (
                      <p className="mt-1 text-xs text-rose-600">{errors.payment_method}</p>
                    )}
                  </label>
                </div>

                <label className="block text-sm text-slate-700">
                  Notes (optional)
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </label>

                {submitError && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={!hasItems || isSubmitting}
                    className="w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Place Printing Order"}
                  </button>
                  <Link href="/printing" className="w-full rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto">
                    Back
                  </Link>
                </div>
              </form>
            )}
          </section>

          <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Order Preview</h2>
            {isCartLoading ? (
              <p className="mt-3 text-sm text-slate-500">Loading cart...</p>
            ) : (
              <>
                <div className="mt-4 space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {item.item_icon} {item.item_name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity} | {item.category_label}
                      </p>
                      <p className="mt-1 text-xs text-slate-700">
                        {formatCurrency(toNumber(item.line_total), cart.currency)}
                      </p>
                      {(item.primary_file_url || item.secondary_file_url) && (
                        <div className="mt-2 flex flex-wrap gap-3 text-xs">
                          {item.primary_file_url && (
                            <a
                              href={item.primary_file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-brand-700 underline"
                            >
                              Primary file
                            </a>
                          )}
                          {item.secondary_file_url && (
                            <a
                              href={item.secondary_file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-brand-700 underline"
                            >
                              Secondary file
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  <p>Subtotal: {formatCurrency(toNumber(cart.subtotal), cart.currency)}</p>
                  <p>Delivery: {formatCurrency(toNumber(cart.delivery_charge), cart.currency)}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    Total: {formatCurrency(cartTotal, cart.currency)}
                  </p>
                </div>
              </>
            )}
            {cartError && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {cartError}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
