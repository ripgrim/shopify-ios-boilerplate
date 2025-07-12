import config from '@/config/env';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';

interface StoreStatus {
  isAccessible: boolean;
  isLoading: boolean;
  error: string | null;
  hasPasswordProtection: boolean;
  canAccessProducts: boolean;
  storeInfo: {
    name?: string;
    description?: string;
    url?: string;
  } | null;
}

interface StoreTestResponse {
  shop: {
    name: string;
    description: string;
    primaryDomain: {
      url: string;
    };
  };
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
      };
    }>;
  };
}

const STORE_TEST_QUERY = `
  query testStoreAccess {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
    products(first: 1) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export const useStoreStatus = () => {
  const [status, setStatus] = useState<StoreStatus>({
    isAccessible: false,
    isLoading: true,
    error: null,
    hasPasswordProtection: false,
    canAccessProducts: false,
    storeInfo: null,
  });

  useEffect(() => {
    const testStoreAccess = async () => {
      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));

        const client = new GraphQLClient(
          `https://${config.shopify.storeDomain}/api/2024-07/graphql.json`,
          {
            headers: {
              'X-Shopify-Storefront-Access-Token': config.shopify.storefrontAccessToken,
              'Content-Type': 'application/json',
            },
          }
        );

        const response = await client.request<StoreTestResponse>(STORE_TEST_QUERY);

        console.log('Store test response:', response);

        setStatus({
          isAccessible: true,
          isLoading: false,
          error: null,
          hasPasswordProtection: false,
          canAccessProducts: response.products?.edges?.length > 0,
          storeInfo: {
            name: response.shop?.name,
            description: response.shop?.description,
            url: response.shop?.primaryDomain?.url,
          },
        });

      } catch (error: any) {
        console.error('Store access test failed:', error);
        
        let errorMessage = 'Unknown error';
        let hasPasswordProtection = false;

        if (error.response?.errors) {
          const errorMsg = error.response.errors[0]?.message || '';
          errorMessage = errorMsg;
          
          if (errorMsg.toLowerCase().includes('password') || 
              errorMsg.toLowerCase().includes('access denied') ||
              errorMsg.toLowerCase().includes('forbidden')) {
            hasPasswordProtection = true;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        setStatus({
          isAccessible: false,
          isLoading: false,
          error: errorMessage,
          hasPasswordProtection,
          canAccessProducts: false,
          storeInfo: null,
        });
      }
    };

    testStoreAccess();
  }, []);

  const retestStore = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      const client = new GraphQLClient(
        `https://${config.shopify.storeDomain}/api/2024-07/graphql.json`,
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': config.shopify.storefrontAccessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      const response = await client.request<StoreTestResponse>(STORE_TEST_QUERY);

      setStatus({
        isAccessible: true,
        isLoading: false,
        error: null,
        hasPasswordProtection: false,
        canAccessProducts: response.products?.edges?.length > 0,
        storeInfo: {
          name: response.shop?.name,
          description: response.shop?.description,
          url: response.shop?.primaryDomain?.url,
        },
      });

    } catch (error: any) {
      let errorMessage = 'Unknown error';
      let hasPasswordProtection = false;

      if (error.response?.errors) {
        const errorMsg = error.response.errors[0]?.message || '';
        errorMessage = errorMsg;
        
        if (errorMsg.toLowerCase().includes('password') || 
            errorMsg.toLowerCase().includes('access denied') ||
            errorMsg.toLowerCase().includes('forbidden')) {
          hasPasswordProtection = true;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({
        isAccessible: false,
        isLoading: false,
        error: errorMessage,
        hasPasswordProtection,
        canAccessProducts: false,
        storeInfo: null,
      });
    }
  };

  return {
    ...status,
    retestStore,
  };
}; 