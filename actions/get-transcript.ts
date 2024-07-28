"use server";
const getTranscript: any = require("youtube-transcript-api").getTranscript;
import getYouTubeId from "get-youtube-id";
import { subtitles } from "@/db/schema";
import db from "@/db/drizzle";

export async function getYoutubeTranscript(url: string) {
  try {
    const videoId = getYouTubeId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const transcript = await getTranscript(videoId);

    // save data in the database
    await db
      .insert(subtitles)
      .values({
        videoId,
        subtitles: transcript
      })
      .onConflictDoUpdate({
        target: subtitles.videoId,
        set: { subtitles: transcript, updatedAt: new Date() }
      });

    return { success: true, videoId };
  } catch (error) {
    console.error("Error fetching or saving transcript:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
