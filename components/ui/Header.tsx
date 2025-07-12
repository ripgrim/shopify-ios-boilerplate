import { Text } from "@/components/ui/text";
import { useCartDrawer, useCartStatus } from "@/hooks/useCart";
import { useSanitySettings } from "@/hooks/useSanityData";
import { useStore } from "@/hooks/useShopifyData";
import { useLinkHandler } from "@/lib/linkHandler";
import { router } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { Image, SafeAreaView, ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";

export const Header = () => {
    const { data: settings } = useSanitySettings();
    const { data: store } = useStore();
    const { handleLinkPress, getLinkTitle, getLinkKey } = useLinkHandler();
    const { toggle: toggleCartDrawer } = useCartDrawer();
    const { totalItems } = useCartStatus();

    const renderLink = (link: any) => {
        const title = getLinkTitle(link);
        const key = getLinkKey(link);

        return (
            <TouchableOpacity
                key={key}
                className="px-2 py-1 mr-4"
                onPress={() => handleLinkPress(link)}
            >
                <Text className="text-md font-regular text-foreground/70">{title}</Text>
            </TouchableOpacity>
        );
    };

    const abbreviateStoreName = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const iconColor = useColorScheme() === 'dark' ? 'white' : 'black';

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
                    
                    {/* Cart Icon with Badge */}
                    <TouchableOpacity onPress={toggleCartDrawer} className="ml-auto relative">
                        <View className="relative">
                            <ShoppingCart size={24} color={iconColor} />
                            {totalItems > 0 && (
                                <View className="absolute -top-2 -right-2 bg-primary rounded-full min-w-[20px] h-5 justify-center items-center">
                                    <Text className="text-primary-foreground text-xs font-bold">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </Text>
                                </View>
                            )}
                        </View>
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