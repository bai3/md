import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;
  private modelId = "gemini-2.5-flash";

  constructor() {
    const apiKey = process.env.API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generates content based on a user prompt and current document context.
   */
  async generateContent(userInstruction: string, documentContext: string): Promise<string | undefined> {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing.");
      throw new Error("API Key missing");
    }

    try {
      const prompt = `
        You are an expert writing assistant embedded in a Markdown editor.
        
        CONTEXT (The current document content):
        """
        ${documentContext.substring(0, 20000)} 
        """
        
        INSTRUCTION:
        ${userInstruction}
        
        OUTPUT RULES:
        1. Return ONLY the requested markdown text. 
        2. Do not include "Here is the text" or conversational filler.
        3. If asking to fix/replace, return the full corrected segment or the whole text if appropriate.
        4. If asking to summarize, return a bulleted list.
      `;

      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
