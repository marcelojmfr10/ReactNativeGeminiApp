import CustomInputBox from "@/components/chat/custom-input-box";
import NoImages from "@/components/image-generation/no-images";
import PreviousGenerationsGrid from "@/components/image-generation/previous-generation-grid";
import Slideshow from "@/components/image-generation/slide-show";
import StyleSelector from "@/components/image-generation/style-selector";
import { usePlaygroundStore } from "@/store/image-playground/image-playground.store";
import { Layout, Spinner } from "@ui-kitten/components";

const ImageGenerationScreen = () => {
  const generatedImages = usePlaygroundStore((state) => state.images);
  const imageHistory = usePlaygroundStore((state) => state.history);
  const selectedStyle = usePlaygroundStore((state) => state.selectedStyle);
  const isGenerating = usePlaygroundStore((state) => state.isGenerating);
  const selectedImage = usePlaygroundStore((state) => state.selectedImage);

  const {
    setSelectedStyle,
    generateImage,
    generateNextImage,
    setSelectedImage,
  } = usePlaygroundStore();

  return (
    <Layout style={{ flex: 1 }}>
      {generatedImages.length === 0 && !isGenerating && <NoImages />}
      {generatedImages.length === 0 && isGenerating && (
        <Layout
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spinner size="large" />
        </Layout>
      )}

      {generatedImages.length > 0 && (
        <Slideshow
          images={generatedImages}
          isGenerating={isGenerating}
          onLastImage={generateNextImage}
        />
      )}

      {/* Selector de estilos */}
      <StyleSelector
        onSelectStyle={setSelectedStyle}
        selectedStyle={selectedStyle}
      />

      <PreviousGenerationsGrid
        images={imageHistory}
        selectedImage={selectedImage}
        onSelectedImage={setSelectedImage}
      />

      <CustomInputBox onSendMessage={generateImage} />
    </Layout>
  );
};

export default ImageGenerationScreen;
