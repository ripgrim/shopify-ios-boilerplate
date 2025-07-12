import { optimizeShopifyImage } from "@/lib/utils";
import { Image } from "react-native";

export function OptimizedImage({ url, width, height }: { url: string, width: number, height: number }) {
    return <Image source={{ uri: optimizeShopifyImage(url, width, height) }} style={{ width, height }} />;
}