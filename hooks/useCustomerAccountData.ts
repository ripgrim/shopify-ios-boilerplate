import { CUSTOMER_QUERY, customerAccountApi } from '@/services/customerAccountApi';
import {
    CustomerAccountAddressConnection,
    CustomerAccountCustomer,
    CustomerAccountOrderConnection,
    CustomerAccountPaymentMethod,
    CustomerAccountSubscriptionContract
} from '@/types/customerAccount';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from './useCustomerAccount';

// Customer profile
export const useCustomerProfile = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['customerAccount', 'profile'],
    queryFn: async () => {
      const result = await customerAccountApi.query(CUSTOMER_QUERY);
      return result.data?.customer as CustomerAccountCustomer;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Customer orders with infinite scroll
export const useCustomerOrders = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['customerAccount', 'orders', first],
    queryFn: async ({ pageParam }) => {
      const result = await customerAccountApi.queryOrders(first, pageParam);
      return result.data?.customer?.orders as CustomerAccountOrderConnection;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage?.pageInfo?.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};

// Customer addresses
export const useCustomerAddresses = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['customerAccount', 'addresses', first],
    queryFn: async ({ pageParam }) => {
      const result = await customerAccountApi.queryAddresses(first, pageParam);
      return result.data?.customer?.addresses as CustomerAccountAddressConnection;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage?.pageInfo?.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Customer subscription contracts
export const useCustomerSubscriptions = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['customerAccount', 'subscriptions', first],
    queryFn: async ({ pageParam }) => {
      const result = await customerAccountApi.querySubscriptionContracts(first, pageParam);
      return result.data?.customer?.subscriptionContracts?.nodes as CustomerAccountSubscriptionContract[];
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // Note: This would need to be adjusted based on actual API response structure
      return undefined; // Placeholder
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Customer payment methods
export const useCustomerPaymentMethods = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['customerAccount', 'paymentMethods', first],
    queryFn: async () => {
      const result = await customerAccountApi.queryPaymentMethods(first);
      return result.data?.customer?.paymentMethods?.nodes as CustomerAccountPaymentMethod[];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Single order query
export const useCustomerOrder = (orderId: string, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['customerAccount', 'order', orderId],
    queryFn: async () => {
      // This would need a specific order query in the API service
      const query = `
        query CustomerOrder($orderId: ID!) {
          customer {
            order(id: $orderId) {
              id
              name
              orderNumber
              processedAt
              fulfillmentStatus
              financialStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                nodes {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                  }
                  totalPrice {
                    amount
                    currencyCode
                  }
                }
              }
              shippingAddress {
                id
                firstName
                lastName
                company
                address1
                address2
                city
                province
                country
                zip
                phone
                formatted
              }
              billingAddress {
                id
                firstName
                lastName
                company
                address1
                address2
                city
                province
                country
                zip
                phone
                formatted
              }
            }
          }
        }
      `;
      
      const result = await customerAccountApi.query(query, { orderId });
      return result.data?.customer?.order;
    },
    enabled: isAuthenticated && enabled && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}; 