import { GraphQLClient } from 'graphql-request';
import config from '../config/env';
import { useAuthStore } from '../stores/authStore';
import { customerAccountAuthService } from './customerAccountAuth';

class CustomerAccountApiClient {
  private readonly endpoint: string;
  private client: GraphQLClient;

  constructor() {
    this.endpoint = `https://shopify.com/${config.shopify.customerAccountApi.shopId}/account/customer/api/2025-07/graphql`;
    this.client = new GraphQLClient(this.endpoint);
    console.log('🌐 Customer Account API endpoint:', this.endpoint);
    console.log('🏪 Shop ID:', config.shopify.customerAccountApi.shopId);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const tokens = await customerAccountAuthService.getStoredTokens();
    
    if (!tokens) {
      console.log('No authentication tokens available');
      throw new Error('No authentication tokens available');
    }

    // Validate token format
    if (!tokens.accessToken.startsWith('shcat_')) {
      console.error('Invalid token format - missing shcat_ prefix');
      throw new Error('Invalid token format');
    }

  // Clean the token of any potential whitespace
    const cleanToken = tokens.accessToken.trim();
    
    console.log('Got tokens, checking expiry...');
    console.log('Token info:', {
      hasAccessToken: !!tokens.accessToken,
      tokenLength: tokens.accessToken.length,
      cleanTokenLength: cleanToken.length,
      tokensEqual: cleanToken === tokens.accessToken,
      expiresAt: new Date(tokens.expiresAt).toISOString(),
      timeLeft: Math.round((tokens.expiresAt - Date.now()) / 1000 / 60) + ' minutes'
    });
    
    // Check if token needs refresh
    const now = Date.now();
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes buffer
    
    if (tokens.expiresAt - now < refreshBuffer) {
      console.log('Token needs refresh, refreshing...');
      // Try to refresh token
      try {
        const newTokens = await customerAccountAuthService.refreshTokens();
        console.log('Token refreshed successfully');
        return {
          'Authorization': newTokens.accessToken.trim(),
          'Content-Type': 'application/json',
        };
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, user needs to re-authenticate
        useAuthStore.getState().logout();
        throw new Error('Authentication required');
      }
    }

    console.log('Using existing token');
    return {
      'Authorization': cleanToken,
      'Content-Type': 'application/json',
    };
  }

  async query<T = any>(query: string, variables?: any): Promise<T> {
    try {
      console.log('Making GraphQL request to:', this.endpoint);
      const headers = await this.getAuthHeaders();
      console.log('Request headers:', headers);
      this.client.setHeaders(headers);
      
      console.log('GraphQL query:', query);
      const result = await this.client.request<T>(query, variables);
      console.log('GraphQL response:', result);
      return result;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = (error as any).response;
        console.error('GraphQL Error Response:', {
          status: errorResponse?.status,
          statusText: errorResponse?.statusText,
          errors: errorResponse?.errors,
          data: errorResponse?.data,
          extensions: errorResponse?.extensions
        });
      }
      
      if (this.isAuthError(error)) {
        console.log('Auth error detected, trying to refresh token...');
        // Token might be invalid, try to refresh
        try {
          await customerAccountAuthService.refreshTokens();
          const newHeaders = await this.getAuthHeaders();
          this.client.setHeaders(newHeaders);
          
          console.log('Retrying GraphQL request with refreshed token...');
          const result = await this.client.request<T>(query, variables);
          console.log('Retry successful:', result);
          return result;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh also fails, user needs to re-authenticate
          useAuthStore.getState().logout();
          throw new Error('Authentication required');
        }
      }
      
      throw error;
    }
  }

  async mutate<T = any>(mutation: string, variables?: any): Promise<T> {
    return this.query<T>(mutation, variables);
  }

  private isAuthError(error: any): boolean {
    // Check if the error is related to authentication
    if (error?.response?.errors) {
      return error.response.errors.some((err: any) => 
        err.extensions?.code === 'UNAUTHORIZED' || 
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.message?.includes('access token')
      );
    }
    
    if (error?.response?.status === 401) {
      return true;
    }
    
    return false;
  }

  async queryOrders(first: number = 10, after?: string) {
    return this.query(CUSTOMER_ORDERS_QUERY, { first, after });
  }

  async queryAddresses(first: number = 10, after?: string) {
    return this.query(CUSTOMER_ADDRESSES_QUERY, { first, after });
  }

  async querySubscriptionContracts(first: number = 10, after?: string) {
    return this.query(CUSTOMER_SUBSCRIPTION_CONTRACTS_QUERY, { first, after });
  }

  async queryPaymentMethods(first: number = 10, after?: string) {
    return this.query(CUSTOMER_PAYMENT_METHODS_QUERY, { first, after });
  }

  async testCustomerQuery() {
    const query = `
      query {
        customer {
          id
          firstName
          lastName
        }
      }
    `;
    return this.query(query);
  }

  async testOrdersQuery() {
    const query = `
      query {
        customer {
          orders(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    `;
    return this.query(query);
  }

  async testAddressesQuery() {
    const query = `
      query {
        customer {
          addresses(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    `;
    return this.query(query);
  }
}

export const customerAccountApi = new CustomerAccountApiClient();

// GraphQL Queries and Mutations

export const CUSTOMER_QUERY = `
  query {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

export const CUSTOMER_ADDRESSES_QUERY = `
  query CustomerAddresses($first: Int = 10, $after: String) {
    customer {
      addresses(first: $first, after: $after) {
        nodes {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($first: Int = 10, $after: String) {
    customer {
      orders(first: $first, after: $after) {
        nodes {
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
          lineItems(first: 10) {
            nodes {
              id
              title
              quantity
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const CUSTOMER_SUBSCRIPTION_CONTRACTS_QUERY = `
  query CustomerSubscriptionContracts($first: Int = 10, $after: String) {
    customer {
      subscriptionContracts(first: $first, after: $after) {
        nodes {
          id
          status
          nextBillingDate
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const CUSTOMER_PAYMENT_METHODS_QUERY = `
  query CustomerPaymentMethods($first: Int = 10, $after: String) {
    customer {
      paymentMethods(first: $first, after: $after) {
        nodes {
          id
          instrument {
            ... on CardInstrument {
              brand
              lastFourDigits
              expiryMonth
              expiryYear
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = `
  mutation CustomerUpdate($customer: CustomerUpdateInput!) {
    customerUpdate(customer: $customer) {
      customer {
        id
        firstName
        lastName
        displayName
        emailAddress {
          emailAddress
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_ADDRESS_MUTATION = `
  mutation CustomerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        country
        zip
        firstName
        lastName
        company
        phone
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        country
        zip
        firstName
        lastName
        company
        phone
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const DELETE_ADDRESS_MUTATION = `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
        code
      }
    }
  }
`; 