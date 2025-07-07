import { cn } from "@/lib/utils";
import { View } from "react-native";

export function Divider({ className }: { className?: string }) {
  return <View className={cn("h-px bg-border", className)} />;
}