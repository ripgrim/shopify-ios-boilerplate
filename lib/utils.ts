import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeShopifyImage(url: string, width?: number, height?: number): string {
  if (!url) return url;
  
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  
  if (params.toString()) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }
  
  return url;
} 

export function formatPrice(amount: string, currencyCode: string, locale = 'en-US') {
     const numericAmount = parseFloat(amount);
     if (isNaN(numericAmount)) {
         throw new Error(`Invalid amount: ${amount}`);
     }
     
     try {
         const formatter = new Intl.NumberFormat(locale, {
             style: 'currency',
             currency: currencyCode,
             minimumFractionDigits: 2,
         });
         return formatter.format(numericAmount);
     } catch (error) {
         throw new Error(`Invalid currency code: ${currencyCode}`);
     }
 }