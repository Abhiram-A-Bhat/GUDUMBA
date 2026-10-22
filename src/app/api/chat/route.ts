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
  const q = (query || "").toLowerCase();

  if (q.includes("fabric") || q.includes("gsm") || q.includes("material") || q.includes("cotton") || q.includes("quality")) {
    return "Every GUDUMBA drop is built like armor. Our tees use 280–300 GSM 100% combed compact cotton, while our hoodies are cut from 450 GSM ultra-heavyweight brushed French terry. Pre-shrunk, bio-washed, and acid-distressed so the drape never loses its shape.";
  }

  if (q.includes("arrive") || q.includes("delivery") || q.includes("ship") || q.includes("track") || q.includes("when will") || q.includes("order status")) {
    return "All drops are packed and dispatched from our Bengaluru warehouse within 24–48 hours. Delivery takes 3–5 business days across India. You can track your real-time fulfillment status anytime right under your /account portal.";
  }

  if (q.includes("why do we exist") || q.includes("our story") || q.includes("manifesto") || q.includes("meaning") || q.includes("philosophy") || q.includes("who are you") || q.includes("what is gudumba")) {
    return "Born Different. Stay Unapologetic. We exist for the ones who refuse to shrink to fit in. The world will always call you too loud, too bold, too chaotic — we say so what? We build raw, unapologetic armor for men who walk their own path. No validation. No imitation. No apologies.";
  }

  if (q.includes("siz") || q.includes("fit") || q.includes("chart") || q.includes("guide") || q.includes("measurement") || q.includes("large") || q.includes("medium")) {
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
  let lastUserMsg = "";
  let catalogContext = "";

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    // Extract the latest user query
    const userMessages = messages.filter((m: any) => m && m.role === "user");
    lastUserMsg = userMessages[userMessages.length - 1]?.content || messages[messages.length - 1]?.content || "";

    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

    // Fetch live product names & prices for rich catalog context
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

    // 1. FAST PRIMARY ENGINE: Groq Ultra-Low Latency LLM (if configured)
    if (groqApiKey) {
      const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"];

      const groqMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION + catalogContext },
        ...messages
          .filter((m: any) => m && m.content && m.content.trim())
          .map((m: any) => ({
            role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
            content: m.content,
          })),
      ];

      for (const model of groqModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: groqMessages,
              temperature: 0.7,
              max_tokens: 400,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            let replyText = data.choices?.[0]?.message?.content;
            if (replyText) {
              replyText = replyText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
              if (replyText) {
                return NextResponse.json({ reply: replyText });
              }
            }
          }
        } catch (groqErr) {
          console.warn(`Groq model ${model} attempt error:`, groqErr);
        }
      }
    }

    // 2. SECONDARY ENGINE: Gemini API (if configured)
    if (geminiApiKey) {
      const filteredMessages = messages.filter((m: any) => m && m.content && m.content.trim());
      const firstUserIndex = filteredMessages.findIndex((m: any) => m.role === "user");
      const validHistory = firstUserIndex !== -1 ? filteredMessages.slice(firstUserIndex) : [{ role: "user", content: lastUserMsg }];

      const formattedContents = validHistory.map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

      for (const modelName of geminiModels) {
        try {
          const restRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
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
          console.warn(`Gemini model ${modelName} attempt error:`, err);
        }
      }
    }

    // 3. ZERO-FAIL INTELLIGENT BRAND ENGINE
    const fallbackReply = getIntelligentBrandResponse(lastUserMsg, catalogContext);
    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Chat API processing error:", error);
    const fallbackReply = getIntelligentBrandResponse(lastUserMsg, catalogContext);
    return NextResponse.json({ reply: fallbackReply });
  }
}
