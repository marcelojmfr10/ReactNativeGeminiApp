import { ChatMessages } from "@/components/chat/chat-messages";
import CustomInputBox from "@/components/chat/custom-input-box";
import { useBasicPromptStore } from "@/store/basic-prompt/basic-prompt.store";
import { Layout } from "@ui-kitten/components";

const BasicPromptScreen = () => {
  const messages = useBasicPromptStore((state) => state.messages);
  const isGeminiWriting = useBasicPromptStore((state) => state.geminiWriting);
  const { addMessage } = useBasicPromptStore();
  return (
    <Layout style={{ flex: 1 }}>
      <ChatMessages messages={messages} isGeminiWriting={isGeminiWriting} />

      <CustomInputBox
        onSendMessage={(message, attachments) => {
          addMessage(message);
        }}
      />
    </Layout>
  );
};

export default BasicPromptScreen;
