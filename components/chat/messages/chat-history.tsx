"use client"
import React from "react";
import { useChatStore } from "@/store/chat.store";
import ChatBubble from "@/components/chat/messages/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatHistory: React.FC = () => {

  const { messages } = useChatStore();

  return (
    <div className="w-full p-2">
      <ScrollArea className="h-[calc(100vh-100px)]">
        {messages.map((message) => (
          <div key={message.messageId} className={`flex ${message.by === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-1 ${message.by === 'user' ? 'bg-blue-900/80' : 'bg-green-900/80'} rounded-[20px] shadow-md my-1`}>
              <ChatBubble
                message={message.content}
                messageId={message.messageId}
                by={message.by}
              />
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default ChatHistory;