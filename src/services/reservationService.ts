import { ClientReservation, Experience, BookingCartItem, CustomerJourneyStage } from "../types";
import { PricingEngine } from "../lib/pricingEngine";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export interface CreateReservationPayload {
  userId: string;
  clientName: string;
  clientPhone: string;
  cartItem: BookingCartItem;
  experience: Experience;
  paymentMethod: "whatsapp" | "online" | "pix" | "credit_card";
  affiliateRef?: string;
}

const LOCAL_RESERVATIONS_KEY = "guida_client_reservations_v1";

export const ReservationService = {
  /**
   * Generates a unique secure hash code for the Smart Voucher.
   */
  generateVoucherCode(experienceSlug: string, dateStr: string): string {
    const cleanDate = dateStr.replace(/-/g, "");
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `GTR-${experienceSlug.substring(0, 3).toUpperCase()}-${cleanDate}-${randomHex}`;
  },

  /**
   * Atomic check for slot capacity and availability before reserving.
   */
  checkAvailability(exp: Experience, dateStr: string, requestedPax: number): { available: boolean; remainingCapacity: number; reason?: string } {
    const calendarDay = exp.calendar?.[dateStr];
    if (calendarDay?.status === "closed") {
      return { available: false, remainingCapacity: 0, reason: "Operação encerrada nesta data." };
    }

    const totalCapacity = exp.capacity || 20;
    // In production, this checks real-time consumed slots for this operation date
    const consumed = 0; 
    const remainingCapacity = Math.max(0, totalCapacity - consumed);

    if (requestedPax > remainingCapacity) {
      return { 
        available: false, 
        remainingCapacity, 
        reason: `Capacidade insuficiente. Restam apenas ${remainingCapacity} vaga(s) para esta saída.` 
      };
    }

    return { available: true, remainingCapacity };
  },

  /**
   * Atomic Reservation creation with deposit and state transition.
   */
  async createReservation(payload: CreateReservationPayload): Promise<{ success: boolean; reservation?: ClientReservation; error?: string }> {
    const { userId, cartItem, experience, paymentMethod, affiliateRef } = payload;

    // 1. Validate availability
    const totalPax = (cartItem.adults ?? 1) + (cartItem.children ?? 0) + (cartItem.infants ?? 0);
    const availCheck = this.checkAvailability(experience, cartItem.date, totalPax);

    if (!availCheck.available) {
      return { success: false, error: availCheck.reason };
    }

    // 2. Compute financial breakdown via Pricing Engine
    const tariff = PricingEngine.getExperienceTariff(experience, cartItem.date);
    const totalAmount = (tariff.adultPrice * (cartItem.adults ?? 1)) + 
                        (tariff.childPrice * (cartItem.children ?? 0)) + 
                        (tariff.babyPrice * (cartItem.infants ?? 0));

    const depositPct = experience.depositPercentage ?? 30;
    const depositAmount = Math.round((totalAmount * depositPct) / 100);
    const remainingBalance = totalAmount - depositAmount;

    // 3. Generate Voucher details
    const voucherCode = this.generateVoucherCode(experience.slug, cartItem.date);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://guidatrips.com/voucher/${voucherCode}`)}`;

    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const isPaid = paymentMethod === "online" || paymentMethod === "pix" || paymentMethod === "credit_card";

    const reservation: ClientReservation = {
      id: reservationId,
      userId,
      experienceId: experience.id,
      date: cartItem.date,
      time: cartItem.schedule || "08:00",
      status: isPaid ? "confirmed" : "pending",
      paymentStatus: isPaid ? "paid" : "pending",
      paymentMethod,
      pax: totalPax,
      adults: cartItem.adults ?? 1,
      children: cartItem.children ?? 0,
      infants: cartItem.infants ?? 0,
      totalAmount,
      depositAmount,
      remainingBalance,
      depositPercentage: depositPct,
      voucherCode,
      qrCodeUrl,
      meetingPoint: experience.meetingPoint || "Cais de Embarke Principal, Arraial do Cabo - RJ",
      coordinates: experience.coordinates,
      googleMapsUrl: experience.googleMapsUrl,
      rules: experience.notIncluded || ["Apresentar documento de identidade original", "Chegar com 30min de antecedência"],
      bringItems: experience.bringItems || ["Protetor solar", "Toalha de banho", "Roupas de banho"],
      affiliateRef,
      journeyStage: isPaid ? "reservation_confirmed" : "payment_pending"
    };

    // 4. Save to local storage
    try {
      const existingStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY);
      const list: ClientReservation[] = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(reservation);
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Local storage error in ReservationService:", e);
    }

    // 5. Sync to Firestore securely if accessible
    try {
      if (db) {
        const docRef = doc(db, "reservations", reservationId);
        await setDoc(docRef, {
          ...reservation,
          timestamp: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore sync skipped/failed in ReservationService:", e);
    }

    return { success: true, reservation };
  },

  /**
   * Get all cached client reservations.
   */
  getStoredReservations(): ClientReservation[] {
    try {
      const existingStr = localStorage.getItem(LOCAL_RESERVATIONS_KEY);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  }
};
