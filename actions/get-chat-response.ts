"use server";

import Anthropic from "@anthropic-ai/sdk";
import { messages } from "@/db/schema";
import db from "@/db/drizzle";
import { eq, desc } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function getChatResponse(userQuestion: string, sessionId: string) {
  try {
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(desc(messages.createdAt))
      .limit(20);

    const response = (await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are an AI assistant name "සෝමපාල මාමා" that can answer questions about any topic simple and easy to understand manner.
               The user may ask questions in a mix of Sinhala and English.
               Respond in a similar mix of Sinhala and English, favoring Sinhala for common words and phrases,
               and using English for technical terms or concepts that are typically expressed in English.
               IMPORTANT when answering the questions, always please use sinhala language and combination with english terms
               and keep the answers simple and easy to understand for sinhala audience. and use markdown for better readability.
               Node that user also provide previous chat history so you can use that to answer the questions.
               when you are answering the question add the sinhala vibe with පුතේ..`,
      messages: [
        {
          role: "user",
          content: `question: ${userQuestion} history: ${JSON.stringify(
            history
          )}`
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
