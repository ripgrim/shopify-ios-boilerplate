export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  quantityAvailable: number;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  productType: string;
  vendor: string;
  tags: string[];
  totalInventory: number;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
    selectedOptions: {
      name: string;
      value: string;
    }[];
  }[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyImage | null;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyProductConnection {
  edges: {
    node: ShopifyProduct;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}

export interface ShopifyCollectionConnection {
  edges: {
    node: ShopifyCollection;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
} 

export interface ShopifyStore {
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}