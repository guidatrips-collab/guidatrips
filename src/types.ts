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
  highlights?: string[];
  bringItems?: string[];
  partnerName?: string;
  promotionalPrice?: number;
  googleMapsUrl?: string;
  availability?: {
    type: "daily" | "specific_days";
    daysOfWeek?: number[];
    specificDates?: string[];
    blockedDates?: string[];
    slots: { time: string; capacity: number }[];
  };
  calendar?: Record<string, {
    status: "open" | "closed";
    adultPrice: number;
    childPrice: number;
    babyPrice: number;
  }>;
  pricing?: {
    adultPrice: number;
    childPrice?: number;
    babyPrice?: number;
    promotionalAdultPrice?: number;
  };
  whatsappMessage?: string;
  status: "active" | "paused" | "draft";
  featured: boolean;
  badge?: "mais-vendido" | "novidade" | "temporada" | "";
  location?: string; // e.g. "Arraial do Cabo", "Cabo Frio", "Búzios"
  departureCity?: string; // e.g. "Arraial do Cabo RJ", "Cabo Frio RJ"
  minAge?: string; // e.g. "2 anos"
  maxAge?: string; // e.g. "65 anos"
  schedules?: string[]; // Dynamic schedules list managed by admin
  recommendations?: string[]; // Suggested related experience ids
  itinerary?: string[]; // Optional itinerary property
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
  videoUrl?: string; // Add video url for tips
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

  // New customizable Home Page fields
  homeHeroImgUrl?: string;
  homeHeroTitle?: string;
  homeHeroDesc?: string;
  homeHeroBtnText?: string;
  homeHeroStats?: {
    value: string;
    label: string;
  }[];

  homeFilosofiaTag?: string;
  homeFilosofiaTitle?: string;
  homeFilosofiaDesc?: string;
  homeFilosofiaPillars?: {
    id: string;
    title: string;
    desc: string;
    badge: string;
    img?: string;
  }[];
  homeFilosofiaVideoTitle?: string;
  homeFilosofiaVideoSub?: string;

  homeCompassTag?: string;
  homeCompassTitle?: string;
  homeCompassDesc?: string;
  homeCategories?: {
    id: string;
    name?: string;
    label?: string;
    count: string;
    font?: string;
  }[];
  homeMapPoints?: {
    id: number;
    name: string;
    category: string;
    desc: string;
    coords: { top: string; left: string };
    img: string;
  }[];

  homeBannerTag?: string;
  homeBannerTitle?: string;
  homeBannerDesc?: string;
  homeBannerBtnText?: string;
  homeBannerImgUrl?: string;

  homeMimosTag?: string;
  homeMimosTitle?: string;
  homeMimosDesc?: string;
  homeMimosTabs?: {
    key: string;
    label?: string;
    badge: string;
    title: string;
    text: string;
    img: string;
  }[];

  homeLogisticaTag?: string;
  homeLogisticaTitle?: string;
  homeLogisticaDesc?: string;
  homeLogisticaImgUrl?: string;
  homeLogisticaPoints?: {
    title: string;
    desc: string;
  }[];

  homeHospedagens?: {
    id: string;
    name: string;
    location: string;
    rating: number;
    desc: string;
    img: string;
    whatsappMessage: string;
  }[];

  homePosts?: {
    title: string;
    slug: string;
    excerpt: string;
    img: string;
    date: string;
  }[];

  homeImageOverrides?: { [key: string]: string };

  homeFeedbackTag?: string;
  homeFeedbackTitle?: string;
  homeFeedbackDesc?: string;
  homeFeedbackList?: {
    name: string;
    role: string;
    city: string;
    quote: string;
    avatar: string;
  }[];

  homeGuideTag?: string;
  homeGuideTitle?: string;
  homeGuideDesc?: string;
  homeGuideBtnText?: string;
  
  // Client Area Settings
  clientReservations?: ClientReservation[];
  clientPartners?: ClientPartner[];
  clientUser?: ClientUser;
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

// Client Area / Viagem Entities
export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  preferences?: string[];
  favorites?: string[]; // IDs of experiences, partners, posts
}

export interface ClientReservation {
  id: string;
  userId: string;
  experienceId: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  pax: number;
  voucherCode: string;
  meetingPoint: string;
  rules: string[];
  bringItems: string[];
  avoidItems: string[];
}

export interface ClientPartner {
  id: string;
  category: "restaurantes" | "cafeterias" | "fotografos" | "buggy" | "mergulho" | "hospedagem";
  name: string;
  description: string;
  benefit: string;
  couponCode: string;
  img: string;
}

export interface ClientReview {
  id: string;
  userId: string;
  experienceId: string;
  rating: number;
  comment: string;
  photos: string[];
  date: string;
}
