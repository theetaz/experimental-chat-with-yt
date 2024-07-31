'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RiArrowUpFill, RiLoader2Line } from '@remixicon/react';
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/types';
import { useChatStore } from '@/store/chat.store';
import { saveMessage } from '@/actions/save-message';
import { generate } from '@/actions/generete';
import { readStreamableValue } from 'ai/rsc';

const ChatInput: React.FC = () => {

  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, isChatLoading, setIsChatLoading, editMessage } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  async function sendStreamRequest(userQuestion: string, sessionId: string, messageId: string) {

    let fullResponse = '';
    const { output } = await generate(userQuestion, sessionId);

    for await (const delta of readStreamableValue(output)) {
      fullResponse += delta;
      editMessage(messageId, fullResponse);
      await saveMessage(
        localStorage.getItem('sessionId')!,
        messageId,
        'ai',
        fullResponse
      )
    }
  }

  const handleSend = async () => {
    if (message.trim() === '') return;
    setIsChatLoading(true);
    scrollToBottom();

    // create a new message id
    const userMessageId = uuidv4();
    const newMessage: Message = {
      sessionId: localStorage.getItem('sessionId')!,
      messageId: userMessageId,
      by: 'user',
      content: message
    };
    addMessage(newMessage);
    setMessage('');

    // save the message to the db
    await saveMessage(
      localStorage.getItem('sessionId')!,
      userMessageId,
      'user',
      message
    )

    // send chat message to the ai get the response
    const aiMessageId = uuidv4();
    const aiMessage: Message = {
      sessionId: localStorage.getItem('sessionId')!,
      messageId: aiMessageId,
      by: 'ai',
      content: 'සෝමපාල මාමා හිතන ගමන් ...'
    };
    addMessage(aiMessage);

    sendStreamRequest(message, localStorage.getItem('sessionId')!, aiMessageId);
    setIsChatLoading(false);
    scrollToBottom();
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-1">
      <div
        className="chat-input-desktop-container"
        style={{ position: "relative" }}
      >
        <TextareaAutosize
          placeholder="සෝමපාල මාමාගෙන් අහන්න"
          className={`
          chat-input-desktop 
          text-xs sm:text-sm text-slate-800
          w-full pr-[40px] min-h-[50px]  
          border border-gray-700 focus:outline-none focus:border-gray-500 
          rounded-[20px] p-2 resize-none 
          placeholder:text-xs sm:placeholder:text-sm
        `}
          onKeyDown={handleKeyPress}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          minRows={1}
          maxRows={10}
        />
        <Button
          variant={"default"}
          className="send-button w-[30px] h-[30px] p-0 absolute right-[10px]  bottom-[17px] rounded-[20px]"
          onClick={handleSend}
        >
          {isChatLoading ? (
            <RiLoader2Line className="animate-spin h-4 w-4" />
          ) : (
            <RiArrowUpFill className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;