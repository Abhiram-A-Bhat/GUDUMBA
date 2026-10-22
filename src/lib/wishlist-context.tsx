"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface SavedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price?: number;
  primary_image?: string;
  category_name?: string;
  category_slug?: string;
  subtitle?: string;
  variants?: { id: string; size: string; inventory_count: number }[];
}

interface WishlistContextValue {
  ids: string[];
  recent: SavedProduct[];
  hydrated: boolean;
  hasSaved: (id: string) => boolean;
  toggle: (product: SavedProduct) => void;
  trackViewed: (product: SavedProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const WISHLIST_KEY = "gudumba_wishlist_v1";
const RECENT_KEY = "gudumba_recent_products_v1";

function readProducts(key: string): SavedProduct[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is SavedProduct =>
      !!item && typeof item.id === "string" && typeof item.slug === "string" &&
      typeof item.name === "string" && typeof item.price === "number"
    );
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedProduct[]>([]);
  const [recent, setRecent] = useState<SavedProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const pendingRecent = useRef<SavedProduct[]>([]);

  useEffect(() => {
    setSaved(readProducts(WISHLIST_KEY));
    const storedRecent = readProducts(RECENT_KEY);
    setRecent([...pendingRecent.current, ...storedRecent.filter((item) => !pendingRecent.current.some((pending) => pending.id === item.id))].slice(0, 8));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(saved));
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
      // Storage can be unavailable in private browsing; the in-memory state still works.
    }
  }, [saved, recent, hydrated]);

  const toggle = useCallback((product: SavedProduct) => {
    setSaved((current) => current.some((item) => item.id === product.id)
      ? current.filter((item) => item.id !== product.id)
      : [product, ...current]);
  }, []);

  const remove = useCallback((id: string) => {
    setSaved((current) => current.filter((item) => item.id !== id));
  }, []);

  const trackViewed = useCallback((product: SavedProduct) => {
    if (!hydrated) {
      pendingRecent.current = [product, ...pendingRecent.current.filter((item) => item.id !== product.id)].slice(0, 8);
    }
    setRecent((current) => [product, ...current.filter((item) => item.id !== product.id)].slice(0, 8));
  }, [hydrated]);

  const clear = useCallback(() => setSaved([]), []);
  const value = useMemo(() => ({
    ids: saved.map((item) => item.id),
    recent,
    hydrated,
    hasSaved: (id: string) => saved.some((item) => item.id === id),
    toggle,
    trackViewed,
    remove,
    clear,
  }), [saved, recent, hydrated, toggle, trackViewed, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
