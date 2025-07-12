import { useCart as useCartContext } from '../components/cart/CartProvider';
import { CartLine } from '../types/cart';

// Re-export the main useCart hook from the provider
export const useCart = useCartContext;

// Additional utility hooks for cart operations
export const useCartUtils = () => {
  const cart = useCartContext();

  // Format price utility
  const formatPrice = (amount: string, currencyCode: string, locale: string = 'en-US') => {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    });
    const numericAmount = Math.round(parseFloat(amount) * 100) / 100;
    return formatter.format(numericAmount);
  };

  // Get cart item by merchandise ID
  const getCartItem = (merchandiseId: string): CartLine | undefined => {
    return cart.lines.find(line => line.merchandise.id === merchandiseId);
  };

  // Check if item is in cart
  const isInCart = (merchandiseId: string): boolean => {
    return cart.lines.some(line => line.merchandise.id === merchandiseId);
  };

  // Get item quantity in cart
  const getItemQuantity = (merchandiseId: string): number => {
    const item = getCartItem(merchandiseId);
    return item ? item.quantity : 0;
  };

  // Calculate cart metrics
  const getCartMetrics = () => {
    const totalItems = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
    const uniqueItems = cart.lines.length;
    const isEmpty = totalItems === 0;
    const hasItems = totalItems > 0;

    return {
      totalItems,
      uniqueItems,
      isEmpty,
      hasItems,
    };
  };

  // Get cart summary
  const getCartSummary = () => {
    if (!cart.cart) return null;

    const { cost } = cart.cart;
    return {
      subtotal: formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode),
      total: formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode),
      tax: cost.totalTaxAmount ? formatPrice(cost.totalTaxAmount.amount, cost.totalTaxAmount.currencyCode) : null,
      duty: cost.totalDutyAmount ? formatPrice(cost.totalDutyAmount.amount, cost.totalDutyAmount.currencyCode) : null,
      checkoutCharge: cost.checkoutChargeAmount ? formatPrice(cost.checkoutChargeAmount.amount, cost.checkoutChargeAmount.currencyCode) : null,
    };
  };

  // Bulk operations
  const addMultipleItems = async (items: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[]) => {
    const promises = items.map(item => 
      cart.addToCart(item.merchandiseId, item.quantity, item.attributes)
    );
    const results = await Promise.allSettled(promises);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to add ${failures.length} items`);
    }
  };

  const updateMultipleItems = async (updates: { lineId: string; quantity: number }[]) => {
    const promises = updates.map(update => 
      cart.updateCartLine(update.lineId, update.quantity)
    );
    const results = await Promise.allSettled(promises);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to update ${failures.length} items`);
    }
  };

  const removeMultipleItems = async (lineIds: string[]) => {
    const promises = lineIds.map(lineId => cart.removeFromCart(lineId));
    const results = await Promise.allSettled(promises);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to remove ${failures.length} items`);
    }
  };

  // Advanced cart operations
  const incrementItem = async (merchandiseId: string, attributes?: { key: string; value: string }[]) => {
    const existingItem = getCartItem(merchandiseId);
    if (existingItem) {
      await cart.updateCartLine(existingItem.id, existingItem.quantity + 1);
    } else {
      await cart.addToCart(merchandiseId, 1, attributes);
    }
  };

  const decrementItem = async (merchandiseId: string) => {
    const existingItem = getCartItem(merchandiseId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        await cart.updateCartLine(existingItem.id, existingItem.quantity - 1);
      } else {
        await cart.removeFromCart(existingItem.id);
      }
    }
  };

  const setItemQuantity = async (merchandiseId: string, quantity: number, attributes?: { key: string; value: string }[]) => {
    const existingItem = getCartItem(merchandiseId);
    
    if (quantity <= 0) {
      if (existingItem) {
        await cart.removeFromCart(existingItem.id);
      }
      return;
    }

    if (existingItem) {
      await cart.updateCartLine(existingItem.id, quantity);
    } else {
      await cart.addToCart(merchandiseId, quantity, attributes);
    }
  };

  return {
    // Utility functions
    formatPrice,
    getCartItem,
    isInCart,
    getItemQuantity,
    getCartMetrics,
    getCartSummary,
    
    // Bulk operations
    addMultipleItems,
    updateMultipleItems,
    removeMultipleItems,
    
    // Advanced operations
    incrementItem,
    decrementItem,
    setItemQuantity,
    
    // Direct access to cart context
    ...cart,
  };
};

// Hook for cart status
export const useCartStatus = () => {
  const cart = useCartContext();
  const { getCartMetrics } = useCartUtils();

  const metrics = getCartMetrics();

  return {
    isLoading: cart.isLoading,
    isInitialized: cart.isInitialized,
    error: cart.error,
    isDrawerOpen: cart.isDrawerOpen,
    hasError: !!cart.error,
    ...metrics,
  };
};

// Hook for cart drawer
export const useCartDrawer = () => {
  const cart = useCartContext();

  return {
    isOpen: cart.isDrawerOpen,
    open: cart.openDrawer,
    close: cart.closeDrawer,
    toggle: cart.toggleDrawer,
  };
};

// Hook for cart operations only
export const useCartActions = () => {
  const cart = useCartContext();
  const { incrementItem, decrementItem, setItemQuantity } = useCartUtils();

  return {
    addToCart: cart.addToCart,
    updateCartLine: cart.updateCartLine,
    removeFromCart: cart.removeFromCart,
    clearCart: cart.clearCart,
    refreshCart: cart.refreshCart,
    clearError: cart.clearError,
    
    // Convenient methods
    incrementItem,
    decrementItem,
    setItemQuantity,
  };
};

export default useCart; 