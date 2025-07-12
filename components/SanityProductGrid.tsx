import { SanityProductCard } from '@/components/SanityProductCard';
import { SanityProduct } from '@/types/sanity';
import { useRouter } from 'expo-router';
import React, { FC } from 'react';
import { FlatList, StyleSheet } from 'react-native';

interface SanityProductGridProps {
  products: SanityProduct[];
  onProductPress?: (product: SanityProduct) => void;
  onEndReached?: () => void;
  style?: any;
}

const SanityProductGrid: FC<SanityProductGridProps> = ({
  products,
  onProductPress,
  onEndReached,
  style,
}) => {
  const router = useRouter();

  const handleProductPress = (product: SanityProduct) => {
    if (onProductPress) {
      onProductPress(product);
    } else if (product.store.handle) {
      router.push(`/product/${product.store.handle}`);
    }
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <SanityProductCard
          product={item}
          onPress={handleProductPress}
          style={styles.productCard}
        />
      )}
      keyExtractor={(item) => item._id}
      numColumns={3}
      columnWrapperStyle={styles.row}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default SanityProductGrid; 