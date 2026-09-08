import { promptWithFiles, type FileType } from "../helpers/prompt-with-images";

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const getImageGeneration = async (
  prompt: string,
  files: FileType[],
): Promise<ImageGenerationResponse> => {
  const response = await promptWithFiles<ImageGenerationResponse>(
    "/image-generation",
    { prompt },
    files,
  );

  return response;
};
