import { sanityServerConfig } from '@/lib/server/env';
import { createClient } from '@sanity/client';

export async function GET(request: Request) {
  try {
    // Server-side with validated environment
    const client = createClient(sanityServerConfig);

    const query = `
      *[_type == "settings"][0] {
        _id,
        _type,
        menu {
          links[] {
            _key,
            _type,
            _type == "collectionGroup" => {
              ...,
              title,
              collectionLinks[] {
                _ref,
                _type,
                "store": @-> {
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
                }
              },
              collectionProducts {
                _ref,
                _type
              }
            },
            _type == "linkInternal" => {
              ...,
              reference-> {
                _id,
                _type,
                _type == "home" => {
                  title,
                  "slug": "home"
                },
                _type == "page" => {
                  title,
                  slug
                },
                _type == "product" => {
                  title,
                  store {
                    title,
                    handle
                  }
                },
                _type == "collection" => {
                  title,
                  store {
                    title,
                    handle
                  }
                }
              }
            },
            _type == "linkExternal" => {
              ...,
              url,
              newWindow
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
        },
        footer {
          newsletter {
            display,
            heading,
            text
          },
          links[] {
            _key,
            title,
            url
          }
        },
        notFoundPage {
          title,
          body,
          collection-> {
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
          colorTheme
        }
      }
    `;

    const settings = await client.fetch(query);
    
    return Response.json(settings);
  } catch (error) {
    console.error('Failed to fetch Sanity settings:', error);
    return new Response('Failed to fetch settings', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 