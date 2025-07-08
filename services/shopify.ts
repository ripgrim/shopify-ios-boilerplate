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
  async getProducts(first: number = 20, after?: string, imageWidth: number = 400, imageHeight: number = 400): Promise<ShopifyProductConnection> {
    console.log(`🖼️ Fetching products with image transform: ${imageWidth}x${imageHeight}`);
    
    const query = `
      query GetProducts($first: Int!, $after: String, $imageTransform: ImageTransformInput) {
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
                    url(transform: $imageTransform)
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
                      url(transform: $imageTransform)
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

    const variables = { 
      first, 
      after,
      imageTransform: { maxWidth: imageWidth, maxHeight: imageHeight }
    };
    console.log('🔧 GraphQL variables:', variables);
    
    const response = await this.client.request(query, variables) as { products: ShopifyProductConnection };
    
    // Log a sample image URL to verify transform
    if (response.products.edges[0]?.node.images.edges[0]?.node.url) {
      console.log('🎯 Sample transformed image URL:', response.products.edges[0].node.images.edges[0].node.url);
    }
    
    return response.products;
  }

  async getProductByHandle(handle: string, imageWidth: number = 800, imageHeight: number = 800): Promise<ShopifyProduct | null> {
    const query = `
      query GetProductByHandle($handle: String!, $imageTransform: ImageTransformInput) {
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
                url(transform: $imageTransform)
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
                  url(transform: $imageTransform)
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

    const variables = { 
      handle,
      imageTransform: { maxWidth: imageWidth, maxHeight: imageHeight }
    };
    const response = await this.client.request(query, variables) as { productByHandle: ShopifyProduct | null };
    return response.productByHandle;
  }

  // collections

  async getCollections(first: number = 20, after?: string, imageWidth: number = 400, imageHeight: number = 400): Promise<ShopifyCollectionConnection> {
    const query = `
      query GetCollections($first: Int!, $after: String, $imageTransform: ImageTransformInput) {
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
                url(transform: $imageTransform)
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
                          url(transform: $imageTransform)
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

    const variables = { 
      first, 
      after,
      imageTransform: { maxWidth: imageWidth, maxHeight: imageHeight }
    };
    const response = await this.client.request(query, variables) as { collections: ShopifyCollectionConnection };
    return response.collections;
  }

  async getCollectionByHandle(handle: string, imageWidth: number = 400, imageHeight: number = 400): Promise<ShopifyCollection | null> {
    const query = `
      query GetCollectionByHandle($handle: String!, $imageTransform: ImageTransformInput) {
        collectionByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url(transform: $imageTransform)
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
                      url(transform: $imageTransform)
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

    const variables = { 
      handle,
      imageTransform: { maxWidth: imageWidth, maxHeight: imageHeight }
    };
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