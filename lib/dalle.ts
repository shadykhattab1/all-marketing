import OpenAI from "openai";

export async function generateImage(prompt: string): Promise<string> {
  // Use DALL-E 3 if OpenAI key is configured
  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    const url = response.data?.[0]?.url;
    if (url) return url;
  }

  // No free image generation available — return empty string
  // The UI will show the prompt so users can generate elsewhere
  return "";
}
