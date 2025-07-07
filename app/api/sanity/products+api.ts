import { sanityServerConfig } from '@/lib/server/env';
import { createClient } from '@sanity/client';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const client = createClient(sanityServerConfig);

    const query = `
      *[_type == "product"] | order(_createdAt desc) [0...${limit}] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
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
    `;

    const products = await client.fetch(query);
    
    return Response.json(products);
  } catch (error) {
    console.error('Failed to fetch Sanity products:', error);
    return new Response('Failed to fetch products', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 