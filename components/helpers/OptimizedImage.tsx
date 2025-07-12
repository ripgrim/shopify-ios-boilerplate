import { optimizeShopifyImage } from "@/lib/utils";
import { Image } from "react-native";

interface OptimizedImageProps {
  url: string;
  width: number;
  height: number;
  alt?: string;
  onError?: () => void;
}

export function OptimizedImage({
  url,
  width,
  height,
  alt = "Product image",
  onError,
}: OptimizedImageProps) {
  if (!url) {
    return null;
  }

  return (
    <Image
      source={{ uri: optimizeShopifyImage(url, width, height) }}
      style={{ width, height }}
      accessibilityLabel={alt}
      onError={onError}
    />
  );
}