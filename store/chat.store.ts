import { create } from "zustand";
import { Message } from "@/types/types";

interface IChatStore {
  isChatLoading: boolean;
  setIsChatLoading: (isLoading: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  restMessages: () => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const useChatStore = create<IChatStore>((set) => ({
  isChatLoading: false,
  setIsChatLoading: (isLoading) => set({ isChatLoading: isLoading }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  restMessages: () => set({ messages: [] }),
  editMessage: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.messageId === messageId ? { ...message, content } : message
      )
    })),
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter(
        (message) => message.messageId !== messageId
      )
    }))
}));
