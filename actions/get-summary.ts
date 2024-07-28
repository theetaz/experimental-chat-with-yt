"use server";

import Anthropic from "@anthropic-ai/sdk";

export async function generateSummary(ytTranscript: string) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      temperature: 0.5,
      system: `You are an AI assistant specialized in explaining complex scientific concepts to a Sinhala-speaking audience with limited English proficiency. Your task is to take an English transcript of a scientific video and provide a detailed explanation in a mix of Sinhala and English languages.
        Follow these guidelines:
        1. Read and analyze the provided English transcript carefully.
        2. Identify the main topics and key points discussed in the video.
        3. Organize the explanation into logical sections or bullet points.
        4. For each section or point:
          a. Provide a clear explanation in simple Sinhala.
          b. Use English terms where necessary, especially for scientific concepts that don't have common Sinhala equivalents.
          c. If using an English term, briefly explain it in Sinhala if possible.
        5. Ensure the explanation is more detailed and longer than a basic summary.
        6. Use examples or analogies where appropriate to make concepts more understandable.
        7. Maintain a friendly and educational tone throughout the explanation.

        Your goal is to make the content accessible and comprehensible to Sinhala speakers who may not be fluent in English or have a deep scientific background. Aim for clarity and depth in your explanation.

        Now, based on the following transcript, provide a detailed explanation as described above:
      `,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `transcript ${ytTranscript}`
            }
          ]
        }
      ]
    });

    return { success: true, summary: response };
  } catch (error) {
    console.error("Error while generating youtube summary:", error);
    return { success: false, error: "Failed to fetch transcript" };
  }
}
