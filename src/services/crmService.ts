import { CustomerJourneyStage, SavedItinerary, BookingCartItem } from "../types";
import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export interface LeadRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  clientCity?: string;
  clientEmail?: string;
  destinationId?: string;
  destinationName?: string;
  arrivalDate?: string;
  departureDate?: string;
  paxCount?: number;
  totalEstimate?: number;
  depositEstimate?: number;
  journeyStage: CustomerJourneyStage;
  cartItemsCount?: number;
  cartSummary?: string[];
  status: "new" | "contacted" | "quote_sent" | "converted" | "lost" | "abandoned";
  source: "roteiro_inteligente" | "cart" | "whatsapp" | "direct";
  createdAt: string;
  updatedAt: string;
}

const CRM_LEADS_KEY = "guida_crm_leads_v1";

export const CRMService = {
  /**
   * Automatically captures/syncs lead information when a user interacts with the wizard or cart.
   */
  async captureLead(data: {
    id?: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    clientCity?: string;
    destinationId?: string;
    destinationName?: string;
    arrivalDate?: string;
    departureDate?: string;
    paxCount?: number;
    totalEstimate?: number;
    depositEstimate?: number;
    cartItems?: BookingCartItem[];
    journeyStage: CustomerJourneyStage;
    source?: LeadRecord["source"];
  }): Promise<string> {
    const leadId = data.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const nowIso = new Date().toISOString();

    const summary = data.cartItems ? data.cartItems.map(item => `${item.experienceId} (${item.date})`) : [];

    const leadRecord: LeadRecord = {
      id: leadId,
      clientName: data.clientName || "Viajante Anônimo",
      clientPhone: data.clientPhone || "",
      clientEmail: data.clientEmail || "",
      clientCity: data.clientCity || "",
      destinationId: data.destinationId || "",
      destinationName: data.destinationName || "Região dos Lagos",
      arrivalDate: data.arrivalDate || "",
      departureDate: data.departureDate || "",
      paxCount: data.paxCount || 1,
      totalEstimate: data.totalEstimate || 0,
      depositEstimate: data.depositEstimate || 0,
      journeyStage: data.journeyStage,
      cartItemsCount: data.cartItems?.length || 0,
      cartSummary: summary,
      status: data.journeyStage === "quote_requested" ? "quote_sent" 
            : data.journeyStage === "reservation_confirmed" ? "converted" 
            : "new",
      source: data.source || "roteiro_inteligente",
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Save to local storage cache first for instant UX
    try {
      const existingStr = localStorage.getItem(CRM_LEADS_KEY);
      const leadsList: LeadRecord[] = existingStr ? JSON.parse(existingStr) : [];
      const idx = leadsList.findIndex(l => l.id === leadId || (l.clientPhone && l.clientPhone === data.clientPhone));

      if (idx >= 0) {
        leadsList[idx] = { ...leadsList[idx], ...leadRecord, updatedAt: nowIso };
      } else {
        leadsList.unshift(leadRecord);
      }
      localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(leadsList));
    } catch (e) {
      console.warn("Local storage write error in CRMService:", e);
    }

    // Sync to Firestore securely if accessible
    try {
      if (db) {
        const docRef = doc(db, "leads", leadId);
        await setDoc(docRef, {
          ...leadRecord,
          timestamp: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore sync skipped/failed in CRMService:", e);
    }

    return leadId;
  },

  /**
   * Retrieve cached leads for the Guida OS CRM dashboard.
   */
  getStoredLeads(): LeadRecord[] {
    try {
      const existingStr = localStorage.getItem(CRM_LEADS_KEY);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  }
};
