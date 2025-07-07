import { SanityCollection, SanityHome, SanityPage, SanityProduct, SanitySettings } from '@/types/sanity';
import { useQuery } from '@tanstack/react-query';

export const useSanityHome = () => {
  return useQuery<SanityHome | null>({
    queryKey: ['sanity', 'home'],
    queryFn: async () => {
      const response = await fetch('/api/sanity/home');
      if (!response.ok) throw new Error('Failed to fetch home data');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSanityPage = (slug: string) => {
  return useQuery<SanityPage | null>({
    queryKey: ['sanity', 'page', slug],
    queryFn: async () => {
      const response = await fetch(`/api/sanity/page/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch page data');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug,
  });
};

export const useSanityProducts = (limit: number = 20) => {
  return useQuery<SanityProduct[]>({
    queryKey: ['sanity', 'products', limit],
    queryFn: async () => {
      const response = await fetch(`/api/sanity/products?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSanityCollections = (limit: number = 20) => {
  return useQuery<SanityCollection[]>({
    queryKey: ['sanity', 'collections', limit],
    queryFn: async () => {
      const response = await fetch(`/api/sanity/collections?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSanitySettings = () => {
  return useQuery<SanitySettings | null>({
    queryKey: ['sanity', 'settings'],
    queryFn: async () => {
      const response = await fetch('/api/sanity/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}; 