"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function getChatResponse(userQuestion: string, sessionId: string) {
  try {
    // TODO: Implement the conversation with Claude using session id get the chat history
    const response = (await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are an AI assistant that can answer questions about any topic simple and easy to understand manner.
               The user may ask questions in a mix of Sinhala and English.
               Respond in a similar mix of Sinhala and English, favoring Sinhala for common words and phrases,
               and using English for technical terms or concepts that are typically expressed in English.
               IMPORTANT when answering the questions, always please use sinhala language and combination with english terms
               and keep the answers simple and easy to understand for sinhala audience. and use markdown for better readability.`,
      messages: [
        {
          role: "user",
          content: `question: ${userQuestion}`
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
