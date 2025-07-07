// Sanity Shopify Template Types

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// Shopify Store Data (read-only from Shopify)
export interface ShopifyStoreData {
  id: number;
  gid: string;
  slug: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  status: string;
  tags?: string[];
  vendor?: string;
  productType?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  availableForSale?: boolean;
  totalInventory?: number;
  trackQuantity?: boolean;
  inventoryPolicy?: string;
  price?: number;
  compareAtPrice?: number;
  isDeleted: boolean;
  previewImageUrl?: string;
}

// Enhanced Product from Sanity
export interface SanityProduct {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  store: ShopifyStoreData;
  // Custom fields added in Sanity
  body?: any[]; // Portable text
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
  modules?: SanityModule[];
}

// Enhanced Collection from Sanity  
export interface SanityCollection {
  _id: string;
  _type: 'collection';
  _createdAt: string;
  _updatedAt: string;
  store: ShopifyStoreData;
  // Custom fields added in Sanity
  modules?: SanityModule[];
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

// Hero (separate from modules)
export interface Hero {
  _type: 'hero';
  title?: string;
  description?: string;
  image?: SanityImage[];
  cta?: {
    _type: 'cta';
    title?: string;
    url?: string;
  };
}

// Module Types (updated to match actual Sanity schema)
export interface SanityModule {
  _key: string;
  _type: string;
}

export interface AccordionModule extends SanityModule {
  _type: 'accordion';
  title?: string;
  groups?: {
    _key: string;
    title: string;
    content: any[]; // Portable text
  }[];
  items?: any[]; // Fallback for old schema
}

export interface CalloutModule extends SanityModule {
  _type: 'callout';
  text?: any[]; // Portable text
  tone?: 'default' | 'critical' | 'positive' | 'caution';
}

export interface GridModule extends SanityModule {
  _type: 'grid';
  title?: string;
  items?: any[];
}

export interface ImagesModule extends SanityModule {
  _type: 'images';
  images?: SanityImage[];
  caption?: string;
  fullWidth?: boolean;
  imageFeatures?: any[];
  verticalAlign?: 'top' | 'center' | 'bottom';
}

export interface ImageWithProductHotspotsModule extends SanityModule {
  _type: 'imageWithProductHotspots';
  image?: SanityImage;
  hotspots?: any[];
}

export interface InstagramModule extends SanityModule {
  _type: 'instagram';
  url?: string;
}

export interface ProductsModule extends SanityModule {
  _type: 'products';
  title?: string;
  products?: {
    productWithVariant: {
      product: SanityProduct;
      variant?: {
        _id: string;
        store: {
          title: string;
          price: number;
          compareAtPrice?: number;
          sku?: string;
          previewImageUrl?: string;
          isDeleted: boolean;
        };
      };
    };
  }[];
  layout?: 'card' | 'pill';
}

// Page types
export interface SanityPage {
  _id: string;
  _type: 'page';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  body?: any[]; // Portable text
  modules?: SanityModule[];
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

// Home page (updated to match actual schema)
export interface SanityHome {
  _id: string;
  _type: 'home';
  _createdAt: string;
  _updatedAt: string;
  hero?: Hero;
  modules?: SanityModule[];
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

// Link Types
export interface CollectionGroup {
  _type: 'collectionGroup';
  _id?: string;
  title: string;
  collectionLinks?: {
    _ref: string;
    _type: 'reference';
    _id?: string;
    store?: ShopifyStoreData;
  }[];
  collectionProducts?: {
    _ref: string;
    _type: 'reference';
  };
}

export interface LinkInternal {
  _type: 'linkInternal';
  _id?: string;
  reference?: {
    _ref: string;
    _type: 'reference';
    _id?: string;
    title?: string;
    slug?: string;
    store?: ShopifyStoreData;
  };
}

export interface LinkExternal {
  _type: 'linkExternal';
  _id?: string;
  url: string;
  newWindow?: boolean;
}

// Settings
export interface SanitySettings {
  _id: string;
  _type: 'settings';
  menu?: {
    links?: (CollectionGroup | LinkInternal | LinkExternal)[];
  };
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
  footer?: {
    newsletter?: {
      display: boolean;
      heading?: string;
      text?: any[]; // Portable text
    };
    links?: (LinkInternal | LinkExternal)[];
  };
  notFoundPage?: {
    title?: string;
    body?: any[]; // Portable text
    collection?: SanityCollection;
    colorTheme?: string;
  };
} 