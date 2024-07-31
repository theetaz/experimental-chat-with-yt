"use server";

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createStreamableValue } from "ai/rsc";
import { messages } from "@/db/schema";
import db from "@/db/drizzle";
import { eq, desc } from "drizzle-orm";

// export const maxDuration = 30;

export async function generate(userQuestion: string, sessionId: string) {
  const stream = createStreamableValue("");

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, sessionId))
    .orderBy(desc(messages.createdAt))
    .limit(20);

  (async () => {
    const { textStream } = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
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
      // prompt: `question: ${userQuestion} history: ${JSON.stringify(history)}`
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
