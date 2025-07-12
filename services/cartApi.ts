import config from '@/config/env';
import {
  CartAttributesUpdateInput,
  CartBuyerIdentityUpdateInput,
  CartCreateInput,
  CartDiscountCodesUpdateInput,
  CartLinesAddInput,
  CartLinesRemoveInput,
  CartLinesUpdateInput,
  CartNoteUpdateInput,
  ShopifyCart
} from '@/types/cart';
import { GraphQLClient } from 'graphql-request';

class CartApiError extends Error {
  constructor(public userErrors: { field: string; message: string }[]) {
    super(userErrors.map(e => e.message).join(', '));
    this.name = 'CartApiError';
  }
}

class CartApiService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(`https://${config.shopify.storeDomain}/api/2024-01/graphql.json`, {
      headers: {
        'X-Shopify-Storefront-Access-Token': config.shopify.storefrontAccessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  // GraphQL Fragments
  private readonly cartFragment = `
    fragment CartFragment on Cart {
      id
      checkoutUrl
      createdAt
      updatedAt
      totalQuantity
      buyerIdentity {
        countryCode
        email
        phone
        customer {
          id
          email
          firstName
          lastName
        }
        deliveryAddressPreferences {
          ... on MailingAddress {
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
        checkoutChargeAmount {
          amount
          currencyCode
        }
      }
      discountCodes {
        code
        applicable
      }
      discountAllocations {
        discountedAmount {
          amount
          currencyCode
        }
        targetType
      }
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            attributes {
              key
              value
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              amountPerQuantity {
                amount
                currencyCode
              }
              compareAtAmountPerQuantity {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  title
                  handle
                  productType
                  vendor
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url(transform: { maxWidth: 300, maxHeight: 300 })
                  altText
                  width
                  height
                }
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
              }
            }
            sellingPlanAllocation {
              sellingPlan {
                id
                name
                description
              }
            }
          }
        }
      }
      deliveryGroups(first: 250) {
        edges {
          node {
            id
            deliveryAddress {
              ... on MailingAddress {
                address1
                address2
                city
                company
                country
                firstName
                lastName
                phone
                province
                zip
              }
            }
            cartLines(first: 250) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
          }
        }
      }
      note
    }
  `;

  // Cart Query
  async getCart(cartId: string): Promise<ShopifyCart | null> {
    const query = `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFragment
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(query, { cartId }) as { cart: ShopifyCart | null };
      return response.cart;
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  // Cart Create Mutation
  async createCart(input: CartCreateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, { input }) as { 
        cartCreate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartCreate.userErrors.length > 0) {
        console.error('Cart creation errors:', response.cartCreate.userErrors);
        throw new CartApiError(response.cartCreate.userErrors);
      }

      return response.cartCreate.cart;
    } catch (error) {
      console.error('Create cart error:', error);
      throw error;
    }
  }

  // Cart Lines Add Mutation
  async addCartLines(input: CartLinesAddInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        lines: input.lines
      }) as { 
        cartLinesAdd: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartLinesAdd.userErrors.length > 0) {
        console.error('Cart lines add errors:', response.cartLinesAdd.userErrors);
        throw new CartApiError(response.cartLinesAdd.userErrors);
      }

      return response.cartLinesAdd.cart;
    } catch (error) {
      console.error('Add cart lines error:', error);
      throw error;
    }
  }

  // Cart Lines Update Mutation
  async updateCartLines(input: CartLinesUpdateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        lines: input.lines
      }) as { 
        cartLinesUpdate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartLinesUpdate.userErrors.length > 0) {
        console.error('Cart lines update errors:', response.cartLinesUpdate.userErrors);
        throw new CartApiError(response.cartLinesUpdate.userErrors);
      }

      return response.cartLinesUpdate.cart;
    } catch (error) {
      console.error('Update cart lines error:', error);
      throw error;
    }
  }

  // Cart Lines Remove Mutation
  async removeCartLines(input: CartLinesRemoveInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        lineIds: input.lineIds
      }) as { 
        cartLinesRemove: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartLinesRemove.userErrors.length > 0) {
        console.error('Cart lines remove errors:', response.cartLinesRemove.userErrors);
        throw new CartApiError(response.cartLinesRemove.userErrors);
      }

      return response.cartLinesRemove.cart;
    } catch (error) {
      console.error('Remove cart lines error:', error);
      throw error;
    }
  }

  // Cart Buyer Identity Update Mutation
  async updateCartBuyerIdentity(input: CartBuyerIdentityUpdateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        buyerIdentity: input.buyerIdentity
      }) as { 
        cartBuyerIdentityUpdate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartBuyerIdentityUpdate.userErrors.length > 0) {
        console.error('Cart buyer identity update errors:', response.cartBuyerIdentityUpdate.userErrors);
        throw new CartApiError(response.cartBuyerIdentityUpdate.userErrors);
      }

      return response.cartBuyerIdentityUpdate.cart;
    } catch (error) {
      console.error('Update cart buyer identity error:', error);
      throw error;
    }
  }

  // Cart Attributes Update Mutation
  async updateCartAttributes(input: CartAttributesUpdateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
        cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        attributes: input.attributes
      }) as { 
        cartAttributesUpdate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartAttributesUpdate.userErrors.length > 0) {
        console.error('Cart attributes update errors:', response.cartAttributesUpdate.userErrors);
        throw new CartApiError(response.cartAttributesUpdate.userErrors);
      }

      return response.cartAttributesUpdate.cart;
    } catch (error) {
      console.error('Update cart attributes error:', error);
      throw error;
    }
  }

  // Cart Discount Codes Update Mutation
  async updateCartDiscountCodes(input: CartDiscountCodesUpdateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        discountCodes: input.discountCodes
      }) as { 
        cartDiscountCodesUpdate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
        console.error('Cart discount codes update errors:', response.cartDiscountCodesUpdate.userErrors);
        throw new CartApiError(response.cartDiscountCodesUpdate.userErrors);
      }

      return response.cartDiscountCodesUpdate.cart;
    } catch (error) {
      console.error('Update cart discount codes error:', error);
      throw error;
    }
  }

  // Cart Note Update Mutation
  async updateCartNote(input: CartNoteUpdateInput): Promise<ShopifyCart> {
    const mutation = `
      mutation CartNoteUpdate($cartId: ID!, $note: String!) {
        cartNoteUpdate(cartId: $cartId, note: $note) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
      ${this.cartFragment}
    `;

    try {
      const response = await this.client.request(mutation, {
        cartId: input.cartId,
        note: input.note
      }) as { 
        cartNoteUpdate: { 
          cart: ShopifyCart; 
          userErrors: { field: string; message: string }[] 
        } 
      };

      if (response.cartNoteUpdate.userErrors.length > 0) {
        console.error('Cart note update errors:', response.cartNoteUpdate.userErrors);
        throw new CartApiError(response.cartNoteUpdate.userErrors);
      }

      return response.cartNoteUpdate.cart;
    } catch (error) {
      console.error('Update cart note error:', error);
      throw error;
    }
  }
}

export const cartApiService = new CartApiService();
export default cartApiService; 