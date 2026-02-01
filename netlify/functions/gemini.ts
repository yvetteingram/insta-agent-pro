import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { topic, businessType, tone, goal, contentType, imageBase64, imageUrl } = JSON.parse(event.body);

    // Initializing the AI client. 
    // Guideline: Assume process.env.API_KEY is pre-configured and valid in the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const model = 'gemini-3-flash-preview';
    const isStory = contentType === 'Story';

    const systemPrompt = `
      You are a professional Instagram Content Agent for ${businessType} businesses.
      TASK: Generate exactly 3 (three) distinct Instagram caption options. 
      TONE: ${tone}
      GOAL: ${goal}
      FORMAT: ${contentType}
      TOPIC: "${topic}"

      STRICT RULES:
      - HOOK: Start with a scroll-stopping first line.
      - BODY: High-value, conversational copy perfectly suited for Instagram.
      - CTA: Natural, goal-oriented closing for Instagram conversion.
      - HASHTAGS: 3-5 relevant niche tags.
      ${isStory ? 'STORY: Add creative sticker ideas.' : 'FEED: Include audio mood suggestions.'}
    `;

    const parts: any[] = [{ text: systemPrompt }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1]
        }
      });
    } 
    else if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        const arrayBuffer = await imageResponse.arrayBuffer();
        
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        const contentTypeHeader = imageResponse.headers.get('content-type') || 'image/jpeg';
        
        parts.push({
          inlineData: {
            mimeType: contentTypeHeader,
            data: base64
          }
        });
      } catch (imgError: any) {
        console.warn("Image fetch failed, proceeding with text only.");
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  hashtags: { type: Type.STRING },
                  stickerIdea: { type: Type.STRING },
                  audioSuggestion: { type: Type.STRING }
                },
                required: ["hook", "body", "cta", "hashtags"]
              }
            }
          },
          required: ["captions"]
        }
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: response.text,
    };
  } catch (error: any) {
    console.error("Gemini Function Error:", error);
    // If process.env.API_KEY is missing, the SDK will throw an error that is caught here.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to generate content" }),
    };
  }
};

