export type Message = {
  sessionId: string;
  messageId: string;
  by: "user" | "ai";
  content: string;
};
