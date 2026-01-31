
import { GenerationResult, BusinessType, Tone, ConversionGoal, ContentType } from "../types";

export const generateInstagramCaptions = async (
  topic: string, 
  businessType: BusinessType, 
  tone: Tone,
  goal: ConversionGoal,
  contentType: ContentType,
  imageBase64?: string,
  imageUrl?: string
): Promise<GenerationResult> => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        businessType,
        tone,
        goal,
        contentType,
        imageBase64,
        imageUrl
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Frontend Service Error:", error);
    throw new Error(error.message || "Failed to connect to content generation service.");
  }
};
