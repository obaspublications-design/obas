import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  // process.env.API_KEY is injected by the environment
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateOptimizedTitles = async (draftTitle: string, abstract: string): Promise<string[]> => {
  const ai = getAiClient();
  
  const prompt = `
    I have an academic manuscript. 
    Draft Title: "${draftTitle}"
    Abstract: "${abstract}"
    
    Please generate 3 high-impact, professional academic titles suitable for reputable international journals (e.g., Elsevier, Wiley).
    The titles should be concise, engaging, and accurately reflect the research.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 optimized academic titles"
            }
          },
          required: ["titles"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.titles || [];
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error("Failed to generate titles. Please try again.");
  }
};

export const generateBlogTopics = async (topic: string): Promise<string[]> => {
  const ai = getAiClient();

  const prompt = `
    Topic: "${topic}"
    Target Audience: Academic researchers and scholars in Nigeria/Africa.

    Generate 5 engaging, professional blog post titles for an academic publication service website.
    The titles should be educational, catchy, and relevant to publishing in international journals.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 5 blog titles"
            }
          },
          required: ["topics"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return parsed.topics || [];
  } catch (error) {
    console.error("Error generating topics:", error);
    throw new Error("Failed to generate blog topics.");
  }
};