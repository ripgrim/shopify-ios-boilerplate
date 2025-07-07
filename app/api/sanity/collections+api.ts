import { sanityServerConfig } from '@/lib/server/env';
import { createClient } from '@sanity/client';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const client = createClient(sanityServerConfig);

    const query = `
      *[_type == "collection"] | order(_createdAt desc) [0...${limit}] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        store {
          id,
          gid,
          slug,
          title,
          handle,
          description,
          descriptionHtml,
          updatedAt,
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

    const collections = await client.fetch(query);
    
    return Response.json(collections);
  } catch (error) {
    console.error('Failed to fetch Sanity collections:', error);
    return new Response('Failed to fetch collections', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 