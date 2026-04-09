import { GoogleGenAI, Type } from "@google/genai";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchMovieDetails(title: string, userApiKey?: string, retryCount = 0): Promise<any[]> {
  // Use user provided key, or environment variable
  const API_KEY = userApiKey || process.env.GEMINI_API_KEY;

  if (!API_KEY || API_KEY === "MY_GEMINI_API_KEY" || API_KEY === "") {
    console.error("Gemini API Key is missing or placeholder.");
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Details for: "${title}". Brief plot (TR), actors (newline sep), category (TR), IMDb, year, trailer. For series: seasons, episodes. TR only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalTitle: { type: Type.STRING },
                  turkishTitle: { type: Type.STRING },
                  plot: { type: Type.STRING },
                  actors: { type: Type.STRING },
                  category: { type: Type.STRING },
                  imdbRating: { type: Type.STRING },
                  releaseYear: { type: Type.STRING },
                  trailerLink: { type: Type.STRING },
                  seasons: { type: Type.NUMBER },
                  totalEpisodes: { type: Type.NUMBER },
                },
                required: ["originalTitle", "turkishTitle", "plot", "actors", "category", "imdbRating", "releaseYear"],
              }
            }
          },
          required: ["results"],
        },
      },
    });

    const text = response.text;
    
    if (!text) throw new Error("EMPTY_RESPONSE");
    const parsed = JSON.parse(text);
    return parsed.results;
  } catch (error: any) {
    console.error("Error in fetchMovieDetails:", error);

    // Handle 503 (Service Unavailable) or 429 (Rate Limit) with retries
    const isRetryable = error.message?.includes("503") || 
                        error.message?.includes("429") || 
                        error.message?.includes("high demand") ||
                        error.status === 503 || 
                        error.status === 429;

    if (isRetryable && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`AI busy, retrying in ${waitTime}ms... (Attempt ${retryCount + 1})`);
      await sleep(waitTime);
      return fetchMovieDetails(title, userApiKey, retryCount + 1);
    }

    if (error.message?.includes("503") || error.message?.includes("high demand")) {
      throw new Error("AI_BUSY");
    }

    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }

    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("invalid") || error.status === 401) {
      throw new Error("API_KEY_INVALID");
    }

    if (error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
      throw new Error("PERMISSION_DENIED");
    }

    throw error;
  }
}
