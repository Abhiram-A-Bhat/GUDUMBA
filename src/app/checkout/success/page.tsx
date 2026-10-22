import Footer from "@/components/Footer";
import SuccessContent from "@/components/checkout/SuccessContent";
import db from "@/lib/db";
import { getSupabase } from "@/lib/supabase";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderNumber?: string; status?: string }> }) {
  const params = await searchParams;
  const orderNumber = typeof params.orderNumber === "string" ? params.orderNumber : "";
  const requestedStatus = typeof params.status === "string" ? params.status : "";
  let order: { payment_status?: string; payment_method?: string } | null = null;

  if (orderNumber) {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase.from("orders").select("payment_status,payment_method").eq("order_number", orderNumber).maybeSingle();
      order = data;
    }
    if (!order) {
      try {
        order = db.prepare("SELECT payment_status, payment_method FROM orders WHERE order_number = ?").get(orderNumber) as typeof order;
      } catch {
        // The order may be stored only in Supabase.
      }
    }
  }

  const isCod = requestedStatus === "cod" && order?.payment_method === "COD";
  const isPaid = (requestedStatus === "success" || requestedStatus === "youpi") && order?.payment_status === "COMPLETED";

  return (
    <div className="pt-24 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <main className="w-full">
        <SuccessContent
          orderNumber={orderNumber}
          status={isCod ? "cod" : requestedStatus}
          isSuccess={isCod || isPaid}
        />
      </main>
      <Footer />
    </div>
  );
}
