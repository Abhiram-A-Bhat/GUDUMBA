"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Package, User, LogOut } from "lucide-react";

interface AccountOrder {
  id: string;
  order_number: string;
  created_at: string;
  fulfillment_status: string;
  total_amount: number;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders/my")
        .then(r => r.ok ? r.json() : { orders: [] })
        .then(data => setOrders(data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setFetchingOrders(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#100f0d] flex items-center justify-center text-xs font-mono tracking-widest text-[#666]">
        VERIFYING SESSION...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-28 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <div className="max-w-[1200px] mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222] pb-8 mb-12 gap-4">
          <div>
            <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.25em] font-semibold block mb-2">
              Identity Portal
            </span>
            <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed]">
              {user.name.toUpperCase()}
            </h1>
            <p className="text-xs text-[#777] font-mono mt-1">
              {user.email} • ROLE: {user.role.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link href="/admin" className="btn-primary text-xs tracking-wider">
                Admin Control Room →
              </Link>
            )}
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="btn-ghost text-xs tracking-wider flex items-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Orders Section (8 cols) */}
          <div className="lg:col-span-8">
            <h2 className="text-sm uppercase tracking-widest font-bold text-[#f2f0ed] mb-6 flex items-center gap-2">
              <Package size={16} className="text-[#c8410a]" /> Order Archive ({orders.length})
            </h2>

            {fetchingOrders ? (
              <div className="p-8 text-center text-xs text-[#666] font-mono">
                FETCHING ORDERS...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 bg-[#171512] border border-[#222] rounded-xs text-center">
                <p className="text-sm text-[#888] mb-6">
                  You have not placed any orders yet.
                </p>
                <Link href="/shop" className="btn-primary text-xs">
                  Shop Drop 01 →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 bg-[#171512] border border-[#222] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div>
                      <span className="text-[#f2f0ed] font-bold text-sm block mb-1">
                        {ord.order_number}
                      </span>
                      <span className="text-[#666] block">
                        Placed on {new Date(ord.created_at).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="px-2.5 py-1 bg-[#1a1a1a] border border-[#333] text-[#ccc] rounded-xs font-bold text-[10px]">
                        {ord.fulfillment_status}
                      </span>
                      <span className="text-sm font-bold text-[#c8410a]">
                        {formatPrice(ord.total_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Profile info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-[#171512] border border-[#222] rounded-xs">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] mb-4 flex items-center gap-2">
                <User size={14} className="text-[#c8410a]" /> Customer Security
              </h3>
              <div className="space-y-3 text-xs text-[#888] font-mono">
                <div>
                  <span className="text-[#555] block">AUTHENTICATION</span>
                  <span className="text-[#ccc]">Secured Session (JWT + HTTP-Only)</span>
                </div>
                <div>
                  <span className="text-[#555] block">ACCOUNT PERMISSIONS</span>
                  <span className="text-[#ccc]">{user.role === "admin" ? "Superuser / Executive" : "Standard Customer"}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#171512] border border-[#222] rounded-xs">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] mb-2">
                Privacy & Data Deletion
              </h3>
              <p className="text-xs text-[#777] mb-4 leading-relaxed">
                Submit a request for review. Requests are recorded for an administrator and are not automatically processed or deleted.
              </p>
              <button
                onClick={async (event) => {
                  const button = event.currentTarget;
                  button.disabled = true;
                  try {
                    const response = await fetch("/api/account/deletion-request", { method: "POST" });
                    if (!response.ok) throw new Error("Request could not be recorded.");
                    button.textContent = "REQUEST RECORDED";
                  } catch {
                    button.disabled = false;
                    button.textContent = "Request failed — try again";
                  }
                }}
                className="text-xs text-red-500 hover:text-red-400 underline font-mono"
              >
                Request Personal Data Deletion
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
