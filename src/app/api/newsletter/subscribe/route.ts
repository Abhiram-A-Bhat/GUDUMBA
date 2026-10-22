import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("marketing_subscribers").upsert(
        { email, source: "website_footer", is_active: 1, unsubscribed_at: null },
        { onConflict: "email" },
      );
      if (!error) return NextResponse.json({ success: true });
      console.warn("Newsletter Supabase write failed; trying local storage.", error.message);
    }

    db.prepare(`
      INSERT INTO marketing_subscribers (id, email, source, is_active, unsubscribed_at)
      VALUES (?, ?, 'website_footer', 1, NULL)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, unsubscribed_at = NULL
    `).run(`subscriber_${crypto.randomUUID()}`, email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription failed.", error);
    return NextResponse.json({ error: "We could not save your email. Please try again." }, { status: 503 });
  }
}
