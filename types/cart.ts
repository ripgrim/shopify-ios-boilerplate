export interface CartMoney {
  amount: string;
  currencyCode: string;
}

export interface CartAttribute {
  key: string;
  value: string;
}

export interface CartAddress {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  zip?: string;
}

export interface CartBuyerIdentity {
  countryCode?: string;
  email?: string;
  phone?: string;
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  deliveryAddressPreferences?: CartAddress[];
}

export interface CartLine {
  id: string;
  quantity: number;
  attributes: CartAttribute[];
  cost: {
    totalAmount: CartMoney;
    amountPerQuantity: CartMoney;
    compareAtAmountPerQuantity?: CartMoney;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      productType: string;
      vendor: string;
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
    image?: {
      id: string;
      url: string;
      altText?: string;
      width: number;
      height: number;
    };
    price: CartMoney;
    compareAtPrice?: CartMoney;
    availableForSale: boolean;
    quantityAvailable?: number;
  };
  sellingPlanAllocation?: {
    sellingPlan: {
      id: string;
      name: string;
      description?: string;
    };
  };
}

export interface CartDiscountCode {
  code: string;
  applicable: boolean;
}

export interface CartDiscountAllocation {
  discountedAmount: CartMoney;
  targetType: 'LINE_ITEM' | 'SHIPPING_LINE';
}

export interface CartCost {
  totalAmount: CartMoney;
  subtotalAmount: CartMoney;
  totalTaxAmount?: CartMoney;
  totalDutyAmount?: CartMoney;
  checkoutChargeAmount?: CartMoney;
}

export interface CartDeliveryGroup {
  id: string;
  deliveryAddress: CartAddress;
  cartLines: {
    edges: {
      node: CartLine;
    }[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
  totalQuantity: number;
  buyerIdentity: CartBuyerIdentity;
  attributes: CartAttribute[];
  cost: CartCost;
  discountCodes: CartDiscountCode[];
  discountAllocations: CartDiscountAllocation[];
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  deliveryGroups: {
    edges: {
      node: CartDeliveryGroup;
    }[];
  };
  note?: string;
}

export interface CartCreateInput {
  attributes?: CartAttribute[];
  buyerIdentity?: CartBuyerIdentity;
  discountCodes?: string[];
  lines?: {
    attributes?: CartAttribute[];
    merchandiseId: string;
    quantity: number;
    sellingPlanId?: string;
  }[];
  note?: string;
}

export interface CartLinesAddInput {
  cartId: string;
  lines: {
    attributes?: CartAttribute[];
    merchandiseId: string;
    quantity: number;
    sellingPlanId?: string;
  }[];
}

export interface CartLinesUpdateInput {
  cartId: string;
  lines: {
    id: string;
    attributes?: CartAttribute[];
    merchandiseId?: string;
    quantity?: number;
    sellingPlanId?: string;
  }[];
}

export interface CartLinesRemoveInput {
  cartId: string;
  lineIds: string[];
}

export interface CartBuyerIdentityUpdateInput {
  cartId: string;
  buyerIdentity: CartBuyerIdentity;
}

export interface CartAttributesUpdateInput {
  cartId: string;
  attributes: CartAttribute[];
}

export interface CartDiscountCodesUpdateInput {
  cartId: string;
  discountCodes: string[];
}

export interface CartNoteUpdateInput {
  cartId: string;
  note: string;
} 