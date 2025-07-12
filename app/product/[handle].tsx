import MainImageSkeleton from '@/components/skeletons/productPage/mainImage';
import ThumbnailsSkeleton from '@/components/skeletons/productPage/thumbnails';
import ProductPageSkeleton from '@/components/skeletons/productPageSkeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useCartActions, useCartDrawer } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useShopifyData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { optimizeShopifyImage } from '@/lib/utils';
import { ShopifyProductVariant } from '@/types/shopify';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductPage() {
    const { handle } = useLocalSearchParams<{ handle: string }>();
    const router = useRouter();
    const { data: product, isLoading, error } = useProduct(handle || '');
    const { addToCart } = useCartActions();
    const { open: openCartDrawer } = useCartDrawer();
    const iconColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    
    // Image loading states
    const [mainImagesLoaded, setMainImagesLoaded] = useState<{ [key: string]: boolean }>({});
    const [thumbnailsLoaded, setThumbnailsLoaded] = useState<{ [key: string]: boolean }>({});

    if (isLoading) {
        return <ProductPageSkeleton onBack={() => router.back()} />;
    }

    if (error || !product) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-destructive text-center mb-4">Product not found</Text>
                    <Button onPress={() => router.back()} variant="outline">
                        <Text className="text-foreground">Go Back</Text>
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    const images = product.images.edges.map(edge => edge.node);
    const variants = product.variants.edges.map(edge => edge.node);
    const currentImage = images[selectedImageIndex];

    // Get current pricing and availability
    const currentVariant = selectedVariant || variants[0];
    const currentPrice = currentVariant?.price || product.priceRange.minVariantPrice;
    const currentAvailability = currentVariant?.availableForSale ?? product.availableForSale;
    const currentStock = currentVariant?.quantityAvailable || product.totalInventory;

    const handleVariantChange = (variantId: string) => {
        const variant = variants.find(v => v.id === variantId);
        if (variant) {
            setSelectedVariant(variant);
            // Update image if variant has its own image
            if (variant.image) {
                const imageIndex = images.findIndex(img => img.id === variant.image?.id);
                if (imageIndex !== -1) {
                    setSelectedImageIndex(imageIndex);
                }
            }
        }
    };

    const handleAddToCart = async () => {
        if (!currentVariant || !currentAvailability) {
            return;
        }

        try {
            setIsAddingToCart(true);
            await addToCart(currentVariant.id, 1);
            openCartDrawer();
            
            // // Show success message and open cart drawer
            // Alert.alert(
            //     'Added to Cart',
            //     `${product.title} has been added to your cart.`,
            //     [
            //         { text: 'Continue Shopping', style: 'cancel' },
            //         { text: 'View Cart', onPress: openCartDrawer }
            //     ]
            // );
        } catch (error) {
            console.error('Failed to add to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const formatPrice = (price: { amount: string; currencyCode: string }) => {
        return `${price.currencyCode} ${price.amount}`;
    };

    const handleMainImageLoad = (imageId: string) => {
        setMainImagesLoaded(prev => ({ ...prev, [imageId]: true }));
    };

    const handleThumbnailLoad = (imageId: string) => {
        setThumbnailsLoaded(prev => ({ ...prev, [imageId]: true }));
    };

    const allThumbnailsLoaded = images.length > 0 && Object.keys(thumbnailsLoaded).length === images.length;
    const currentMainImageLoaded = currentImage ? mainImagesLoaded[currentImage.id] : false;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
            <View className="px-6 py-4 bg-background">
                <View className="flex-row items-center justify-between">
                    <Button onPress={() => router.back()} variant="ghost" size="icon">
                        <ArrowLeft size={18} color={iconColor} />
                    </Button>
                    <View className="w-10" />
                </View>
            </View>
            <ScrollView className="flex-1">
                {/* Product Details */}
                <View className="px-6 py-4">
                    {/* Product Images */}
                    {images.length > 0 && (
                        <View className="mb-6">
                            <View className="relative h-96 w-full">
                                {!currentMainImageLoaded && <MainImageSkeleton />}
                                <Image
                                    source={{ uri: optimizeShopifyImage(currentImage.url, 600, 600) }}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        opacity: currentMainImageLoaded ? 1 : 0
                                    }}
                                    className="rounded-xl absolute"
                                    resizeMode="contain"
                                    onLoad={() => handleMainImageLoad(currentImage.id)}
                                />
                            </View>
                            {images.length > 1 && (
                                <View>
                                    {!allThumbnailsLoaded && <ThumbnailsSkeleton />}
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        className="mt-4 w-full"
                                        style={{ 
                                            opacity: allThumbnailsLoaded ? 1 : 0,
                                            position: allThumbnailsLoaded ? 'relative' : 'absolute'
                                        }}
                                    >
                                        {images.map((image, index) => (
                                            <Button
                                                key={image.id}
                                                onPress={() => {
                                                    setSelectedImageIndex(index);
                                                }}
                                                variant="ghost"
                                                className={`mr-2 p-0 w-24 h-24 aspect-square rounded-lg border-2 relative ${index === selectedImageIndex ? 'border-primary' : 'border-border'
                                                    }`}
                                            >
                                                {!thumbnailsLoaded[image.id] && (
                                                    <Skeleton className="w-24 h-24 rounded-lg absolute" />
                                                )}
                                                <Image
                                                    source={{ uri: optimizeShopifyImage(image.url, 128, 128) }}
                                                    className="rounded-lg p-2 w-24 h-24 aspect-square"
                                                    style={{
                                                        opacity: thumbnailsLoaded[image.id] ? 1 : 0
                                                    }}
                                                    resizeMode="cover"
                                                    onLoad={() => handleThumbnailLoad(image.id)}
                                                />
                                            </Button>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Product Title, Vendor, Price, and Variant */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-foreground mb-2">
                            {product.title}
                        </Text>
                        <Text className="text-lg font-medium text-muted-foreground mb-4">
                            {product.vendor}
                        </Text>
                        <Text className="text-2xl font-semibold text-primary mb-4">
                            {formatPrice(currentPrice)}
                        </Text>

                        {variants.length > 1 && (
                            <View className="mb-4">
                                <Text className="text-lg font-medium text-foreground mb-2">Variant</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {variants.map(variant => {
                                        const selected = (currentVariant?.id === variant.id);
                                        return (
                                            <TouchableOpacity
                                                key={variant.id}
                                                onPress={() => handleVariantChange(variant.id)}
                                                className={`px-4 py-3 rounded-lg border text-base font-medium ${selected ? 'bg-primary border-primary text-background' : 'bg-background border-border text-foreground'}`}
                                                style={{ alignItems: 'center', marginBottom: 8 }}
                                            >
                                                <Text className={`${selected ? 'text-background' : 'text-foreground'}`}>{variant.title}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Product Availability */}
                        <View className="flex-row items-center mb-4">
                            <Star size={16} color="#FFA500" className="mr-2" />
                            <Text className="text-muted-foreground">
                                {currentAvailability ? `In Stock (${currentStock} available)` : 'Out of Stock'}
                            </Text>
                        </View>
                    </View>

                    {/* Product Description */}
                    {product.description && (
                        <View className="mb-6">
                            <Text className="text-xl font-bold text-foreground mb-3">
                                Description
                            </Text>
                            <Text className="text-base font-medium text-muted-foreground leading-6">
                                {product.description}
                            </Text>
                        </View>
                    )}

                    {/* Product Tags */}
                    {product.tags.length > 0 && (
                        <View className="mb-6">
                            <Text className="text-xl font-semibold text-foreground mb-3">
                                Tags
                            </Text>
                            <View className="flex-row flex-wrap">
                                {product.tags.map((tag, index) => (
                                    <View key={index} className="bg-muted rounded-full px-3 py-1 mr-2 mb-2">
                                        <Text className="text-muted-foreground text-sm">{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
            {/* Add to Cart Button */}
            <View className="px-6 py-4 bg-background border-t border-border">
                <Button
                    onPress={handleAddToCart}
                    disabled={!currentAvailability || isAddingToCart}
                    className="flex-row items-center justify-center py-6 px-4 rounded-xl gap-2"
                    variant={currentAvailability ? "default" : "secondary"}
                >
                    {isAddingToCart ? (
                        <>
                            <ActivityIndicator size="small" color={backgroundColor} className="mr-3" />
                            <Text className="text-background font-bold text-lg">
                                Adding to Cart...
                            </Text>
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={15} color={backgroundColor} className="mr-3" />
                            <Text className="text-background font-bold text-lg">
                                {currentAvailability ? 'Add to Cart' : 'Out of Stock'}
                            </Text>
                        </>
                    )}
                </Button>
            </View>
        </SafeAreaView>
    );
} 