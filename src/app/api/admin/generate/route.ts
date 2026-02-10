import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ─── Types ───────────────────────────────────────────────────
interface GenerateRequest {
  productName: string;
  category?: string;
  fabric?: string;
  price?: number;
  colors?: string;   // comma-separated color names
  sizes?: string;    // comma-separated size labels
  context?: string;  // free-text from user about the product
  image?: string;    // base64 data URL of a screenshot to extract details from
}

interface GeneratedContent {
  productName: string;
  suggestedPrice: number | null;
  colors: string;
  sizes: string;
  shortDescription: string;
  description: string;
  fabric: string;
  careInstructions: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  badge: string;
}

// ─── System prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are the senior copywriter for Maison ISIVIS — a modern, high-end "Cool Girl" fashion boutique based in London.
Brand: "Turning Fantasy Into Reality", "Britain's Premier Fashion House", "Pr\u00eat-\u00e0-couture for the modern woman."
Currency: GBP (\u00a3). All prices in British Pounds.

RULES — The "Anti-Fluff" Voice:
1. NO AI SPEAK. Never use: "enchanting", "tapestry", "essence", "elevate your wardrobe", "sophisticated", "testament to", "embrace", "captivating", "realm", "delve", "beacon", "unlock", "nestled", "landscape", "embark", "ever-evolving", "indulge", "empower", "exquisite craftsmanship", "your journey", "game-changing", "seamlessly", "curated", "redefine", "revolutionise".
2. FOCUS ON FEEL. Describe how the fabric and fit actually feel on the body: "hugs the curves without squeezing", "cool linen that breathes on a July afternoon", "the kind of stretch that lets you move from desk to dance floor". Avoid generic platitudes.
3. INCLUDE "THE LOOK" — In the full description, add a "Style Notes" paragraph with 2-3 real-world styling scenarios: "Throw on with strappy heels and gold hoops for a rooftop dinner" or "Pair with white trainers and oversized sunnies for weekend brunch." Think like a stylish friend giving real advice.
4. SENTENCE VARIETY — Mix short, punchy lines with longer, descriptive ones. Start some with the product feature, others with the feeling. Break up rhythm. Never write three sentences in a row that start the same way.
5. TONE — Sound like a stylish friend giving a recommendation over drinks, not a brochure. Confident, warm, a touch witty. No corporate speak. Write like you'd text your best mate about a killer outfit.
6. SHORT DESCRIPTIONS — 1-2 sentences. Lead with how it looks/feels. Make the reader picture themselves wearing it. No filler.
7. FULL DESCRIPTIONS — 2-3 tight paragraphs:
   \u2022 Paragraph 1: The vibe — what this piece does for you, how it looks & feels on
   \u2022 Paragraph 2: The details — fabric, fit, clever design features, construction
   \u2022 Paragraph 3: Style Notes — real outfit ideas and occasions

8. COLOURS & SIZES — When colours or sizes are provided, weave them naturally into the description. Mention colour options ("available in Noir, Ivory and Dusty Rose") and reference the size range. Don't just list them — make the reader imagine themselves choosing.

Additional field rules:
- Fabric: Be specific (e.g. "100% Mulberry Silk, 19 momme" or "Italian Stretch Crepe, 95% Polyester 5% Elastane"). If not provided, suggest a luxury-appropriate fabric.
- Care instructions: Short, practical. Match the fabric.
- Meta title: Under 60 chars. Format: "[Product Name] | Maison ISIVIS"
- Meta description: 120-155 chars. Punchy, makes you want to click.
- Keywords: 5-8 comma-separated search terms.
- Badge: One short label if fitting ("New Arrival", "Best Seller", "Limited Edition") or empty string.

You MUST respond with ONLY valid JSON matching this exact structure:
{
  "productName": "The product name (extract from image or use the provided name)",
  "suggestedPrice": 285,
  "colors": "Black, Ivory, Dusty Rose",
  "sizes": "XS, S, M, L, XL",
  "shortDescription": "...",
  "description": "...",
  "fabric": "...",
  "careInstructions": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "badge": "..."
}

IMPORTANT for extraction fields:
- productName: Use the exact product name if provided. If extracting from an image, use the name visible in the screenshot.
- suggestedPrice: Use the exact price if provided. If extracting from image, use the visible price as a number (no currency symbol). If no price is available, use null.
- colors: Comma-separated colour names. Extract from image if visible, or use provided colours. If none available, suggest 2-3 appropriate luxury colours.
- sizes: Comma-separated size labels. Extract from image if visible, or use provided sizes. If none available, use "XS, S, M, L, XL".

No markdown, no code fences, no extra text. Just the JSON object.`;

// ─── POST handler ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as GenerateRequest;

    if (!body.productName?.trim()) {
      return NextResponse.json(
        { error: "Product name is required to generate content." },
        { status: 400 }
      );
    }

    // Build the user prompt from available info
    const parts: string[] = [`Product name: ${body.productName}`];
    if (body.category) parts.push(`Category: ${body.category}`);
    if (body.fabric) parts.push(`Fabric: ${body.fabric}`);
    if (body.price) parts.push(`Price: \u00a3${body.price}`);
    if (body.colors?.trim()) parts.push(`Available colours: ${body.colors}`);
    if (body.sizes?.trim()) parts.push(`Available sizes: ${body.sizes}`);
    if (body.context?.trim()) parts.push(`Additional context: ${body.context}`);

    const userPrompt = `Generate all product page content for this Maison ISIVIS product:\n\n${parts.join("\n")}`;

    const client = new Anthropic({ apiKey });

    // Build message content — text only or text + image (vision)
    type ContentBlock = Anthropic.Messages.TextBlockParam | Anthropic.Messages.ImageBlockParam;
    const contentBlocks: ContentBlock[] = [];

    // If an image was uploaded, add it first so Claude can see it
    if (body.image) {
      // Extract base64 data and media type from data URL
      const match = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match && match[1] && match[2]) {
        const mediaType = match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
        const base64Data = match[2];
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64Data,
          },
        });
        contentBlocks.push({
          type: "text",
          text: `I've uploaded a screenshot of this product. Extract all visible details (product name, colours, sizes, fabric, price, description) from the image and use them to generate the content.\n\n${userPrompt}`,
        });
      } else {
        contentBlocks.push({ type: "text", text: userPrompt });
      }
    } else {
      contentBlocks.push({ type: "text", text: userPrompt });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        { role: "user", content: contentBlocks },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text content from response
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI." },
        { status: 500 }
      );
    }

    // Parse JSON from response
    const raw = textBlock.text.trim();
    let generated: GeneratedContent;
    try {
      generated = JSON.parse(raw) as GeneratedContent;
    } catch {
      // Try extracting JSON from response if wrapped in code fences
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generated = JSON.parse(jsonMatch[0]) as GeneratedContent;
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response as JSON.", raw },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ content: generated });
  } catch (err) {
    console.error("[AI Generate]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
