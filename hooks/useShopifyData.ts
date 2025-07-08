import { CUSTOMER_QUERY, customerAccountApi } from '@/services/customerAccountApi';
import shopifyService from '@/services/shopify';
import { CustomerAccountCustomer, CustomerAccountOrderConnection } from '@/types/customerAccount';
import { ShopifyProductConnection } from '@/types/shopify';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from './useCustomerAccount';

export const useProducts = (first: number = 20, imageWidth: number = 250, imageHeight: number = 250) => {
  return useInfiniteQuery({
    queryKey: ['products', first, imageWidth, imageHeight],
    queryFn: ({ pageParam }) => shopifyService.getProducts(first, pageParam, imageWidth, imageHeight),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: ShopifyProductConnection) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage: ShopifyProductConnection) => 
      firstPage.pageInfo.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useProduct = (handle: string, enabled: boolean = true, imageWidth: number = 800, imageHeight: number = 800) => {
  return useQuery({
    queryKey: ['product', handle, imageWidth, imageHeight],
    queryFn: () => shopifyService.getProductByHandle(handle, imageWidth, imageHeight),
    enabled: enabled && !!handle,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
};

export const useCollections = (first: number = 20, imageWidth: number = 400, imageHeight: number = 400) => {
  return useInfiniteQuery({
    queryKey: ['collections', first, imageWidth, imageHeight],
    queryFn: ({ pageParam }) => shopifyService.getCollections(first, pageParam, imageWidth, imageHeight),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage.pageInfo.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
};

export const useCollection = (handle: string, enabled: boolean = true, imageWidth: number = 400, imageHeight: number = 400) => {
  return useQuery({
    queryKey: ['collection', handle, imageWidth, imageHeight],
    queryFn: () => shopifyService.getCollectionByHandle(handle, imageWidth, imageHeight),
    enabled: enabled && !!handle,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
};

export const useStore = () => {
  return useQuery({
    queryKey: ['store'],
    queryFn: () => shopifyService.getStore(),
    staleTime: Infinity,
    retry: false,
  });
};

export const useCustomerAccountUrl = () => {
  return useQuery({
    queryKey: ['customerAccountUrl'],
    queryFn: () => shopifyService.getCustomerAccountUrl(),
    staleTime: Infinity,
    retry: false,
  });
};

// Customer Account API Queries
export const useCustomer = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['customerAccount', 'profile'],
    queryFn: async () => {
      console.log('=== useCustomer queryFn called ===');
      console.log('isAuthenticated:', isAuthenticated);
      
      const result = await customerAccountApi.query(CUSTOMER_QUERY);
      console.log('Raw customer API result:', result);
      console.log('Type of result:', typeof result);
      console.log('Has data property:', result && 'data' in result);
      
      // The response structure is now {data: {customer: {...}}}
      if (result && typeof result === 'object' && 'data' in result && result.data) {
        console.log('Parsing customer from result.data.customer');
        const customer = (result.data as any).customer as CustomerAccountCustomer;
        console.log('Parsed customer:', customer);
        return customer;
      }
      
      // Fallback: try result.customer in case the structure changes
      if (result && typeof result === 'object' && 'customer' in result) {
        console.log('Parsing customer from result.customer');
        const customer = result.customer as CustomerAccountCustomer;
        console.log('Parsed customer from direct customer:', customer);
        return customer;
      }
      
      console.error('Unexpected result structure:', result);
      console.error('Returning null from query function');
      return null;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCustomerOrders = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['customerAccount', 'orders', first],
    queryFn: async ({ pageParam }) => {
      const result = await customerAccountApi.queryOrders(first, pageParam);
      console.log('Raw orders API result:', result);
      
      // Handle response structure properly
      if (result && typeof result === 'object' && 'data' in result && result.data) {
        return ((result.data as any).customer)?.orders as CustomerAccountOrderConnection;
      }
      
      if (result && typeof result === 'object' && 'customer' in result) {
        return (result.customer as any)?.orders as CustomerAccountOrderConnection;
      }
      
      return null;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage?.pageInfo?.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    retry: 3,
  });
};

export const useCustomerAddresses = (first: number = 10) => {
  const { isAuthenticated } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['customerAccount', 'addresses', first],
    queryFn: async ({ pageParam }) => {
      const result = await customerAccountApi.queryAddresses(first, pageParam);
      console.log('Raw addresses API result:', result);
      
      // Handle response structure properly
      if (result && typeof result === 'object' && 'data' in result && result.data) {
        return ((result.data as any).customer)?.addresses;
      }
      
      if (result && typeof result === 'object' && 'customer' in result) {
        return (result.customer as any)?.addresses;
      }
      
      return null;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    getPreviousPageParam: (firstPage) => 
      firstPage?.pageInfo?.hasPreviousPage ? firstPage.pageInfo.startCursor : undefined,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
}; 