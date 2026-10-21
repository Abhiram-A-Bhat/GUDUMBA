import React from "react";
import Link from "next/link";
import db from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, Users, DollarSign, Clock } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthUserFromToken, sessionCookieName } from "@/lib/session";

export const metadata = {
  title: "Admin Executive Dashboard — GUDUMBA®",
};

interface DashboardOrder {
  id: string;
  order_number: string;
  customer_name: string;
  created_at: string;
  payment_status: string;
  fulfillment_status: string;
  total_amount: number;
}

export default async function AdminDashboardPage() {
  const jar = await cookies();
  const user = getAuthUserFromToken(jar.get(sessionCookieName())?.value);
  if (!user || user.role !== "admin") redirect("/login");

  const totalOrders = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c;
  const totalRev = (db.prepare("SELECT COALESCE(SUM(total_amount), 0) as s FROM orders WHERE payment_status = 'COMPLETED'").get() as { s: number }).s;
  const pendingFulfillment = (db.prepare("SELECT COUNT(*) as c FROM orders WHERE fulfillment_status = 'UNFULFILLED'").get() as { c: number }).c;
  const totalProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE is_archived = 0").get() as { c: number }).c;

  const recentOrders = db.prepare(`
    SELECT * FROM orders ORDER BY created_at DESC LIMIT 6
  `).all() as DashboardOrder[];

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2f0ed] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222] pb-6 mb-8 gap-4">
          <div>
            <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.25em] font-semibold block mb-1">
              Gudumba Executive Control
            </span>
            <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed]">
              OPERATIONS COMMAND
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-ghost text-xs">
              View Storefront ↗
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-[#0e0e0e] border border-[#222] rounded-xs">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-[#777] uppercase">Gross Value of Paid Orders</span>
              <DollarSign size={16} className="text-[#c8410a]" />
            </div>
            <p className="text-3xl font-bold font-mono text-[#f2f0ed]">
              {formatPrice(totalRev)}
            </p>
            <span className="text-[10px] text-[#555] font-mono mt-1 block">Recorded payment status; refunds excluded</span>
          </div>

          <div className="p-6 bg-[#0e0e0e] border border-[#222] rounded-xs">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-[#777] uppercase">Total Orders</span>
              <Package size={16} className="text-[#c8410a]" />
            </div>
            <p className="text-3xl font-bold font-mono text-[#f2f0ed]">
              {totalOrders}
            </p>
            <span className="text-[10px] text-[#555] font-mono mt-1 block">Across all channels</span>
          </div>

          <div className="p-6 bg-[#0e0e0e] border border-[#222] rounded-xs">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-[#777] uppercase">Unfulfilled Shipments</span>
              <Clock size={16} className="text-[#c8410a]" />
            </div>
            <p className="text-3xl font-bold font-mono text-[#f2f0ed]">
              {pendingFulfillment}
            </p>
            <span className="text-[10px] text-[#555] font-mono mt-1 block">Requires warehouse pick</span>
          </div>

          <div className="p-6 bg-[#0e0e0e] border border-[#222] rounded-xs">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-[#777] uppercase">Active SKUs</span>
              <Users size={16} className="text-[#c8410a]" />
            </div>
            <p className="text-3xl font-bold font-mono text-[#f2f0ed]">
              {totalProducts}
            </p>
            <span className="text-[10px] text-[#555] font-mono mt-1 block">Drop 01 Catalogue</span>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#0e0e0e] border border-[#222] rounded-xs p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#f2f0ed]">
              Recent Orders
            </h2>
            <span className="text-xs font-mono text-[#777]">Latest recorded orders</span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#666] font-mono">
              NO ORDERS RECORDED YET.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#222] text-[#777]">
                    <th className="pb-3 font-semibold">ORDER ID</th>
                    <th className="pb-3 font-semibold">CUSTOMER</th>
                    <th className="pb-3 font-semibold">DATE</th>
                    <th className="pb-3 font-semibold">PAYMENT</th>
                    <th className="pb-3 font-semibold">FULFILLMENT</th>
                    <th className="pb-3 font-semibold text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1c]">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#121212] transition-colors">
                      <td className="py-3 text-[#c8410a] font-bold">{ord.order_number}</td>
                      <td className="py-3 text-[#ccc]">{ord.customer_name}</td>
                      <td className="py-3 text-[#777]">{new Date(ord.created_at).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          ord.payment_status === "COMPLETED" ? "bg-green-950 text-green-300" : "bg-amber-950 text-amber-300"
                        }`}>
                          {ord.payment_status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-[#1f1f1f] text-[#ccc]">
                          {ord.fulfillment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[#f2f0ed]">
                        {formatPrice(ord.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
