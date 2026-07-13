/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery?: string[];
  institutionalText?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export enum ExperienceCategory {
  NAUTICO = "nautico",
  OFF_ROAD = "off-road",
  CULTURA = "cultura",
  GASTRONOMIA = "gastronomia",
  TEMPORADA = "temporada",
}

export interface MediaItem {
  id: string;
  type: "image" | "video" | "video_vertical" | "video_institutional" | "image_360";
  url: string;
  originalUrl?: string;
  cropData?: any;
  title?: string;
}

export interface Partner {
  id: string;
  type: "passeio" | "hospedagem" | "transporte" | "fotografo" | "restaurante" | "outro";
  companyName: string;
  tradingName: string;
  cnpj_cpf: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  commissionType: "percent" | "fixed";
  commissionValue: number;
  pixKey?: string;
  bankInfo?: string;
  status: "active" | "inactive";
  notes?: string;
  contractUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Courtesy {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  active?: boolean;
}

export interface RoomCategory {
  id: string;
  name: string; // e.g., Duplo, Triplo, Master
  capacity: number;
  sellRate: number; // Tarifa venda desta categoria (por diária)
  calendar?: Record<string, { status: "open" | "closed" }>; // Disponibilidade
}

export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  category: "hotel" | "pousada" | "hostel" | "casa" | "apartamento";
  typeTag?: string; // e.g. "boutique", "pe-na-areia", "vista" - used for filtering
  destinationId: string;
  partnerId: string;
  description: string;
  amenities: string[];
  courtesies?: Courtesy[];
  photos: string[];
  location: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  netRate: number; // Tarifa custo base
  sellRate: number; // Tarifa venda base (Valor por diária)
  roomCategories?: RoomCategory[];
  markup: number;
  commission: number;
  status: "active" | "paused" | "draft";
  
  // OS Financial Pricing Intelligence - reused from passeios
  calendar?: Record<string, {
    status: "open" | "closed";
    adultPrice: number;
    childPrice: number;
    babyPrice: number;
  }>;
  pricing?: {
    adultPrice: number; // Valor da diária base
    childPrice?: number;
    babyPrice?: number;
    promotionalAdultPrice?: number;
  };

  // Accommodation Specific Rules
  policies?: string[];
  restrictions?: string[];
  occupancyRules?: string;
  
  // Marketing & UI fields
  tag?: string; // e.g. "CONFORTO & TRADIÇÃO"
  rating?: number;
  reviews?: number;
  highlight?: string;
  specialFeatures?: string[];
  idealProfile?: string;
  distances?: { label: string; distance: string }[];
  whatsappMessage?: string;
  priceDisplay?: string; // e.g. "A partir de R$ 380 / noite"

  createdAt: string;
  updatedAt: string;
}

export interface FinancialTransaction {
  id: string;
  type: "receita" | "despesa" | "comissao_parceiro" | "comissao_afiliado" | "imposto";
  description: string;
  amount: number;
  date: string;
  status: "pago" | "pendente" | "cancelado";
  referenceId?: string; // ID da reserva, passeio, or partner
  referenceType?: "reservation" | "partner" | "affiliate" | "system";
  paymentMethod?: "pix" | "credit_card" | "boleto" | "transfer";
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  clientId: string;
  leadId?: string;
  dateCreated: string;
  validUntil: string;
  status: "draft" | "sent" | "approved" | "rejected";
  items: {
    type: "experience" | "accommodation" | "transfer" | "other";
    itemId: string;
    name: string;
    date: string;
    pax: number;
    netRate: number;
    sellRate: number;
    discount: number;
    total: number;
  }[];
  totals: {
    netTotal: number;
    sellTotal: number;
    discountTotal: number;
    finalTotal: number;
    profit: number;
    profitMargin: number;
  };
  notes?: string;
  paymentTerms?: string;
}

export type OSUserRole = "admin" | "staff" | "partner" | "affiliate" | "client";

export interface Experience {
  id: string;
  name: string;
  slug: string;
  destinationId?: string; // Link to Destination
  category: ExperienceCategory | string; // Allow string for dynamic categories
  tags?: string[]; // Array of tag IDs or strings
  shortDescription: string;
  fullDescription: string;
  duration: string;
  capacity: number;
  
  // OS Financial Pricing Intelligence
  netRate?: number; // Valor de custo com o parceiro
  priceFrom: number; // Valor final de venda (Base)
  promotionalPrice?: number;
  markup?: number; // Percentage
  
  included: string[];
  notIncluded: string[];
  courtesies?: Courtesy[];
  meetingPoint: string;
  coordinates: { lat: number; lng: number };
  photos: string[];
  mediaGallery?: MediaItem[];
  videoEmbed?: string;
  highlights?: string[];
  bringItems?: string[];
  
  partnerId?: string; // OS Partner integration
  partnerName?: string;
  showNauticalBulletin?: boolean;
  
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
  effortLevel?: string; // e.g. "Leve", "Moderado", "Intenso"
  bestTime?: string; // e.g. "Manhã", "Tarde", "Pôr do Sol"
  idealFor?: string; // e.g. "Casais e Famílias", "Aventureiros"
  bestSeason?: string; // e.g. "O ano inteiro", "Verão"
  schedules?: string[]; // Dynamic schedules list managed by admin
  recommendations?: string[]; // Suggested related experience ids
  recommendedAccommodations?: string[]; // Suggested related accommodations
  itinerary?: string[]; // Optional itinerary property
  faqs?: { question: string; answer: string }[]; // List of custom FAQs
  policies?: string[]; // List of policies (e.g. payment, cancellation)
  checkInMinutesBefore?: number; // Custom check-in lead time (minutes)
  durationMinutes?: number; // Custom tour duration (minutes)
  safetyBufferMinutes?: number; // Custom safety buffer before another tour (minutes)
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
  email?: string;
  experienceInterest?: string[]; // List of experience ids
  preferredDate?: string;
  groupSize?: number;
  origin: "formulario" | "whatsapp" | "instagram" | "direct" | "google" | "ads" | "seo";
  status: "novo" | "atendendo" | "proposta" | "fechado" | "perdido";
  
  // Intelligent Tracking & Attribution
  attribution?: {
    source?: string; // UTM Source
    medium?: string; // UTM Medium
    campaign?: string; // UTM Campaign
    term?: string; // UTM Term
    content?: string; // UTM Content
    referrer?: string;
    entryPage?: string;
    conversionPage?: string;
    gclid?: string; // Google Click ID
    fbclid?: string; // Facebook Click ID
    affiliateRef?: string; // Slug of the affiliate
  };
  
  metadata?: {
    device?: string;
    browser?: string;
    os?: string;
    city?: string;
    state?: string;
    firstAccess?: string;
    lastAccess?: string;
    channel?: string;
  };

  tags?: string[]; // e.g. ["Instagram", "Google", "Página de Passeio"]
  assignedTo?: string; // Staff member ID
  history: LeadHistoryItem[];
  notes?: string[];
  
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface LeadHistoryItem {
  id: string;
  timestamp: string;
  type: "status_change" | "note_added" | "contact_attempt" | "proposal_sent" | "system_log";
  description: string;
  user?: string; // Responsible user (Staff)
  metadata?: any;
}

export interface UserJourneyEvent {
  id: string;
  anonymousId?: string; // For non-logged users
  userId?: string; // For logged users
  timestamp: string;
  type: "page_view" | "interaction" | "conversion" | "abandonment";
  page: string;
  action: string; // e.g. "visit_home", "click_whatsapp", "start_itinerary"
  metadata?: {
    duration?: number;
    elementId?: string;
    experienceId?: string;
    path?: string;
    [key: string]: any;
  };
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
  passengerMessages?: string[];
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

  // Configuration for Wizard Messages

  // Affiliate System
  affiliateCookieDurationDays?: number; // Configurable cookie duration for affiliates
}

export interface Affiliate {
  id: string;
  userId?: string; // Linked user account (role: afiliado)
  name: string;
  email: string;
  phone: string;
  slug: string; // The unique code/ref
  commissionRate: number; // e.g. 10 for 10%
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  // Stats
  clicks: number;
  uniqueVisitors: number;
  conversions: number; // Approved reservations
  revenueGenerated: number;
  commissionsAccrued: number;
  commissionsPaid: number;
}

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  reservationId?: string;
  leadId?: string;
  type: 'lead' | 'reservation';
  amount: number; // Purchase amount
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  updatedAt: string;
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

// User Roles and Permissions Architecture
export type UserRole = 
  | "cliente"
  | "admin"
  | "equipe"
  | "afiliado"
  | "parceiro_passeio"
  | "parceiro_hospedagem"
  | "restaurante"
  | "fotografo"
  | "transfer"
  | "prestador_servico";

export type UserPermission = 
  | "access_guideos"
  | "manage_experiences"
  | "manage_accommodations"
  | "manage_leads"
  | "manage_affiliates"
  | "manage_financials"
  | "view_reports";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  preferences?: string[];
  favorites?: string[]; // IDs of experiences, partners, posts
  roles: UserRole[];
  permissions?: UserPermission[];
}

export type ClientUser = User; // Backward compatibility alias

export interface ClientReservation {
  id: string;
  userId: string;
  experienceId: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled" | "pending" | "new";
  pax: number;
  voucherCode?: string;
  meetingPoint?: string;
  rules?: string[];
  bringItems?: string[];
  avoidItems?: string[];
  adults?: number;
  children?: number;
  infants?: number;
  affiliateRef?: string;
}

export interface SavedItinerary {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  clientCity: string;
  arrivalDate: string;
  departureDate: string;
  stayDays: number;
  budget?: string;
  profile?: string;
  selectedHotelId?: string | null;
  totalEstimate: number;
  createdAt: string;
  items: BookingCartItem[];
  destinationName?: string;
  status?: "Aguardando atendimento" | "Em negociação" | "Confirmado";
  affiliateRef?: string;
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

export interface TourScheduleDetails {
  id: string;
  name: string;
  checkInMinutesBefore: number;
  checkInTimeStr: string;
  departureTimeStr: string;
  durationMinutes: number;
  returnTimeStr: string;
  checkInStartMin: number;
  departureMin: number;
  returnMin: number;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 480; // default 08:00
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

export function minutesToTimeStr(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getTourScheduleDetails(exp: Experience, scheduleStr: string): TourScheduleDetails {
  const schedule = scheduleStr || (exp.schedules && exp.schedules[0]) || "08:00";
  const departureMin = parseTimeToMinutes(schedule);
  
  let durationMinutes = 180; // default 3 hours
  if (exp.durationMinutes !== undefined && exp.durationMinutes !== null) {
    durationMinutes = exp.durationMinutes;
  } else if (exp.duration) {
    const cleanDur = exp.duration.toLowerCase();
    if (cleanDur.includes("14")) durationMinutes = 14 * 60;
    else if (cleanDur.includes("4")) durationMinutes = 4 * 60;
    else if (cleanDur.includes("3")) durationMinutes = 3 * 60;
    else if (cleanDur.includes("2h30")) durationMinutes = 150;
    else if (cleanDur.includes("2.5")) durationMinutes = 150;
    else if (cleanDur.includes("2")) durationMinutes = 120;
    else if (cleanDur.includes("5")) durationMinutes = 5 * 60;
    else if (cleanDur.includes("6")) durationMinutes = 6 * 60;
  }
  
  let checkInMinutesBefore = 30; // default 30 mins
  if (exp.checkInMinutesBefore !== undefined && exp.checkInMinutesBefore !== null) {
    checkInMinutesBefore = exp.checkInMinutesBefore;
  } else if (exp.id.includes("barco") || exp.id.includes("mar") || exp.id.includes("lancha")) {
    checkInMinutesBefore = 60; // boat tours need 1 hour check-in
  } else if (exp.id.includes("bate-volta")) {
    checkInMinutesBefore = 15;
  }
  
  const checkInStartMin = departureMin - checkInMinutesBefore;
  const returnMin = departureMin + durationMinutes;
  
  return {
    id: exp.id,
    name: exp.name,
    checkInMinutesBefore,
    checkInTimeStr: minutesToTimeStr(checkInStartMin),
    departureTimeStr: schedule,
    durationMinutes,
    returnTimeStr: minutesToTimeStr(returnMin),
    checkInStartMin,
    departureMin,
    returnMin
  };
}

export function checkSchedulingConflict(
  itemA: BookingCartItem,
  itemB: BookingCartItem,
  experiences: Experience[]
): { hasConflict: boolean; reason?: string } {
  // 1. Separate Days Check: If both are on different days, they CANNOT conflict.
  // We normalize dayIndex to 1 if not defined, and compare them.
  const dayIdxA = itemA.dayIndex !== undefined && itemA.dayIndex !== null ? itemA.dayIndex : 1;
  const dayIdxB = itemB.dayIndex !== undefined && itemB.dayIndex !== null ? itemB.dayIndex : 1;
  
  if (dayIdxA !== dayIdxB) {
    return { hasConflict: false };
  }
  
  // We normalize dates (using the same dayIndex mapping if missing) and compare them.
  const dateStrA = itemA.date || addDaysToBrazilDate(getBrazilLocalDate(), dayIdxA);
  const dateStrB = itemB.date || addDaysToBrazilDate(getBrazilLocalDate(), dayIdxB);
  
  if (dateStrA !== dateStrB) {
    return { hasConflict: false };
  }
  
  const expA = experiences.find(e => e.id === itemA.experienceId);
  const expB = experiences.find(e => e.id === itemB.experienceId);
  if (!expA || !expB) return { hasConflict: false };
  
  const schedA = getTourScheduleDetails(expA, itemA.schedule);
  const schedB = getTourScheduleDetails(expB, itemB.schedule);
  
  // Determine which is earlier
  const first = schedA.departureMin <= schedB.departureMin ? schedA : schedB;
  const second = schedA.departureMin <= schedB.departureMin ? schedB : schedA;
  
  const gap = second.checkInStartMin - first.returnMin;
  
  // Safety buffer before next tour: use max safetyBufferMinutes of the two experiences, or 60 mins default
  const bufferA = expA.safetyBufferMinutes !== undefined && expA.safetyBufferMinutes !== null ? expA.safetyBufferMinutes : 60;
  const bufferB = expB.safetyBufferMinutes !== undefined && expB.safetyBufferMinutes !== null ? expB.safetyBufferMinutes : 60;
  const requiredBuffer = Math.max(bufferA, bufferB);
  
  if (gap < requiredBuffer) {
    const gapMin = gap;
    let reason = "";
    if (gapMin < 0) {
      reason = `O passeio "${first.name}" (previsto até ${first.returnTimeStr}) se sobrepõe ao horário de check-in de "${second.name}" (que inicia às ${second.checkInTimeStr}).`;
    } else {
      reason = `O intervalo entre "${first.name}" (término às ${first.returnTimeStr}) e o check-in de "${second.name}" (início às ${second.checkInTimeStr}) é de apenas ${gapMin} minutos. É necessária uma margem de segurança de pelo menos ${requiredBuffer} minutos.`;
    }
    return { hasConflict: true, reason };
  }
  
  return { hasConflict: false };
}

export interface ThematicItineraryItem {
  id: string;
  type: "experience" | "accommodation" | "partner" | "custom" | "blogpost";
  refId?: string; // id of the reference (e.g., experience id, accommodation id)
  customName?: string; // if it's just text
  timeOfDay?: string; // e.g., 'Manhã', 'Tarde', 'Noite', 'Dia Inteiro'
}

export interface ThematicItineraryDay {
  dayNumber: number;
  title: string; // e.g. "Chegada e Relaxamento"
  items: ThematicItineraryItem[];
}

export interface ThematicItinerary {
  id: string;
  destinationId: string; // The destination this itinerary belongs to
  slug: string;
  name: string;
  description: string;
  days: number;
  audience: string[]; // Público recomendado
  priceRange: string; // Faixa de preço estimada
  bestSeason: string; // Melhor época
  difficulty: string; // Dificuldade
  coverImage: string;
  status: "active" | "inactive";
  schedule: ThematicItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

export function getBrazilLocalDate(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date); // Always returns YYYY-MM-DD in Brasilia time
}

export function addDaysToBrazilDate(baseDateStr: string, daysToAdd: number): string {
  const cleanBase = baseDateStr || getBrazilLocalDate();
  const date = new Date(`${cleanBase}T12:00:00`);
  date.setDate(date.getDate() + daysToAdd);
  return getBrazilLocalDate(date);
}
