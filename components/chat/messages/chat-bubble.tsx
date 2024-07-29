"use client"
import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface ChatBubbleProps {
  messageId: string;
  message: string;
  by: "user" | "ai";

}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, messageId, by }) => {
  return (
    <div className={`w-full flex ${messageId}`}>
      <MarkdownPreview
        source={message}
        style={{
          backgroundColor: "transparent",
          color: "#fff",
          fontSize: "11px",
          textAlign: by === 'user' ? 'right' : 'left',
        }}
        wrapperElement={{
          "data-color-mode": "dark",
        }}
      />
    </div>
  );
}

export default ChatBubble;