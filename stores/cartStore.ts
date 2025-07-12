import { NetworkError } from '@/hooks/useNetworkStatus';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import cartApiService from '../services/cartApi';
import {
  CartAttributesUpdateInput,
  CartBuyerIdentityUpdateInput,
  CartCreateInput,
  CartLine,
  ShopifyCart
} from '../types/cart';

const storage = new MMKV();
const CART_STORAGE_KEY = 'shopify_cart_id';

interface CartState {
  // State
  cart: ShopifyCart | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  
  // Computed getters
  totalQuantity: number;
  totalAmount: string;
  currencyCode: string;
  lines: CartLine[];
  appliedDiscountCodes: string[];
  discountSavings: string;
  
  // Actions
  initializeCart: () => Promise<void>;
  createCart: (input?: CartCreateInput) => Promise<void>;
  addToCart: (merchandiseId: string, quantity: number, attributes?: { key: string; value: string }[]) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateBuyerIdentity: (buyerIdentity: CartBuyerIdentityUpdateInput['buyerIdentity']) => Promise<void>;
  updateCartAttributes: (attributes: CartAttributesUpdateInput['attributes']) => Promise<void>;
  updateDiscountCodes: (discountCodes: string[]) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<void>;
  removeDiscountCode: (code: string) => Promise<void>;
  clearDiscountCodes: () => Promise<void>;
  updateCartNote: (note: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clearError: () => void;
  preloadCheckout: () => void;
  handleError: (error: unknown, defaultMessage: string) => string;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  cart: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isDrawerOpen: false,
  
  // Computed getters
  get totalQuantity() {
    const state = get();
    return state.cart?.totalQuantity || 0;
  },
  
  get totalAmount() {
    const state = get();
    return state.cart?.cost?.totalAmount?.amount || '0.00';
  },
  
  get currencyCode() {
    const state = get();
    return state.cart?.cost?.totalAmount?.currencyCode || 'USD';
  },
  
  get lines() {
    const state = get();
    return state.cart?.lines?.edges?.map(edge => edge.node) || [];
  },

  get appliedDiscountCodes() {
    const state = get();
    console.log('Debug - Cart discount codes:', state.cart?.discountCodes);
    return state.cart?.discountCodes?.filter(dc => dc.applicable).map(dc => dc.code) || [];
  },

  get discountSavings() {
    const state = get();
    if (!state.cart?.discountAllocations?.length) return '0.00';
    
    const totalSavings = state.cart.discountAllocations.reduce((sum, allocation) => {
      return sum + parseFloat(allocation.discountedAmount.amount);
    }, 0);
    
    return totalSavings.toFixed(2);
  },

  // Helper method to handle errors consistently
  handleError: (error: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    
    if (error instanceof NetworkError) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    set({ 
      error: errorMessage,
      isLoading: false 
    });
    
    return errorMessage;
  },

  // Actions
  initializeCart: async () => {
    const currentState = get();
    if (currentState.isInitialized) return;
    
    try {
      set({ isLoading: true, error: null });
      
      // Try to load cart ID from storage
      const cartId = storage.getString(CART_STORAGE_KEY);
      
      if (cartId) {
        // If we have a cart ID, try to fetch the cart
        await get().refreshCart();
      } else {
        // If no cart ID, create a new cart
        await get().createCart();
      }
      
      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('Cart initialization error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Cart initialization failed',
        isLoading: false,
        isInitialized: true 
      });
    }
  },

  createCart: async (input?: CartCreateInput) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use the cart API service to create a new cart
      const newCart = await cartApiService.createCart(input || {});
      
      // Store cart ID
      storage.set(CART_STORAGE_KEY, newCart.id);
      
      set({ cart: newCart, isLoading: false });
    } catch (error) {
      console.error('Create cart error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create cart',
        isLoading: false 
      });
      throw error;
    }
  },

  addToCart: async (merchandiseId: string, quantity: number, attributes?: { key: string; value: string }[]) => {
    try {
      set({ isLoading: true, error: null });
      
      let currentState = get();
      
      // If no cart exists, create one first
      if (!currentState.cart) {
        await get().createCart();
        // Get fresh state after creating cart
        currentState = get();
      }
      
      // Use the cart API service to add items
      const updatedCart = await cartApiService.addCartLines({
        cartId: currentState.cart!.id,
        lines: [{
          merchandiseId,
          quantity,
          attributes: attributes || []
        }]
      });
      
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error('Add to cart error:', error);
      const errorMessage = get().handleError(error, 'Failed to add item to cart');
      throw new Error(errorMessage);
    }
  },

  updateCartLine: async (lineId: string, quantity: number) => {
    const currentState = get();
    if (!currentState.cart) {
      throw new Error('No cart available');
    }

    // Optimistic update - update UI immediately
    const optimisticCart = {
      ...currentState.cart,
      lines: {
        ...currentState.cart.lines,
        edges: currentState.cart.lines.edges.map(edge => 
          edge.node.id === lineId 
            ? {
                ...edge,
                node: {
                  ...edge.node,
                  quantity,
                  cost: {
                    ...edge.node.cost,
                    totalAmount: {
                      ...edge.node.cost.totalAmount,
                      amount: (parseFloat(edge.node.cost.amountPerQuantity.amount) * quantity).toString()
                    }
                  }
                }
              }
            : edge
        )
      }
    };

    // Calculate new total quantity
    const newTotalQuantity = optimisticCart.lines.edges.reduce((sum, edge) => sum + edge.node.quantity, 0);
    optimisticCart.totalQuantity = newTotalQuantity;

    // Update state optimistically
    set({ cart: optimisticCart, error: null });

    try {
      // Update server in background
      const updatedCart = await cartApiService.updateCartLines({
        cartId: currentState.cart.id,
        lines: [{
          id: lineId,
          quantity
        }]
      });
      
      // Only update if the response is different (to avoid unnecessary re-renders)
      set({ cart: updatedCart });
    } catch (error) {
      console.error('Update cart line error:', error);
      // Revert optimistic update on error
      set({ 
        cart: currentState.cart,
        error: error instanceof Error ? error.message : 'Failed to update cart line'
      });
      throw error;
    }
  },

  removeFromCart: async (lineId: string) => {
    const currentState = get();
    if (!currentState.cart) {
      throw new Error('No cart available');
    }

    // Optimistic update - remove item immediately
    const optimisticCart = {
      ...currentState.cart,
      lines: {
        ...currentState.cart.lines,
        edges: currentState.cart.lines.edges.filter(edge => edge.node.id !== lineId)
      }
    };

    // Calculate new total quantity
    const newTotalQuantity = optimisticCart.lines.edges.reduce((sum, edge) => sum + edge.node.quantity, 0);
    optimisticCart.totalQuantity = newTotalQuantity;

    // Update state optimistically
    set({ cart: optimisticCart, error: null });

    try {
      // Update server in background
      const updatedCart = await cartApiService.removeCartLines({
        cartId: currentState.cart.id,
        lineIds: [lineId]
      });
      
      set({ cart: updatedCart });
    } catch (error) {
      console.error('Remove from cart error:', error);
      // Revert optimistic update on error
      set({ 
        cart: currentState.cart,
        error: error instanceof Error ? error.message : 'Failed to remove from cart'
      });
      throw error;
    }
  },

  updateBuyerIdentity: async (buyerIdentity) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentState = get();
      if (!currentState.cart) {
        throw new Error('No cart available');
      }
      
      // Use the cart API service to update buyer identity
      const updatedCart = await cartApiService.updateCartBuyerIdentity({
        cartId: currentState.cart.id,
        buyerIdentity
      });
      
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error('Update buyer identity error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update buyer identity',
        isLoading: false 
      });
      throw error;
    }
  },

  updateCartAttributes: async (attributes) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentState = get();
      if (!currentState.cart) {
        throw new Error('No cart available');
      }
      
      // Use the cart API service to update cart attributes
      const updatedCart = await cartApiService.updateCartAttributes({
        cartId: currentState.cart.id,
        attributes
      });
      
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error('Update cart attributes error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update cart attributes',
        isLoading: false 
      });
      throw error;
    }
  },

  updateDiscountCodes: async (discountCodes) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentState = get();
      if (!currentState.cart) {
        throw new Error('No cart available');
      }
      
      // Use the cart API service to update discount codes
      const updatedCart = await cartApiService.updateCartDiscountCodes({
        cartId: currentState.cart.id,
        discountCodes
      });
      
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error('Update discount codes error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update discount codes',
        isLoading: false 
      });
      throw error;
    }
  },

  applyDiscountCode: async (code: string) => {
    const currentState = get();
    const trimmedCode = code.trim().toUpperCase();
    
    if (!trimmedCode) {
      throw new Error('Please enter a discount code');
    }
    
    if (!currentState.cart) {
      throw new Error('No cart available');
    }
    
    // Check if code is already applied
    const existingCodes = currentState.cart.discountCodes?.map(dc => dc.code.toUpperCase()) || [];
    if (existingCodes.includes(trimmedCode)) {
      throw new Error('This discount code is already applied');
    }
    
    // Add the new code to existing codes
    const newDiscountCodes = [...existingCodes, trimmedCode];
    
    try {
      await get().updateDiscountCodes(newDiscountCodes);
    } catch (error) {
      // Check if it's a user error about invalid code
      if (error instanceof Error && error.message.includes('discount')) {
        throw new Error('Invalid discount code');
      }
      throw error;
    }
  },

  removeDiscountCode: async (code: string) => {
    const currentState = get();
    if (!currentState.cart) {
      throw new Error('No cart available');
    }
    
    const existingCodes = currentState.cart.discountCodes?.map(dc => dc.code) || [];
    const filteredCodes = existingCodes.filter(existingCode => 
      existingCode.toUpperCase() !== code.toUpperCase()
    );
    
    await get().updateDiscountCodes(filteredCodes);
  },

  clearDiscountCodes: async () => {
    await get().updateDiscountCodes([]);
  },

  updateCartNote: async (note) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentState = get();
      if (!currentState.cart) {
        throw new Error('No cart available');
      }
      
      // Use the cart API service to update cart note
      const updatedCart = await cartApiService.updateCartNote({
        cartId: currentState.cart.id,
        note
      });
      
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error('Update cart note error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update cart note',
        isLoading: false 
      });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Clear cart from storage
      storage.delete(CART_STORAGE_KEY);
      
      // Create new empty cart
      await get().createCart();
        
      set({ isLoading: false });
    } catch (error) {
      console.error('Clear cart error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear cart',
        isLoading: false 
      });
      throw error;
    }
  },

  refreshCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const cartId = storage.getString(CART_STORAGE_KEY);
      
      if (!cartId) {
        await get().createCart();
        return;
      }
      
      // Use the cart API service to fetch cart
      const cart = await cartApiService.getCart(cartId);
      
      if (cart) {
        set({ cart, isLoading: false });
      } else {
        // If cart doesn't exist, create a new one
        await get().createCart();
      }
    } catch (error) {
      console.error('Refresh cart error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh cart',
        isLoading: false 
      });
      throw error;
    }
  },

  openDrawer: () => {
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false });
  },

  toggleDrawer: () => {
    const currentState = get();
    set({ isDrawerOpen: !currentState.isDrawerOpen });
  },

  clearError: () => {
    set({ error: null });
  },

  // Preload checkout when cart is updated
  preloadCheckout: () => {
    const state = get();
    if (state.cart?.checkoutUrl) {
      // Note: This requires the checkout sheet to be available in the component context
      // We'll trigger preload from the component level instead
      console.log('Cart ready for checkout preload:', state.cart.checkoutUrl);
    }
  },
})); 