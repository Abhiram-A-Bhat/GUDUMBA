import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SYSTEM_INSTRUCTION = `You are the GUDUMBA® Streetwear AI Concierge — the official styling, sizing, and customer advisor for Gudumba (India's boldest underground streetwear movement).

BRAND ETHOS:
- "Born Different. Stay Unapologetic."
- "No Validation. No Imitation. No Apologies."
- "A little chaos. A lot of character. Everyday streetwear."
- For the ones who don't blend in. Stay strange. Stay iconic.

TONE & STYLE:
- Confident, effortlessly cool, street-smart, authentic.
- Never sound like a robotic customer service bot. Speak like a luxury streetwear stylist.
- Keep responses punchy, concise, and helpful (2-4 sentences max per reply unless detailed sizing is requested).
- Use ₹ (INR) for all prices.

STORE POLICIES & SPECS:
- Sizing: All silhouettes are signature boxy oversized streetwear cuts. Recommend true to size for standard oversized drape, or size down 1 for a more fitted silhouette.
- Fabrics: Heavyweight 280-300 GSM 100% combed French terry and premium cotton for tees; 450 GSM ultra-heavy French terry for hoodies. Pre-shrunk, bio-washed, acid-washed.
- Shipping: Free delivery across India on orders over ₹2000. Flat ₹99 for orders under ₹2000. Dispatched within 24-48 hours, delivered in 3-5 business days. Real-time tracking available under /account.
- Returns & Exchanges: 7-day hassle-free replacement or exchange if tags are intact and unworn.
- Contact: support@gudumba.in | Instagram @only.gudumba`;

// Intelligent Concierge Knowledge Base (Zero-Fail Guarantee)
function getIntelligentBrandResponse(query: string, catalogContext: string): string {
  const q = query.toLowerCase();

  if (q.includes("fabric") || q.includes("gsm") || q.includes("material") || q.includes("cotton") || q.includes("quality")) {
    return "Every GUDUMBA drop is built like armor. Our tees use 280–300 GSM 100% combed compact cotton, while our hoodies are cut from 450 GSM ultra-heavyweight brushed French terry. Pre-shrunk, bio-washed, and acid-distressed so the drape never loses its shape.";
  }

  if (q.includes("arrive") || q.includes("delivery") || q.includes("ship") || q.includes("track") || q.includes("when will") || q.includes("order status")) {
    return "All drops are packed and dispatched from our Bengaluru warehouse within 24–48 hours. Delivery takes 3–5 business days across India. You can track your real-time fulfillment status anytime right under your /account portal.";
  }

  if (q.includes("why do we exist") || q.includes("our story") || q.includes("manifesto") || q.includes("meaning") || q.includes("philosophy") || q.includes("who are you") || q.includes("what is gudumba")) {
    return "Born Different. Stay Unapologetic. We exist for the ones who refuse to shrink to fit in. The world will always call you too loud, too bold, too chaotic — we say so what? We build raw, unapologetic armor for men who walk their own path. No validation. No imitation. No apologies.";
  }

  if (q.includes("size") || q.includes("fit") || q.includes("chart") || q.includes("measurement") || q.includes("large") || q.includes("medium")) {
    return "Our silhouettes feature our signature boxy drop-shoulder streetwear cut. Go true to size for that relaxed, slouchy editorial drape. If you prefer a tailored, traditional fit, size down by one.";
  }

  if (q.includes("return") || q.includes("exchange") || q.includes("refund") || q.includes("policy")) {
    return "Zero drama. We offer 7-day hassle-free size exchanges and replacements on all unworn pieces with original tags intact. Just reach out to support@gudumba.in with your order number.";
  }

  if (q.includes("recommend") || q.includes("drop") || q.includes("hoodie") || q.includes("tee") || q.includes("best") || q.includes("buy")) {
    return "Drop 01 is flying fast. Check out the Chaos & Character Heavyweight Tee (280 GSM puff print backpiece, ₹1,899) or the Obsidian 450 GSM Heavyweight Hoodie (₹3,899). Pair either with our Tactical Parachute Cargos (₹3,499) for the complete runway aesthetic.";
  }

  if (q.includes("hello") || q.includes("hey") || q.includes("hi") || q.includes("sup")) {
    return "Gudumba Concierge online. Sizing, fabric weights, or drop styling — what's on your mind?";
  }

  return "Born Different. Stay Unapologetic. We're running 100% heavyweight drops — ask me about sizing, 280-450 GSM fabric specs, shipping timelines, or styling Drop 01.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Fetch live product names & prices for rich catalog context
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
          catalogContext = "\n\nCURRENT LIVE PRODUCTS:\n" +
            products.map((p) => `- ${p.name} (${p.subtitle}): ₹${p.price} [URL: /products/${p.slug}]`).join("\n");
        }
      }
    } catch {
      // catalog context fallback
    }

    // If no valid API key, return immediate intelligent brand response
    if (!apiKey) {
      const reply = getIntelligentBrandResponse(lastUserMsg, catalogContext);
      return NextResponse.json({ reply });
    }

    // Ensure conversation starts with user turn and alternates correctly
    const filteredMessages = messages.filter((m: any) => m && m.content && m.content.trim());
    const firstUserIndex = filteredMessages.findIndex((m: any) => m.role === "user");
    const validHistory = firstUserIndex !== -1 ? filteredMessages.slice(firstUserIndex) : [{ role: "user", content: lastUserMsg }];

    const formattedContents = validHistory.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Multi-tier Gemini model execution with REST fallback
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

    for (const modelName of modelsToTry) {
      try {
        const restRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: formattedContents,
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION + catalogContext }],
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (restRes.ok) {
          const restData = await restRes.json();
          const generatedText = restData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({ reply: generatedText.trim() });
          }
        }
      } catch (err) {
        console.warn(`Model ${modelName} attempt failed:`, err);
      }
    }

    // Try @google/genai SDK fallback
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + catalogContext,
          temperature: 0.7,
        },
      });

      if (response.text) {
        return NextResponse.json({ reply: response.text.trim() });
      }
    } catch (sdkErr) {
      console.warn("GoogleGenAI SDK attempt warning:", sdkErr);
    }

    // Seamless Intelligent Fallback if API key has quota/network issues
    const fallbackReply = getIntelligentBrandResponse(lastUserMsg, catalogContext);
    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Chat API processing error:", error);
    const fallbackReply = getIntelligentBrandResponse("", "");
    return NextResponse.json({ reply: fallbackReply });
  }
}
