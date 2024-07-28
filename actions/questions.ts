"use server";

import Anthropic from "@anthropic-ai/sdk";
import { subtitles } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import getYouTubeId from "get-youtube-id";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

interface SubtitleItem {
  text: string;
  start: number;
  duration: number;
}

export async function videoConversation(
  videoUrl: string,
  userQuestion: string
) {
  try {
    const videoId = getYouTubeId(videoUrl);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Fetch subtitle data from the database
    const subtitleData = await db
      .select()
      .from(subtitles)
      .where(eq(subtitles.videoId, videoId))
      .limit(1);

    if (subtitleData.length === 0) {
      throw new Error("Subtitle data not found for this video");
    }

    const transcript: SubtitleItem[] = subtitleData[0]
      .subtitles as SubtitleItem[];

    // Prepare the context from the transcript
    const context = transcript.map((item) => item.text).join(" ");

    // Create the conversation with Claude
    const response = (await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are an AI assistant that can answer questions about a video based on its transcript.
               The user may ask questions in a mix of Sinhala and English.
               Respond in a similar mix of Sinhala and English, favoring Sinhala for common words and phrases,
               and using English for technical terms or concepts that are typically expressed in English.
               Base your answers solely on the information provided in the transcript.
               If the answer is not in the transcript, politely say so.
               If user asked more questions and explanations please provide the answers based on entire knowledge not only the transcript
               IMPORTANT when answering the questions, always please use sinhala language and combination with english terms
               and keep the answers simple and easy to understand for sinhala audience.`,
      messages: [
        {
          role: "user",
          content: `Here's the transcript of the video:\n\n${context}\n\nNow, please answer this question: ${userQuestion}`
        }
      ]
    })) as any;

    return {
      success: true,
      answer: response.content[0].text
    };
  } catch (error) {
    console.error("Error in video conversation:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to process the conversation" };
  }
}
