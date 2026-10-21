import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSupabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod = "PAYTM",
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: "Please fill in all contact and shipping details." },
        { status: 400 }
      );
    }

    // Optional logged-in user
    const authUser = getAuthUser(req);
    const userId = authUser?.userId || null;

    // Calculate subtotal server-side
    let subtotal = 0;
    for (const item of items) {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;
    }

    // Free delivery above ₹2000, else ₹99
    const shippingFee = subtotal >= 2000 ? 0 : 99;
    const totalAmount = subtotal + shippingFee;

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const orderNumber = `GDM-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingJson = JSON.stringify(shippingAddress);

    // 1. Insert into local SQLite
    try {
      const insertOrder = db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, subtotal, shipping_fee, discount_amount, total_amount,
          payment_method, payment_status, fulfillment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertOrder.run(
        orderId,
        orderNumber,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingJson,
        subtotal,
        shippingFee,
        0,
        totalAmount,
        paymentMethod,
        paymentMethod === "COD" ? "PENDING" : "PENDING",
        "UNFULFILLED"
      );

      const insertItem = db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, variant_id, product_name, size, price, quantity, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        insertItem.run(
          itemId,
          orderId,
          item.productId || "prod_unknown",
          item.id || item.variantId || null,
          item.name,
          item.size || "M",
          Number(item.price),
          Number(item.quantity),
          Number(item.price) * Number(item.quantity)
        );
      }
    } catch (sqliteErr) {
      console.warn("SQLite insert order warning:", sqliteErr);
    }

    // 2. Mirror into Supabase if connected
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from("orders").insert({
          id: orderId,
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          subtotal,
          shipping_fee: shippingFee,
          discount_amount: 0,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_status: "PENDING",
          fulfillment_status: "UNFULFILLED",
        });

        for (const item of items) {
          const itemId = `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          await supabase.from("order_items").insert({
            id: itemId,
            order_id: orderId,
            product_id: item.productId,
            variant_id: item.id || item.variantId,
            product_name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          });
        }
      }
    } catch (supaErr) {
      console.warn("Supabase insert order warning:", supaErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      totalAmount,
      shippingFee,
      subtotal,
      paymentMethod,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
