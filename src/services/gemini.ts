import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function analyzePrescription(imageBase64: string, mimeType: string) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: "Analyze this prescription image. Extract the names of the medicines, dosages, and instructions. Provide the output in a structured JSON format with a list of medicines (name, dosage, instructions) and any general notes. Disclaimer: This is for educational purposes only.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                instructions: { type: Type.STRING },
              },
              required: ["name", "dosage", "instructions"],
            },
          },
          notes: { type: Type.STRING },
        },
        required: ["medicines", "notes"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function checkInteractions(medicines: string[]) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Check for potential interactions between the following medicines: ${medicines.join(", ")}. Provide a structured JSON response with a list of interactions (severity: Low, Medium, High), description, and a general safety summary.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          interactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                medicinesInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
                severity: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["medicinesInvolved", "severity", "description"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["interactions", "summary"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function checkSymptoms(symptoms: string) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following symptoms: ${symptoms}. Provide a structured JSON response with potential causes, recommended next steps, and an emergency risk level (Low, Medium, High). Always include a disclaimer to consult a doctor.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          potentialCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskLevel: { type: Type.STRING },
          disclaimer: { type: Type.STRING },
        },
        required: ["potentialCauses", "recommendations", "riskLevel", "disclaimer"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function getMedicineInfo(medicine: string) {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide information about the medicine: ${medicine}. Include its primary uses, common side effects, and general warnings. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          uses: { type: Type.ARRAY, items: { type: Type.STRING } },
          sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "uses", "sideEffects", "warnings"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
