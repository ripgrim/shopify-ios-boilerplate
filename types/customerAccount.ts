// Customer Account API Types

export interface CustomerAccountCustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailAddress?: {
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

export interface CustomerAccountAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  country: string;
  countryCode: string;
  zip: string;
  phone?: string;
  formatted: string[];
}

export interface CustomerAccountOrder {
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
  totalTax?: {
    amount: string;
    currencyCode: string;
  };
  totalShipping?: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: CustomerAccountLineItem[];
  };
  shippingAddress?: CustomerAccountAddress;
  billingAddress?: CustomerAccountAddress;
}

export interface CustomerAccountLineItem {
  id: string;
  title: string;
  quantity: number;
  variant?: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface CustomerAccountOrderConnection {
  nodes: CustomerAccountOrder[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface CustomerAccountAddressConnection {
  nodes: CustomerAccountAddress[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

// Subscription types
export interface CustomerAccountSubscriptionContract {
  id: string;
  status: string;
  nextBillingDate?: string;
  deliveryPolicy: {
    interval: string;
    intervalCount: number;
  };
  lines: {
    nodes: CustomerAccountSubscriptionLine[];
  };
  orders: {
    nodes: CustomerAccountOrder[];
  };
}

export interface CustomerAccountSubscriptionLine {
  id: string;
  quantity: number;
  currentPrice: {
    amount: string;
    currencyCode: string;
  };
  productVariant: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
  };
}

// Payment method types
export interface CustomerAccountPaymentMethod {
  id: string;
  instrument: {
    brand?: string;
    lastFourDigits?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
}

// Company types (for B2B)
export interface CustomerAccountCompany {
  id: string;
  name: string;
  locations: {
    nodes: CustomerAccountCompanyLocation[];
  };
}

export interface CustomerAccountCompanyLocation {
  id: string;
  name: string;
  shippingAddress?: CustomerAccountAddress;
  billingAddress?: CustomerAccountAddress;
} 