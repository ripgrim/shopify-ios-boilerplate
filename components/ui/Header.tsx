import { useSanitySettings } from "@/hooks/useSanityData";
import { useStore } from "@/hooks/useShopifyData";
import { useLinkHandler } from "@/lib/linkHandler";
import { router } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export const Header = () => {
    const { data: settings } = useSanitySettings();
    const { data: store } = useStore();
    const { handleLinkPress, getLinkTitle, getLinkKey } = useLinkHandler();

    const renderLink = (link: any) => {
        const title = getLinkTitle(link);
        const key = getLinkKey(link);

        return (
            <TouchableOpacity
                key={key}
                className="px-2 py-1 mr-4"
                onPress={() => handleLinkPress(link)}
            >
                <Text className="text-sm font-regular text-foreground/70">{title}</Text>
            </TouchableOpacity>
        );
    };

    const abbreviateStoreName = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const iconColor = useColorScheme() === 'dark' ? 'white' : 'black';

    console.log("menu links:", JSON.stringify(settings?.menu?.links, null, 2))

    return (
        <SafeAreaView className="bg-background border-b border-border">
            <View className="px-4 py-4">
                {/* Logo */}
                <TouchableOpacity onPress={() => router.push('/')} className="flex-row items-center gap-2 mb-3">
                    <View className="w-8 h-8 bg-primary rounded-lg justify-center items-center">
                        {useColorScheme() === 'dark' ? (
                            <Image source={require('@/assets/images/epoc.png')} className="w-8 h-8" resizeMode="contain" />
                        ) : (
                            <Image source={require('@/assets/images/epoc-light.png')} className="w-8 h-8" resizeMode="contain" />
                        )}
                        {/* <Text className="text-secondary text-sm font-bold">{abbreviateStoreName(store?.name || 'S')}</Text> */}
                    </View>
                    <Text className="text-lg font-bold text-foreground">{store?.name || 'Shop'}</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/SettingsScreen')} className="ml-auto">
                        <Text className="text-lg font-normal text-foreground/70">
                            <ShoppingCart size={24} color={iconColor} />
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Header Links - Subnavigation */}
                {settings?.menu?.links && settings.menu.links.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
                    >
                        {settings.menu.links.map(renderLink)}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};