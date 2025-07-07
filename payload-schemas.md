# Payload CMS Schemas for Shopify iOS App

This document outlines the Payload CMS schemas you need to create for the app to work properly.

## Collections

### 1. Layouts Collection

**Slug:** `layouts`

**Fields:**
- `name` (text, required) - Layout name
- `slug` (text, required, unique) - URL-friendly identifier
- `sections` (array, required) - Layout sections
  - `blockType` (select, required) - Type of block
    - Options: `hero`, `productGrid`, `featuredProducts`, `textBlock`, `imageBlock`, `promotional`
  - `title` (text, optional) - Section title
  - `content` (richText, optional) - Section content
  - `image` (upload, optional) - Section image
  - `productIds` (array, optional) - Array of Shopify product IDs
    - `productId` (text) - Individual product ID
  - `backgroundColor` (text, optional) - Background color (hex)
  - `textColor` (text, optional) - Text color (hex)
  - `alignment` (select, optional) - Text alignment
    - Options: `left`, `center`, `right`
  - `showButton` (checkbox, optional) - Show button
  - `buttonText` (text, optional) - Button text
  - `buttonUrl` (text, optional) - Button URL
  - `gridColumns` (number, optional, default: 2) - Grid columns
  - `order` (number, required) - Display order
- `isActive` (checkbox, required, default: true) - Active status

### 2. Promotions Collection

**Slug:** `promotions`

**Fields:**
- `title` (text, required) - Promotion title
- `description` (richText, optional) - Promotion description
- `image` (upload, optional) - Promotion image
- `discountCode` (text, optional) - Discount code
- `discountPercent` (number, optional) - Discount percentage
- `validFrom` (date, optional) - Valid from date
- `validUntil` (date, optional) - Valid until date
- `isActive` (checkbox, required, default: true) - Active status
- `priority` (number, required, default: 0) - Display priority

### 3. Featured Content Collection

**Slug:** `featured-content`

**Fields:**
- `title` (text, required) - Content title
- `description` (richText, optional) - Content description
- `image` (upload, optional) - Content image
- `contentType` (select, required) - Content type
  - Options: `product`, `collection`, `page`, `external`
- `productHandle` (text, optional) - Shopify product handle
- `collectionHandle` (text, optional) - Shopify collection handle
- `pageUrl` (text, optional) - Internal page URL
- `externalUrl` (text, optional) - External URL
- `isActive` (checkbox, required, default: true) - Active status
- `priority` (number, required, default: 0) - Display priority

### 4. App Config Collection

**Slug:** `app-config`

**Fields:**
- `appName` (text, required) - App name
- `primaryColor` (text, required, default: "#007AFF") - Primary color
- `secondaryColor` (text, required, default: "#34C759") - Secondary color
- `accentColor` (text, required, default: "#FF3B30") - Accent color
- `logoImage` (upload, optional) - App logo
- `homeLayoutId` (relationship, optional) - Home layout reference
  - Relationship to: `layouts`
- `productListLayoutId` (relationship, optional) - Product list layout reference
  - Relationship to: `layouts`
- `enablePromotions` (checkbox, required, default: true) - Enable promotions
- `enableFeaturedContent` (checkbox, required, default: true) - Enable featured content
- `maxProductsPerPage` (number, required, default: 20) - Max products per page
- `currency` (text, required, default: "USD") - Currency code
- `isActive` (checkbox, required, default: true) - Active status

## Sample Data

### Sample Layouts

1. **Home Layout**
   - Name: "Home Page"
   - Slug: "home"
   - Sections:
     - Hero section (blockType: "hero")
     - Featured products (blockType: "featuredProducts")
     - Promotional banner (blockType: "promotional")

2. **Product List Layout**
   - Name: "Product List"
   - Slug: "product-list"
   - Sections:
     - Product grid (blockType: "productGrid")

### Sample App Config

- App Name: "My Shopify Store"
- Primary Color: "#007AFF"
- Secondary Color: "#34C759"
- Accent Color: "#FF3B30"
- Max Products Per Page: 20
- Currency: "USD"
- Enable Promotions: true
- Enable Featured Content: true

## Notes

1. Make sure to set up proper access controls for your Payload CMS collections
2. Use the provided API key in your environment configuration
3. The app expects at least one active app config record
4. Layout sections are sorted by the `order` field
5. All relationships should be properly configured in Payload CMS admin 