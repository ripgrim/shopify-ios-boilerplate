import { useSanitySettings } from "@/hooks/useSanityData";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const Footer = () => {
  const { data: settings } = useSanitySettings();

  const renderLink = (link: any) => {
    let title = '';
    
    if (link._type === 'linkInternal') {
      title = link.reference?.store?.title || link.reference?.title || 'Link';
    } else if (link._type === 'linkExternal') {
      title = new URL(link.url).hostname || link.url;
    }

    return (
      <TouchableOpacity 
        key={link._id || link.url || title} 
        className="py-2"
        onPress={() => {
          console.log('Navigate to:', { type: link._type, title, link });
        }}
      >
        <Text className="text-sm text-muted-foreground">{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-background border-t border-border">
      <View className="px-4 py-6">
        <Text className="text-lg font-bold text-foreground mb-4">Shop</Text>
        
        {settings?.footer?.links && settings.footer.links.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Links</Text>
            <ScrollView>
              {settings.footer.links.map(renderLink)}
            </ScrollView>
          </View>
        )}
        
        <Text className="text-xs text-muted-foreground">
          © 2024 Shop. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}; 