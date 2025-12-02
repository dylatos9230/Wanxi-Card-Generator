import { GoogleGenAI, Type, Schema } from '@google/genai';
import { BusinessCardData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateCardContent = async (
  description: string,
  currentData: BusinessCardData
): Promise<BusinessCardData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      companyNameCN: { type: Type.STRING, description: "Company name in Chinese (short, 2-4 chars per line if stacked)" },
      companyNameEN: { type: Type.STRING, description: "Company name in English (uppercase)" },
      tagline: { type: Type.STRING, description: "A catchy, philosophical tagline in Chinese" },
      services: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 6-8 core professional services offered"
      },
      partners: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 6-9 reputable partner organization names"
      },
      email: { type: Type.STRING, description: "Professional contact email" }
    },
    required: ["companyNameCN", "companyNameEN", "tagline", "services", "partners", "email"]
  };

  const prompt = `
    Generate business card content for a company described as: "${description}".
    The tone should be professional, innovative, and concise.
    Return JSON data matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    // Transform string arrays to object arrays with IDs for React state
    return {
      ...currentData,
      companyNameCN: data.companyNameCN || currentData.companyNameCN,
      companyNameEN: data.companyNameEN || currentData.companyNameEN,
      tagline: data.tagline || currentData.tagline,
      services: data.services.map((s: string) => ({ id: uuidv4(), text: s })),
      partners: data.partners.map((p: string) => ({ id: uuidv4(), name: p })),
      contact: {
        ...currentData.contact,
        email: data.email || currentData.contact.email
      }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
