import Footer from "@/components/Footer";

export const metadata = { title: "Shipping & Delivery" };

export default function ShippingPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#100f0d] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">Delivery information</span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">SHIPPING & DELIVERY</h1>
        <p className="text-sm leading-relaxed text-[#999]">Draft for owner review. Shipping regions, fees, carriers, dispatch times, delivery estimates, and tracking support have not been confirmed. Checkout is currently disabled, so this website does not accept orders.</p>
      </div>
      <Footer />
    </div>
  );
}
