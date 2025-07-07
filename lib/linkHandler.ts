import { CollectionGroup, LinkExternal, LinkInternal } from "@/types/sanity";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';

export type SanityLink = CollectionGroup | LinkInternal | LinkExternal;

export const useLinkHandler = () => {
  const router = useRouter();

  const handleLinkPress = (link: any) => {
    if (link._type === 'linkExternal') {
      WebBrowser.openBrowserAsync(link.url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        controlsColor: '#fff',
        showInRecents: true,
      });
    } else if (link._type === 'linkInternal') {
      const reference = link.reference;
      if (reference) {
        if (reference._type === 'home') {
          router.push('/');
        } else if (reference._type === 'page') {
          const slug = reference.slug?.current || reference.slug;
          if (slug) {
            router.push(`/page/${slug}` as any);
          }
        } else if (reference._type === 'product') {
          const handle = reference.store?.handle;
          if (handle) {
            router.push(`/product/${handle}` as any);
          }
        } else if (reference._type === 'collection') {
          const handle = reference.store?.handle;
          if (handle) {
            router.push(`/collection/${handle}` as any);
          }
        }
      }
    } else if (link._type === 'collectionGroup') {
      console.log('Collection group pressed - implement dropdown logic');
    }
  };

  const getLinkTitle = (link: any): string => {
    if (link._type === 'collectionGroup') {
      return link.title;
    } else if (link._type === 'linkInternal') {
      return link.reference?.store?.title || link.reference?.title || 'Link';
    } else if (link._type === 'linkExternal') {
      try {
        return new URL(link.url).hostname;
      } catch {
        return 'External Link';
      }
    }
    return 'Link';
  };

  const getLinkKey = (link: any): string => {
    if (link._key) return link._key;
    if (link._id) return link._id;
    if (link._type === 'linkExternal' && link.url) return link.url;
    return Math.random().toString(36);
  };

  return {
    handleLinkPress,
    getLinkTitle,
    getLinkKey,
  };
}; 