import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function getValidAffiliateRef(): string | null {
  const stored = localStorage.getItem('guidatrips_affiliate_data');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.ref || !parsed.expiry) return null;
    
    if (new Date(parsed.expiry) < new Date()) {
      localStorage.removeItem('guidatrips_affiliate_data');
      return null;
    }
    
    return parsed.ref;
  } catch (e) {
    return null;
  }
}
