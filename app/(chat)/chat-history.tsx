import { Layout } from "@ui-kitten/components";

import { ChatMessages } from "@/components/chat/chat-messages";
import CustomInputBox from "@/components/chat/custom-input-box";
import { useChatContextStore } from "@/store/chat-context/chat-context.store";

const ChatHistoryScreen = () => {
  const messages = useChatContextStore((state) => state.messages);
  const isGeminiWriting = useChatContextStore((state) => state.geminiWriting);
  const { addMessage } = useChatContextStore();

  return (
    <Layout style={{ flex: 1 }}>
      <ChatMessages messages={messages} isGeminiWriting={isGeminiWriting} />

      <CustomInputBox
        onSendMessage={() => {
          addMessage;
        }}
      />
    </Layout>
  );
};

export default ChatHistoryScreen;
