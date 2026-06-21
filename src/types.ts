/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ExperienceCategory {
  NAUTICO = "nautico",
  OFF_ROAD = "off-road",
  CULTURA = "cultura",
  GASTRONOMIA = "gastronomia",
  TEMPORADA = "temporada",
}

export interface Experience {
  id: string;
  name: string;
  slug: string;
  category: ExperienceCategory;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  capacity: number;
  priceFrom: number;
  included: string[];
  notIncluded: string[];
  meetingPoint: string;
  coordinates: { lat: number; lng: number };
  photos: string[];
  videoEmbed?: string;
  whatsappMessage?: string;
  status: "active" | "paused" | "draft";
  featured: boolean;
  badge?: "mais-vendido" | "novidade" | "temporada" | "";
  schedules?: string[]; // Dynamic schedules list managed by admin
  recommendations?: string[]; // Suggested related experience ids
  faqs?: { question: string; answer: string }[]; // List of custom FAQs
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  experienceInterest: string[]; // List of experience ids
  preferredDate?: string;
  groupSize: number;
  origin: "formulario" | "whatsapp" | "instagram";
  status: "novo" | "atendendo" | "proposta" | "fechado" | "perdido";
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  coverImage: string;
  excerpt: string;
  body: string; // supports rich text/Markdown
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
  status: "published" | "draft" | "scheduled";
  publishedAt: string;
  views: number;
  readTime: number; // in minutes
}

export interface GlobalSettings {
  whatsappNumber: string;
  whatsappGreeting: string;
  businessHours: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    tiktok: string;
    whatsapp: string;
  };
  diferencialTitle?: string;
  diferencialDescription?: string;
}

export interface BookingCartItem {
  experienceId: string;
  date: string;
  schedule: string; // Time selected of the experience s.a. "08:00"
  adults: number;
  children: number;
  infants: number;
  people: number; // Total count (adults + children + infants)
  observations: string; // Optional client observations
  dayIndex?: number; // Manual sequence organizer (Day 1, Day 2 etc)
}
