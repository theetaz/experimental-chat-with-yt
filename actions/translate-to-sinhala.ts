"use server";

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

// Ensure you have the ANTHROPIC_API_KEY in your environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function translateToSinhala(englishSubtitlePath: string) {
  try {
    // Extract videoId from the file name
    const fileName = path.basename(englishSubtitlePath);
    const videoId = fileName.split("_")[0];

    // Read the English subtitle file
    const filePath = path.join(process.cwd(), "public", englishSubtitlePath);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const transcript = JSON.parse(fileContent);

    const translatedTranscript = [];

    // Process the transcript in chunks to avoid hitting token limits
    for (let i = 0; i < transcript.length; i += 100) {
      const chunk = transcript.slice(i, i + 100);

      const textsToTranslate = chunk.map((item) => item.text).join("\n");

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        temperature: 0.5,
        system:
          "You are a professional translator specializing in English to Sinhala translations. Translate the following English subtitles to Sinhala. Maintain the original meaning and context as closely as possible. Make the translations easy to understand. Return only the translations, separated by newlines, without any additional explanations or comments.",
        messages: [
          {
            role: "user",
            content: textsToTranslate
          }
        ]
      });

      const translations = response.content[0].text.split("\n");

      for (let j = 0; j < chunk.length; j++) {
        const translatedItem = {
          ...chunk[j],
          text: translations[j] || chunk[j].text // Fallback to original text if translation is missing
        };
        translatedTranscript.push(translatedItem);
      }
    }

    // Save JSON file
    const sinhalaFileName = `${videoId}_si_sub.json`;
    const sinhalaFilePath = path.join(
      process.cwd(),
      "public",
      "subtitles",
      sinhalaFileName
    );
    await fs.writeFile(
      sinhalaFilePath,
      JSON.stringify(translatedTranscript, null, 2)
    );

    return {
      success: true,
      transcript: translatedTranscript,
      filePath: `/subtitles/${sinhalaFileName}` // Return the public path to the JSON file
    };
  } catch (error) {
    console.error("Error translating transcript:", error);
    return { success: false, error: "Failed to translate transcript" };
  }
}
