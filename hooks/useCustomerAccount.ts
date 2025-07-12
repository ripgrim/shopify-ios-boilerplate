import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CREATE_ADDRESS_MUTATION, CUSTOMER_ADDRESSES_QUERY, CUSTOMER_ORDERS_QUERY, CUSTOMER_QUERY, customerAccountApi, DELETE_ADDRESS_MUTATION, UPDATE_ADDRESS_MUTATION, UPDATE_CUSTOMER_MUTATION } from '../services/customerAccountApi';
import { useAuthStore } from '../stores/authStore';

// Query Keys
export const customerAccountKeys = {
  all: ['customerAccount'] as const,
  customer: () => [...customerAccountKeys.all, 'customer'] as const,
  addresses: () => [...customerAccountKeys.all, 'addresses'] as const,
  orders: () => [...customerAccountKeys.all, 'orders'] as const,
} as const;

// Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailAddress: {
    emailAddress: string;
  };
  phoneNumber?: {
    phoneNumber: string;
  };
  dateOfBirth?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: Array<{
      id: string;
      title: string;
      quantity: number;
      variant: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        image?: {
          url: string;
          altText?: string;
        };
      };
    }>;
  };
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}

export interface CustomerAddressInput {
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

// Customer Query Hook
export const useCustomer = () => {
  const { isAuthenticated } = useAuthStore();
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: customerAccountKeys.customer(),
    queryFn: async () => {
      console.log('Fetching customer data...');
      try {
        const data = await customerAccountApi.query(CUSTOMER_QUERY);
        console.log('Customer API response:', data);
        
        // Update auth store with user data
        if (data.customer) {
          setUser({
            id: data.customer.id,
            email: data.customer.emailAddress.emailAddress,
            firstName: data.customer.firstName,
            lastName: data.customer.lastName,
            displayName: data.customer.displayName,
          });
          console.log('Customer data fetched successfully:', data.customer);
        } else {
          console.log('No customer data in response');
        }
        
        return data.customer as Customer;
      } catch (error) {
        console.error('Error fetching customer data:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Customer Addresses Query Hook
export const useCustomerAddresses = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: customerAccountKeys.addresses(),
    queryFn: async () => {
      const data = await customerAccountApi.query(CUSTOMER_ADDRESSES_QUERY);
      return data.customer.addresses.nodes as CustomerAddress[];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Customer Orders Query Hook
export const useCustomerOrders = (first: number = 10) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...customerAccountKeys.orders(), first],
    queryFn: async () => {
      const data = await customerAccountApi.query(CUSTOMER_ORDERS_QUERY, { first });
      return data.customer.orders.nodes as CustomerOrder[];
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update Customer Mutation Hook
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: CustomerUpdateInput) => {
      const data = await customerAccountApi.mutate(UPDATE_CUSTOMER_MUTATION, { customer });
      
      if (data.customerUpdate.userErrors?.length > 0) {
        throw new Error(data.customerUpdate.userErrors[0].message);
      }
      
      return data.customerUpdate.customer as Customer;
    },
    onSuccess: () => {
      // Invalidate customer query to refetch updated data
      queryClient.invalidateQueries({ queryKey: customerAccountKeys.customer() });
    },
  });
};

// Create Address Mutation Hook
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: CustomerAddressInput) => {
      const data = await customerAccountApi.mutate(CREATE_ADDRESS_MUTATION, { address });
      
      if (data.customerAddressCreate.userErrors?.length > 0) {
        throw new Error(data.customerAddressCreate.userErrors[0].message);
      }
      
      return data.customerAddressCreate.customerAddress as CustomerAddress;
    },
    onSuccess: () => {
      // Invalidate addresses query to refetch updated data
      queryClient.invalidateQueries({ queryKey: customerAccountKeys.addresses() });
    },
  });
};

// Update Address Mutation Hook
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ addressId, address }: { addressId: string; address: CustomerAddressInput }) => {
      const data = await customerAccountApi.mutate(UPDATE_ADDRESS_MUTATION, { addressId, address });
      
      if (data.customerAddressUpdate.userErrors?.length > 0) {
        throw new Error(data.customerAddressUpdate.userErrors[0].message);
      }
      
      return data.customerAddressUpdate.customerAddress as CustomerAddress;
    },
    onSuccess: () => {
      // Invalidate addresses query to refetch updated data
      queryClient.invalidateQueries({ queryKey: customerAccountKeys.addresses() });
    },
  });
};

// Delete Address Mutation Hook
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const data = await customerAccountApi.mutate(DELETE_ADDRESS_MUTATION, { addressId });
      
      if (data.customerAddressDelete.userErrors?.length > 0) {
        throw new Error(data.customerAddressDelete.userErrors[0].message);
      }
      
      return data.customerAddressDelete.deletedAddressId;
    },
    onSuccess: () => {
      // Invalidate addresses query to refetch updated data
      queryClient.invalidateQueries({ queryKey: customerAccountKeys.addresses() });
    },
  });
};

// Authentication Hook
export const useAuth = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // Add safety check for undefined authStore
  if (!authStore) {
    console.error('Auth store is not properly initialized');
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      tokens: null,
      error: 'Auth store not initialized',
      biometricEnabled: false,
      login: async () => { throw new Error('Auth store not initialized'); },
      logout: async () => { throw new Error('Auth store not initialized'); },
      refreshTokens: async () => { throw new Error('Auth store not initialized'); },
      checkAuthStatus: async () => { throw new Error('Auth store not initialized'); },
      clearError: () => { console.warn('Auth store not initialized'); },
      enableBiometrics: async () => false,
      authenticateWithBiometrics: async () => false,
      setUser: () => { console.warn('Auth store not initialized'); },
    };
  }

  const login = async () => {
    try {
      console.log('Starting login process...');
      await authStore.login();
      console.log('Login completed, auth state:', authStore.isAuthenticated);
      // Invalidate customer queries to refetch data
      queryClient.invalidateQueries({ queryKey: customerAccountKeys.all });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authStore.logout();
      // Clear all customer data from cache
      queryClient.removeQueries({ queryKey: customerAccountKeys.all });
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authStore,
    login,
    logout,
  };
}; 