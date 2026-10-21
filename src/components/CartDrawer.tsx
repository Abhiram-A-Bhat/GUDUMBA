"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";


export default function CartDrawer() {
  const { state, dispatch, total, count } = useCart();
  const { isOpen, items } = state;
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const drawerWasOpen = useRef(false);

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) dispatch({ type: "CLOSE_DRAWER" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, dispatch]);

  // Focus trap: move focus to close button when opened
  useEffect(() => {
    if (isOpen) {
      drawerWasOpen.current = true;
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (drawerWasOpen.current) {
        drawerWasOpen.current = false;
        document.querySelector<HTMLButtonElement>('[aria-controls="cart-drawer"]')?.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap: keep focus inside drawer
  useEffect(() => {
    if (!isOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [isOpen, items]);


  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        id="cart-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen}
        aria-label="Shopping cart"
        className={`drawer-panel transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} className="text-[#999]" />
            <span
              className="font-display text-lg tracking-[0.12em] text-[#f2f0ed]"
              style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
            >
              Your Bag
            </span>
            {count > 0 && (
              <span className="text-[11px] text-[#666] font-medium">
                ({count} item{count !== 1 ? "s" : ""})
              </span>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
            className="p-2 text-[#666] hover:text-[#f2f0ed] transition-colors"
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Checkout status */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-[#0e0e0e] border-b border-[#1a1a1a]">
            <p className="text-[11px] text-[#b7a89c]">Checkout is offline. Shipping availability has not been confirmed.</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {items.length === 0 ? (
            <EmptyCart onClose={() => dispatch({ type: "CLOSE_DRAWER" })} />
          ) : (
            <ul className="divide-y divide-[#1a1a1a]">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 px-5 py-4">
                  {/* Image */}
                  <div className="w-20 h-24 bg-[#161616] rounded-sm overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/shop/${item.productSlug}`}
                        onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
                        className="text-[13px] font-semibold text-[#f2f0ed] leading-tight hover:text-white transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.subtitle && (
                        <p className="text-[11px] text-[#555] mt-0.5 line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}
                      <p className="text-[11px] text-[#666] mt-1 uppercase tracking-wider">
                        Size: {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-[#2a2a2a] rounded-sm">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QTY",
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#666] hover:text-[#f2f0ed] transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={12} strokeWidth={2} />
                        </button>
                        <span className="w-7 text-center text-[12px] text-[#f2f0ed] font-medium select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QTY",
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={item.quantity >= 10}
                          className="w-7 h-7 flex items-center justify-center text-[#666] hover:text-[#f2f0ed] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={12} strokeWidth={2} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-semibold text-[#f2f0ed]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                          className="text-[#444] hover:text-red-500 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#222] px-5 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#888] uppercase tracking-wider font-medium">
                Subtotal
              </span>
              <span className="text-[15px] font-bold text-[#f2f0ed]">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-[11px] text-[#555]">
              Shipping and taxes are not available in this preview.
            </p>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
              className="btn-primary w-full justify-between rounded-sm"
            >
              <span>Checkout</span>
              <ArrowRight size={16} strokeWidth={2} />
            </Link>

            <button
              onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
              className="w-full text-center text-[11px] text-[#555] hover:text-[#888] transition-colors tracking-wider uppercase py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#222] flex items-center justify-center">
        <ShoppingBag size={28} strokeWidth={1} className="text-[#444]" />
      </div>
      <div>
        <p
          className="font-display text-2xl tracking-widest text-[#f2f0ed] mb-2"
          style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
        >
          Your bag is empty
        </p>
        <p className="text-[13px] text-[#555] leading-relaxed max-w-[220px] mx-auto">
          The streets are calling. Fill your bag with something worth wearing.
        </p>
      </div>
      <Link href="/shop" onClick={onClose} className="btn-primary rounded-sm">
        Shop the Drop
      </Link>
    </div>
  );
}
