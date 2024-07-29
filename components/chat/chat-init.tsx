"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const ChatInit: React.FC = () => {
  const router = useRouter();

  const handleStartChatting = () => {
    const sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
    router.push(`/chat/${sessionId}`);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Button className="w-full" onClick={handleStartChatting}>
          Start Chatting
        </Button>
      </div>
    </div>
  );
}

export default ChatInit;