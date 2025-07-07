import config from '@/config/env';
import { ShopifyCollection, ShopifyCollectionConnection, ShopifyProduct, ShopifyProductConnection, ShopifyStore } from '@/types/shopify';
import { GraphQLClient } from 'graphql-request';

class ShopifyService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(`https://${config.shopify.storeDomain}/api/2024-01/graphql.json`, {
      headers: {
        'X-Shopify-Storefront-Access-Token': config.shopify.storefrontAccessToken,
        'Content-Type': 'application/json',
      },
    });
  }


  // products
  async getProducts(first: number = 20, after?: string): Promise<ShopifyProductConnection> {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              availableForSale
              createdAt
              updatedAt
              productType
              vendor
              tags
              totalInventory
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    quantityAvailable
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              options {
                id
                name
                values
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
    `;

    const variables = { first, after };
    const response = await this.client.request(query, variables) as { products: ShopifyProductConnection };
    return response.products;
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          createdAt
          updatedAt
          productType
          vendor
          tags
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                quantityAvailable
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          options {
            id
            name
            values
          }
        }
      }
    `;

    const variables = { handle };
    const response = await this.client.request(query, variables) as { productByHandle: ShopifyProduct | null };
    return response.productByHandle;
  }

  // collections

  async getCollections(first: number = 20, after?: string): Promise<ShopifyCollectionConnection> {
    const query = `
      query GetCollections($first: Int!, $after: String) {
        collections(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              image {
                id
                url
                altText
                width
                height
              }
              products(first: 10) {
                edges {
                  node {
                    id
                    title
                    handle
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
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
    `;

    const variables = { first, after };
    const response = await this.client.request(query, variables) as { collections: ShopifyCollectionConnection };
    return response.collections;
  }

  async getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
    const query = `
      query GetCollectionByHandle($handle: String!) {
        collectionByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                availableForSale
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 3) {
                  edges {
                    node {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = { handle };
    const response = await this.client.request(query, variables) as { collectionByHandle: ShopifyCollection | null };
    return response.collectionByHandle;
  }

  // customer account
  getCustomerAccountUrl(): string {
    return config.shopify.customerAccountUrl;
  }
  async getCustomerOrdersUrl(): Promise<string> {
    const query = `
      query GetCustomerOrdersUrl {
        customerOrdersUrl
      }
    `;

    const response = await this.client.request(query) as { customerAccountUrl: string };
    return response.customerAccountUrl;
  }


  async getStore(): Promise<ShopifyStore> {
    const query = `
      query GetStore {
        shop {
          name
        }
      }
    `;

    const response = await this.client.request(query) as { shop: Pick<ShopifyStore, 'name'> };
    return {
      name: response.shop.name,
      domain: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    };
  }
}

export default new ShopifyService(); 