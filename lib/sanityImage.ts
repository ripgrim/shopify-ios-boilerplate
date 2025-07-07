import config from '@/config/env';
import { SanityImage } from '@/types/sanity';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Client-side Sanity client (no token needed for image URLs)
const client = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  apiVersion: '2023-10-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const sanityImageUrl = (source: SanityImage) => {
  return builder.image(source);
}; 