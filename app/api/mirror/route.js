import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function extractJSON(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    const { resolution } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Return ONLY valid JSON. No markdown. No explanation.

User resolution:
"${resolution}"

Schema:
{
  "genjitsu": {
    "date": "",
    "reason": "",
    "explanation": "",
    "image_prompt": ""
  },
  "mirai": {
    "date": "",
    "reason": "",
    "explanation": "",
    "image_prompt": ""
  }
}
`,
            },
          ],
        },
      ],
    });

    const rawText = response.text;

    // 👇 CRITICAL FIX
    const data = extractJSON(rawText);

    // Safety check
    if (!data.genjitsu || !data.mirai) {
      throw new Error("Invalid Gemini structure");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Mirror generation failed:", err);
    return NextResponse.json(
      { error: "Mirror generation failed" },
      { status: 500 }
    );
  }
}
