import { NextRequest, NextResponse } from "next/server";

import { openai } from "@/lib/utils/openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const image = formData.get("image") as File;

    const maxLength = 250;

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Prompt is required",
        },
        { status: 400 }
      );
    }

    if (prompt.length > maxLength) {
      return NextResponse.json(
        {
          error: "Prompt is too long",
        },
        { status: 400 }
      );
    }

    const result = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a GPSR (General Product Safety Regulation) compliance expert.

Your task is to clearly and concisely answer questions **only related to product safety regulations in the EU and UK market**.

If the question is not related to GPSR or product safety regulations, respond with:  
**"⚠️ This question is not directly related to GPSR."**
---

## 🖋️ Markdown Style Guidelines:

- Use **headings** (#, ##, ###) to divide sections.
- Use 🟢, 🔴, ⚠️, or ✅ **emojis** for visual clarity (especially for risk levels, decisions, or statuses).
- Use **bold**, *italic*, and > blockquotes to emphasize important notes.
- Use **tables** for structured data like regulation names, numbers, dates.
- Use bullet points (•) or checkboxes (✅ / ☐) to list compliance steps or obligations.
- Wrap the entire response in **a clean layout**, resembling a report.

---

Never generate any code, raw JSON, or internal reasoning. Always present information in the professional Markdown layout above.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = result.choices[0].message.content;

    return NextResponse.json({
      content: response,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: "Failed to check compliance",
    });
  }
}
