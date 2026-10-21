import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";

const SYSTEM_INSTRUCTION = `You are the GUDUMBA® Streetwear AI Concierge — the official styling, sizing, and customer advisor for Gudumba (India's boldest underground luxury streetwear movement).

BRAND ETHOS:
- "Born Different. Stay Unapologetic."
- "No Validation. No Imitation. No Apologies."
- "A little chaos. A lot of character. Everyday streetwear."
- For the ones who don't blend in. Stay strange. Stay iconic.

TONE & STYLE:
- Confident, effortlessly cool, street-smart, authentic.
- Never sound like a robotic customer service bot. Speak like an unapologetic luxury streetwear stylist.
- Keep responses punchy, concise, and helpful (2-4 sentences max).
- Always quote prices in ₹ (INR).

STORE POLICIES & SPECS:
- Sizing: All silhouettes are signature boxy oversized streetwear cuts (280-350 GSM). Recommend true to size for standard oversized drape, or size down 1 for a more fitted silhouette.
- Fabrics: Heavyweight 280-350 GSM 100% combed French terry and premium cotton. Pre-shrunk, bio-washed, acid-washed.
- Shipping: Free delivery across India on orders over ₹2000. Flat ₹99 for orders under ₹2000. Dispatched within 24-48 hours, delivered in 3-5 business days.
- Returns & Exchanges: 7-day hassle-free replacement or exchange if tags are intact and unworn.
- Contact: support@gudumba.in | Instagram @only.gudumba

RECOMMEND PRODUCTS:
When asked for recommendations, suggest items from the Gudumba catalog (Chaos Heavyweight Hoodie, Raw Edge Acid Wash Tee, Sigil Oversized Sweatshirt, Phantom Cargo, etc.) with their price and swagger.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fetch live product names & prices for rich context
    let catalogContext = "";
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data: products } = await supabase
          .from("products")
          .select("name, subtitle, price, slug")
          .eq("is_archived", false)
          .limit(8);
        if (products && products.length > 0) {
          catalogContext =
            "\n\nCURRENT LIVE PRODUCTS:\n" +
            products.map((p) => `- ${p.name} (${p.subtitle}): ₹${p.price} [URL: /products/${p.slug}]`).join("\n");
        }
      }
    } catch {
      // Catalog fallback
    }

    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "Stay unapologetic. Our AI styling engine is live. Sizing tip: our tees and hoodies feature a generous 280-350 GSM boxy cut. Free shipping over ₹2000.";

      if (lastUserMsg.includes("size") || lastUserMsg.includes("fit")) {
        reply = "GUDUMBA pieces feature a signature boxy oversized streetwear drape (280-350 GSM). Go true to size for that relaxed drop-shoulder aesthetic, or size down if you prefer a traditional slim fit.";
      } else if (lastUserMsg.includes("ship") || lastUserMsg.includes("delivery")) {
        reply = "We ship pan-India. Free standard shipping on all drops over ₹2000 (flat ₹99 otherwise). Orders dispatch within 24-48 hours and land on your doorstep in 3-5 business days.";
      } else if (lastUserMsg.includes("return") || lastUserMsg.includes("exchange")) {
        reply = "No hassle. We offer 7-day replacements and size exchanges on all unworn items with original tags attached. Reach out to support@gudumba.in.";
      }

      return NextResponse.json({ reply });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history into concise prompt for Interactions API
    const formattedHistory = messages
      .slice(-6)
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "Customer" : "Gudumba Concierge"}: ${m.content}`)
      .join("\n");

    const prompt = `${SYSTEM_INSTRUCTION}${catalogContext}\n\nCONVERSATION SO FAR:\n${formattedHistory}\n\nGudumba Concierge (respond directly as the concierge):`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    const reply = interaction.output_text || "Born Different. Stay Unapologetic. How can I help you today?";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat API error:", error);
    return NextResponse.json({
      reply: "Stay unapologetic. All GUDUMBA pieces feature custom 280-350 GSM heavyweight boxy cuts with free delivery on orders over ₹2000. Ask us about sizing, fabrics, or drops.",
    });
  }
}
