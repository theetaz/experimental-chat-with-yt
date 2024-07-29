import ChatInput from "@/components/chat/messages/chat-input";
import ChatHistory from "@/components/chat/messages/chat-history";
export default function Chat() {
  return (
    <main className="mt-5 px-2">
      <ChatHistory />
      <ChatInput />
    </main>
  );
}
