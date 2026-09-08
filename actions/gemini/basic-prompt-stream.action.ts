import { fetch } from "expo/fetch";
import { promptWithFiles, type FileType } from "../helpers/prompt-with-images";

const API_URL = process.env.EXPO_PUBLIC_GEMINI_API_URL;

export const getBasicPromptStream = async (
  prompt: string,
  files: FileType[],
  onChunk: (text: string) => void,
) => {
  if (files.length > 0) {
    const response = await promptWithFiles<string>(
      "/basic-prompt-stream",
      { prompt },
      files,
    );

    onChunk(response);
    return;
  }

  const formData = new FormData();
  formData.append("prompt", prompt);

  try {
    const response = await fetch(`${API_URL}/basic-prompt-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "plain/text",
      },
      // body: JSON.stringify({ prompt }),
      body: formData,
    });

    if (!response.body) {
      throw new Error(`Theres not body in the response`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      result += chunk;
      onChunk(result);
    }
  } catch (error) {
    console.error(error);
    throw "Unexpected error happened";
  }
};
