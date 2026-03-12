"use client";

import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { CategorySelector } from "@/components/printing/category-selector";
import { ItemSelector } from "@/components/printing/item-selector";
import { getPrintingCategories, getPrintingCategoryItems, getPrintingEstimate } from "@/lib/api/printing";
import { AddPrintingCartItemPayload, PrintingCartItem, PrintingCategory, PrintingEstimateResponse, PrintingItem } from "@/lib/types/printing";
import { usePrintingCart } from "@/hooks/printing/use-printing-cart";

type CartDraft = {
  quantity: string;
  is_emergency: boolean;
  budget: string;
  required_by: string;
  notes: string;
};

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

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

export default function PrintingPage() {
  const [categories, setCategories] = useState<PrintingCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [items, setItems] = useState<PrintingItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const [quantity, setQuantity] = useState("100");
  const [isEmergency, setIsEmergency] = useState(false);
  const [budget, setBudget] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [notes, setNotes] = useState("");
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [estimate, setEstimate] = useState<PrintingEstimateResponse | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const {
    cart,
    isCartLoading,
    isMutating,
    cartError,
    addItems,
    updateItem,
    removeItem,
    clearCart,
  } = usePrintingCart();

  const [cartDrafts, setCartDrafts] = useState<Record<number, CartDraft>>({});
  const [processingItemId, setProcessingItemId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoryError(null);
      try {
        const response = await getPrintingCategories();
        if (!isActive) return;
        setCategories(response);
        setSelectedCategoryId((previous) => previous || response[0]?.id || "");
      } catch (error) {
        if (!isActive) return;
        setCategoryError(getErrorMessage(error, "Failed to load categories"));
      } finally {
        if (isActive) setCategoriesLoading(false);
      }
    }

    void loadCategories();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([]);
      setSelectedItemIds([]);
      return;
    }

    const fallbackItems = categories.find((entry) => entry.id === selectedCategoryId)?.items ?? [];
    let isActive = true;

    async function loadItems() {
      setItemsLoading(true);
      setItemError(null);
      try {
        const response = await getPrintingCategoryItems(selectedCategoryId);
        if (!isActive) return;
        setItems(response);
      } catch (error) {
        if (!isActive) return;
        setItems(fallbackItems);
        setItemError(getErrorMessage(error, "Failed to load items for this category"));
      } finally {
        if (isActive) setItemsLoading(false);
      }
    }

    void loadItems();
    return () => {
      isActive = false;
    };
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    setSelectedItemIds((previous) =>
      previous.filter((itemId) => items.some((item) => item.id === itemId))
    );
  }, [items]);

  useEffect(() => {
    setCartDrafts((previous) => {
      const next: Record<number, CartDraft> = {};
      cart.items.forEach((item) => {
        next[item.id] = previous[item.id] ?? {
          quantity: String(item.quantity),
          is_emergency: item.is_emergency,
          budget: item.budget ?? "",
          required_by: item.required_by ?? "",
          notes: item.notes ?? "",
        };
      });
      return next;
    });
  }, [cart.items]);

  const hasCartItems = cart.items.length > 0;
  const selectedCategory = useMemo(
    () => categories.find((entry) => entry.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  function toggleSelectedItem(itemId: string) {
    setSelectedItemIds((previous) =>
      previous.includes(itemId)
        ? previous.filter((value) => value !== itemId)
        : [...previous, itemId]
    );
  }

  function createPayload(): AddPrintingCartItemPayload | null {
    setActionError(null);
    setActionSuccess(null);

    if (!selectedCategoryId) {
      setActionError("Please select a category.");
      return null;
    }

    if (selectedItemIds.length === 0) {
      setActionError("Please select at least one item.");
      return null;
    }

    const parsedQuantity = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      setActionError("Quantity must be at least 1.");
      return null;
    }

    let parsedBudget: number | null = null;
    if (budget.trim()) {
      const value = Number.parseFloat(budget);
      if (!Number.isFinite(value) || value <= 0) {
        setActionError("Budget must be a positive number.");
        return null;
      }
      parsedBudget = value;
    }

    return {
      category: selectedCategoryId,
      item_ids: selectedItemIds,
      quantity: parsedQuantity,
      is_emergency: isEmergency,
      budget: parsedBudget,
      required_by: requiredBy || null,
      notes: notes.trim(),
      primary_file: primaryFile,
      secondary_file: secondaryFile,
    };
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    type: "primary" | "secondary"
  ) {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > MAX_UPLOAD_SIZE_BYTES) {
      setActionError("File size must be 10MB or less.");
      if (type === "primary") setPrimaryFile(null);
      if (type === "secondary") setSecondaryFile(null);
      return;
    }

    setActionError(null);
    if (type === "primary") setPrimaryFile(file);
    if (type === "secondary") setSecondaryFile(file);
  }

  async function handleEstimate() {
    const payload = createPayload();
    if (!payload) return;

    setEstimateError(null);
    setIsEstimating(true);
    try {
      const response = await getPrintingEstimate({
        category: payload.category,
        item_ids: payload.item_ids,
        quantity: payload.quantity,
        is_emergency: payload.is_emergency,
      });
      setEstimate(response);
    } catch (error) {
      setEstimate(null);
      setEstimateError(getErrorMessage(error, "Failed to fetch estimate"));
    } finally {
      setIsEstimating(false);
    }
  }

  async function handleAddToCart() {
    const payload = createPayload();
    if (!payload) return;

    try {
      await addItems(payload);
      setActionSuccess("Added to cart successfully.");
      setPrimaryFile(null);
      setSecondaryFile(null);
      setFileInputKey((previous) => previous + 1);
    } catch (error) {
      setActionError(getErrorMessage(error, "Failed to add item to cart"));
    }
  }

  async function handleSaveCartItem(item: PrintingCartItem) {
    const draft = cartDrafts[item.id];
    if (!draft) return;

    const parsedQuantity = Number.parseInt(draft.quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      setActionError("Cart quantity must be at least 1.");
      return;
    }

    let parsedBudget: number | null = null;
    if (draft.budget.trim()) {
      const value = Number.parseFloat(draft.budget);
      if (!Number.isFinite(value) || value <= 0) {
        setActionError("Cart budget must be a positive number.");
        return;
      }
      parsedBudget = value;
    }

    setActionError(null);
    setActionSuccess(null);
    setProcessingItemId(item.id);
    try {
      await updateItem(item.id, {
        quantity: parsedQuantity,
        is_emergency: draft.is_emergency,
        budget: parsedBudget,
        required_by: draft.required_by || null,
        notes: draft.notes.trim(),
      });
      setActionSuccess("Cart item updated.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Failed to update cart item"));
    } finally {
      setProcessingItemId(null);
    }
  }

  async function handleRemoveCartItem(itemId: number) {
    setActionError(null);
    setActionSuccess(null);
    setProcessingItemId(itemId);
    try {
      await removeItem(itemId);
      setActionSuccess("Item removed from cart.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Failed to remove cart item"));
    } finally {
      setProcessingItemId(null);
    }
  }

  async function handleClearCart() {
    setActionError(null);
    setActionSuccess(null);
    try {
      await clearCart();
      setActionSuccess("Cart cleared.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Failed to clear cart"));
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 md:px-8 lg:py-10">
        <div className="rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">BookBuyBD Printing</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Custom Printing Services</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100">
            Select printing categories and items, get instant estimate, and place your order with delivery details.
          </p>
        </div>

        <div className="mt-6 grid items-start gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="min-w-0 space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">1) Choose Category</h2>
              <p className="mt-1 text-sm text-slate-500">Pick the project type first.</p>
              {categoryError && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {categoryError}
                </p>
              )}
              <div className="mt-4">
                <CategorySelector
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  onSelect={setSelectedCategoryId}
                  isLoading={categoriesLoading}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">2) Select Items</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedCategory
                  ? `Selected category: ${selectedCategory.label}`
                  : "Select a category to see available items."}
              </p>
              {itemError && (
                <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  {itemError}
                </p>
              )}
              <div className="mt-4">
                <ItemSelector
                  items={items}
                  selectedItemIds={selectedItemIds}
                  onToggle={toggleSelectedItem}
                  isLoading={itemsLoading}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">3) Order Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  />
                </label>

                <label className="block text-sm text-slate-700">
                  Budget (optional)
                  <input
                    type="number"
                    min={1}
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="e.g. 3000"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  />
                </label>

                <label className="block text-sm text-slate-700">
                  Required By (optional)
                  <input
                    type="date"
                    value={requiredBy}
                    onChange={(event) => setRequiredBy(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(event) => setIsEmergency(event.target.checked)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  Emergency order
                </label>
              </div>

              <label className="mt-4 block text-sm text-slate-700">
                Notes (optional)
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="Special print instructions..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
                />
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  Primary Photo/File (optional)
                  <input
                    key={`primary-file-${fileInputKey}`}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => handleFileChange(event, "primary")}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold hover:file:bg-slate-200 focus:ring-2"
                  />
                  {primaryFile && (
                    <p className="mt-1 break-all text-xs text-slate-500">{primaryFile.name}</p>
                  )}
                </label>

                <label className="block text-sm text-slate-700">
                  Secondary Photo/File (optional)
                  <input
                    key={`secondary-file-${fileInputKey}`}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => handleFileChange(event, "secondary")}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold hover:file:bg-slate-200 focus:ring-2"
                  />
                  {secondaryFile && (
                    <p className="mt-1 break-all text-xs text-slate-500">{secondaryFile.name}</p>
                  )}
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleEstimate}
                  disabled={isEstimating || isMutating}
                  className="w-full rounded-xl border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isEstimating ? "Estimating..." : "Get Estimate"}
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isMutating}
                  className="w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isMutating ? "Saving..." : "Add to Cart"}
                </button>
              </div>

              {estimateError && (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {estimateError}
                </p>
              )}

              {estimate && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">
                    Estimated total: {formatCurrency(estimate.estimatedTotal, estimate.currency)}
                  </p>
                  <p className="mt-1">
                    Lead time: {estimate.minimumLeadDays}-{estimate.maximumLeadDays} days
                  </p>
                </div>
              )}

              {actionError && (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {actionError}
                </p>
              )}
              {actionSuccess && (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {actionSuccess}
                </p>
              )}
            </div>
          </section>

          <aside className="min-w-0 space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Cart Summary</h2>
              {isCartLoading ? (
                <p className="mt-3 text-sm text-slate-500">Loading cart...</p>
              ) : (
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>Total items: {cart.total_items}</p>
                  <p>Total quantity: {cart.total_quantity}</p>
                  <p>Subtotal: {formatCurrency(toNumber(cart.subtotal), cart.currency)}</p>
                  <p>Delivery: {formatCurrency(toNumber(cart.delivery_charge), cart.currency)}</p>
                  <p className="text-base font-semibold text-slate-900">
                    Total: {formatCurrency(toNumber(cart.total_amount), cart.currency)}
                  </p>
                </div>
              )}
              {cartError && (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {cartError}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/printing/checkout"
                  className={`w-full rounded-xl px-4 py-2 text-sm font-semibold sm:w-auto ${
                    hasCartItems
                      ? "bg-brand-600 text-center text-white hover:bg-brand-800"
                      : "pointer-events-none bg-slate-200 text-slate-500"
                  }`}
                >
                  Proceed to Checkout
                </Link>
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={!hasCartItems || isMutating}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Cart Items</h3>

              {!hasCartItems && !isCartLoading && (
                <p className="mt-3 text-sm text-slate-500">No printing items in cart yet.</p>
              )}

              <div className="mt-4 space-y-4">
                {cart.items.map((item) => {
                  const draft = cartDrafts[item.id] ?? {
                    quantity: String(item.quantity),
                    is_emergency: item.is_emergency,
                    budget: item.budget ?? "",
                    required_by: item.required_by ?? "",
                    notes: item.notes ?? "",
                  };

                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-3 sm:p-4">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {item.item_icon} {item.item_name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.category_label}</p>
                      <p className="mt-1 break-words text-xs text-slate-600">{item.item_description}</p>
                      <p className="mt-2 break-words text-sm font-semibold text-brand-800">
                        Line total: {formatCurrency(toNumber(item.line_total), cart.currency)}
                      </p>

                      {(item.primary_file_url || item.secondary_file_url) && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs sm:gap-3">
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

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label className="text-xs text-slate-700">
                          Quantity
                          <input
                            type="number"
                            min={1}
                            value={draft.quantity}
                            onChange={(event) =>
                              setCartDrafts((previous) => ({
                                ...previous,
                                [item.id]: { ...draft, quantity: event.target.value },
                              }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </label>

                        <label className="text-xs text-slate-700">
                          Budget
                          <input
                            type="number"
                            min={1}
                            value={draft.budget}
                            onChange={(event) =>
                              setCartDrafts((previous) => ({
                                ...previous,
                                [item.id]: { ...draft, budget: event.target.value },
                              }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </label>

                        <label className="text-xs text-slate-700">
                          Required By
                          <input
                            type="date"
                            value={draft.required_by}
                            onChange={(event) =>
                              setCartDrafts((previous) => ({
                                ...previous,
                                [item.id]: { ...draft, required_by: event.target.value },
                              }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </label>

                        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={draft.is_emergency}
                            onChange={(event) =>
                              setCartDrafts((previous) => ({
                                ...previous,
                                [item.id]: { ...draft, is_emergency: event.target.checked },
                              }))
                            }
                            className="h-4 w-4 accent-brand-600"
                          />
                          Emergency
                        </label>
                      </div>

                      <label className="mt-3 block text-xs text-slate-700">
                        Notes
                        <textarea
                          value={draft.notes}
                          onChange={(event) =>
                            setCartDrafts((previous) => ({
                              ...previous,
                              [item.id]: { ...draft, notes: event.target.value },
                            }))
                          }
                          rows={2}
                          className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </label>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            void handleSaveCartItem(item);
                          }}
                          disabled={processingItemId === item.id || isMutating}
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {processingItemId === item.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleRemoveCartItem(item.id);
                          }}
                          disabled={processingItemId === item.id || isMutating}
                          className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
