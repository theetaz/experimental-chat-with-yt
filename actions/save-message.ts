"use server";
import { messages } from "@/db/schema";
import db from "@/db/drizzle";

export async function saveMessage(
  sessionId: string,
  messageId: string,
  userType: string,
  message: string
) {
  try {
    const result = await db.insert(messages).values({
      sessionId: sessionId,
      messageId: messageId,
      userType: userType,
      message: message
    });

    return { success: true, result };
  } catch (error) {
    console.error("Error saving message to database:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
