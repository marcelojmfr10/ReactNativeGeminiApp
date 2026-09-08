import * as GeminiActions from "@/actions/gemini";
import { FileType } from "@/actions/helpers/prompt-with-images";
import { urlToImageFile } from "@/actions/helpers/url-to-image-file";
import { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

interface ImagePlaygroundState {
  isGenerating: boolean;
  images: string[];
  history: string[];

  previousPrompt: string;
  previousImages: (FileType | ImagePickerAsset)[];
  selectedStyle: string;
  selectedImage: string;

  generateImage: (
    prompt: string,
    images: (FileType | ImagePickerAsset)[],
  ) => Promise<void>;
  generateNextImage: () => Promise<void>;
  setSelectedStyle: (style: string) => void;
  setSelectedImage: (imageUrl: string) => void;
}

export const usePlaygroundStore = create<ImagePlaygroundState>()(
  (set, get) => ({
    isGenerating: false,
    images: [],
    history: [],

    previousPrompt: "",
    previousImages: [],
    selectedStyle: "",
    selectedImage: "",

    generateImage: async (
      prompt: string,
      images: (FileType | ImagePickerAsset)[],
    ): Promise<void> => {
      const selectedStyle = get().selectedStyle;
      const selectedImage = get().selectedImage;

      set({
        isGenerating: true,
        images: [],
        previousPrompt: prompt,
        previousImages: images,
      });

      if (selectedStyle !== "") {
        prompt = `${prompt} con un estilo ${selectedStyle}`;
      }

      if (selectedImage !== "") {
        const imageFile = await urlToImageFile(selectedImage);
        images.push(imageFile);
      }

      const { imageUrl } = await GeminiActions.getImageGeneration(
        prompt,
        images,
      );

      if (imageUrl === "") {
        set({
          isGenerating: false,
        });
        return;
      }

      const currentImages = [imageUrl, ...get().images];
      set({
        isGenerating: false,
        images: [imageUrl],
        history: currentImages,
      });

      setTimeout(() => {
        get().generateNextImage();
      }, 500);
    },
    generateNextImage: async (): Promise<void> => {
      const currentImages = get().images;
      const currentHistory = get().history;
      let previousPrompt = get().previousPrompt;
      const previousImages = get().previousImages;
      const selectedStyle = get().selectedStyle;

      if (selectedStyle !== "") {
        previousPrompt = `${previousPrompt} con un estilo ${selectedStyle}`;
      }

      set({
        isGenerating: true,
      });

      const { imageUrl } = await GeminiActions.getImageGeneration(
        previousPrompt,
        previousImages,
      );

      if (imageUrl === "") {
        set({
          isGenerating: false,
        });
        return;
      }

      set({
        isGenerating: false,
        images: [...currentImages, imageUrl],
        history: [imageUrl, ...currentHistory],
      });
    },
    setSelectedStyle: (style: string) => {
      if (style === get().selectedStyle) {
        set({ selectedStyle: "" });
        return;
      }

      set({
        selectedStyle: style,
      });
    },
    setSelectedImage: (imageUrl: string) => {
      if (imageUrl === get().selectedImage) {
        set({ selectedImage: "" });
        return;
      }

      set({
        selectedImage: imageUrl,
      });
    },
  }),
);
