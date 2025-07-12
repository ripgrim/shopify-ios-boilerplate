import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { CartLine, ShopifyCart } from '../../types/cart';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  totalQuantity: number;
  totalAmount: string;
  currencyCode: string;
  lines: CartLine[];
  appliedDiscountCodes: string[];
  discountSavings: string;
  checkoutUrl: string | null;
  
  // Actions
  addToCart: (merchandiseId: string, quantity: number, attributes?: { key: string; value: string }[]) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartStore = useCartStore();

  // Initialize cart on mount
  useEffect(() => {
    if (!cartStore.isInitialized) {
      cartStore.initializeCart();
    }
  }, []);

  // Calculate derived values from cart state
  const lines = cartStore.cart?.lines?.edges?.map(edge => edge.node) || [];
  const totalQuantity = cartStore.cart?.totalQuantity || 0;
  const totalAmount = cartStore.cart?.cost?.totalAmount?.amount || '0.00';
  const currencyCode = cartStore.cart?.cost?.totalAmount?.currencyCode || 'USD';
  const appliedDiscountCodes = cartStore.appliedDiscountCodes;
  const discountSavings = cartStore.discountSavings;
  const checkoutUrl = cartStore.cart?.checkoutUrl || null;

  const contextValue: CartContextType = {
    cart: cartStore.cart,
    isLoading: cartStore.isLoading,
    isInitialized: cartStore.isInitialized,
    error: cartStore.error,
    isDrawerOpen: cartStore.isDrawerOpen,
    totalQuantity: cartStore.totalQuantity,
    totalAmount: cartStore.totalAmount,
    currencyCode: cartStore.currencyCode,
    lines: cartStore.lines,
    appliedDiscountCodes: cartStore.appliedDiscountCodes,
    discountSavings: cartStore.discountSavings,
    checkoutUrl,
    
    // Actions
    addToCart: cartStore.addToCart,
    updateCartLine: cartStore.updateCartLine,
    removeFromCart: cartStore.removeFromCart,
    clearCart: cartStore.clearCart,
    refreshCart: cartStore.refreshCart,
    openDrawer: cartStore.openDrawer,
    closeDrawer: cartStore.closeDrawer,
    toggleDrawer: cartStore.toggleDrawer,
    clearError: cartStore.clearError,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider; 