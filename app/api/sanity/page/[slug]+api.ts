import { sanityServerConfig } from '@/lib/server/env';
import { createClient } from '@sanity/client';

export async function GET(request: Request, { slug }: { slug: string }) {
  try {
    const client = createClient(sanityServerConfig);

    const query = `
      *[_type == "page" && store.slug.current == $slug][0] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        store {
          slug,
          title
        },
        modules[]{
          _key,
          _type,
          _type == "accordion" => {
            ...,
            title,
            groups[]{
              _key,
              title,
              content
            },
            items[]{
              _key,
              title,
              content
            }
          },
          _type == "callout" => {
            ...,
            text,
            tone
          },
          _type == "grid" => {
            ...,
            title,
            items
          },
          _type == "images" => {
            ...,
            images[]{
              asset->{
                _id,
                url
              },
              alt,
              hotspot,
              crop
            },
            imageFeatures[]{
              _key,
              _type,
              image {
                asset->{
                  _id,
                  url
                },
                alt,
                hotspot,
                crop
              }
            },
            caption,
            fullWidth,
            verticalAlign
          },
          _type == "imageWithProductHotspots" => {
            ...,
            image{
              asset->{
                _id,
                url
              },
              alt,
              hotspot,
              crop
            },
            hotspots
          },
          _type == "instagram" => {
            ...,
            url
          },
          _type == "products" => {
            ...,
            title,
            layout,
            products[] {
              productWithVariant {
                product-> {
                  _id,
                  _type,
                  store {
                    id,
                    gid,
                    slug,
                    title,
                    handle,
                    descriptionHtml,
                    status,
                    tags,
                    vendor,
                    productType,
                    createdAt,
                    updatedAt,
                    publishedAt,
                    availableForSale,
                    totalInventory,
                    trackQuantity,
                    inventoryPolicy,
                    price,
                    compareAtPrice,
                    isDeleted,
                    previewImageUrl
                  }
                },
                variant-> {
                  _id,
                  store {
                    title,
                    price,
                    compareAtPrice,
                    sku,
                    previewImageUrl,
                    isDeleted
                  }
                }
              }
            }
          }
        },
        seo {
          title,
          description,
          image {
            asset->{
              _id,
              url
            },
            alt,
            hotspot,
            crop
          }
        }
      }
    `;

    const page = await client.fetch(query, { slug });
    
    return Response.json(page);
  } catch (error) {
    console.error('Failed to fetch Sanity page:', error);
    return new Response('Failed to fetch page data', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 