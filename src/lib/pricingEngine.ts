import { Experience, Accommodation, BookingCartItem, getBrazilLocalDate, addDaysToBrazilDate } from "../types";
export interface AdditionalService {
  id: string;
  type: "transfer" | "restaurante" | "seguro" | "aluguel_veiculo" | "outro";
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

export interface PricingEngineResult {
  experiencesCost: number;
  lodgingCost: number;
  additionalServicesCost: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  
  // Detailed lodging calculation summary
  lodgingDetail?: {
    roomsNeeded: number;
    baseGuestsPerRoom: number;
    maxCapacityPerRoom: number;
    extraGuestsCount: number;
    extraGuestPriceApplied: number;
    chargeType: "per_person" | "per_room";
    daysCount: number;
    dailyBreakdown: {
      date: string;
      basePrice: number;
      extraGuestTotal: number;
      totalDayPrice: number;
    }[];
  };

  // Detailed experiences breakdown
  experiencesDetail: {
    experienceId: string;
    name: string;
    date: string;
    adults: number;
    children: number;
    infants: number;
    adultPrice: number;
    childPrice: number;
    babyPrice: number;
    total: number;
    isClosed: boolean;
  }[];

  // Additional services breakdown
  additionalServicesDetail: {
    serviceId: string;
    type: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[];

  // Free items & courtesies included
  courtesies: {
    origin: string; // "hotel" or experience name
    name: string;
    description?: string;
  }[];
}

/**
 * Highly modular and robust pricing calculation engine for Guida Trips.
 * Prepared for complex real-world tourism rules (calendar rates, occupancy capacity, surcharges).
 */
export const PricingEngine = {
  /**
   * Helper to get precise tariff for an experience on a specific date.
   */
  getExperienceTariff(exp: Experience, dateStr: string) {
    const baseAdult = exp.pricing?.adultPrice ?? exp.priceFrom;
    // Children default to 50% of adult price if not set
    const baseChild = exp.pricing?.childPrice ?? (exp.promotionalPrice || exp.priceFrom) * 0.5;
    const baseBaby = exp.pricing?.babyPrice ?? 0;

    if (!dateStr) {
      return { 
        adultPrice: baseAdult, 
        childPrice: baseChild, 
        babyPrice: baseBaby, 
        isClosed: true, 
        hasNoTariff: true 
      };
    }

    const customData = exp.calendar?.[dateStr];
    if (customData) {
      return {
        adultPrice: customData.adultPrice,
        childPrice: customData.childPrice,
        babyPrice: customData.babyPrice,
        isClosed: customData.status === "closed",
        hasNoTariff: false
      };
    }

    return { 
      adultPrice: baseAdult, 
      childPrice: baseChild, 
      babyPrice: baseBaby, 
      isClosed: false, 
      hasNoTariff: false 
    };
  },

  /**
   * Calculates the lodging cost considering rules such as max capacity, extra people, and daily tariff calendar.
   */
  calculateLodging(
    acc: Accommodation,
    arrivalDate: string,
    stayDays: number,
    guests: GuestCount,
    selectedRoomId?: string | null
  ): NonNullable<PricingEngineResult["lodgingDetail"]> & { totalCost: number } {
    const totalGuestsCount = guests.adults + guests.children;
    const startDateStr = arrivalDate || getBrazilLocalDate();
    
    // Heuristic for charge type
    const chargeType: "per_person" | "per_room" = 
      acc.category === "hostel" ? "per_person" : "per_room";

    let roomsNeeded = 1;
    let baseGuestsPerRoom = 2;
    let maxCapacityPerRoom = 4;
    let extraGuestsCount = 0;
    
    // Check if we have defined room categories
    let useCategoriesLogic = false;
    let bestCategoryRate = 0;

    if (acc.roomTypes && acc.roomTypes.length > 0) {
      useCategoriesLogic = true;
      let targetRoom = undefined;
      
      if (selectedRoomId) {
        targetRoom = acc.roomTypes.find(rc => rc.id === selectedRoomId);
      }
      
      if (targetRoom) {
        roomsNeeded = Math.ceil(totalGuestsCount / targetRoom.maxGuests) || 1;
        bestCategoryRate = targetRoom.basePrice * roomsNeeded;
      } else {
        const fittingRooms = acc.roomTypes.filter(rc => rc.maxGuests >= totalGuestsCount);
        if (fittingRooms.length > 0) {
          const bestRoom = fittingRooms.sort((a, b) => a.basePrice - b.basePrice)[0];
          roomsNeeded = 1;
          bestCategoryRate = bestRoom.basePrice;
        } else {
          const bestRoom = [...acc.roomTypes].sort((a, b) => b.maxGuests - a.maxGuests)[0];
          roomsNeeded = Math.ceil(totalGuestsCount / bestRoom.maxGuests) || 1;
          bestCategoryRate = bestRoom.basePrice * roomsNeeded;
        }
      }
    } else {
      // Legacy heuristic
      maxCapacityPerRoom = (acc as any).maxCapacity || acc.pricing?.adultPrice ? 4 : 4; 
      baseGuestsPerRoom = (acc as any).baseGuests || 2; 
      
      if (chargeType === "per_room") {
        roomsNeeded = Math.ceil(totalGuestsCount / maxCapacityPerRoom) || 1;
      }

      if (chargeType === "per_room") {
        const baseGuestsAllowedTotal = roomsNeeded * baseGuestsPerRoom;
        if (totalGuestsCount > baseGuestsAllowedTotal) {
          extraGuestsCount = totalGuestsCount - baseGuestsAllowedTotal;
        }
      }
    }

    const dailyBreakdown: {
      date: string;
      basePrice: number;
      extraGuestTotal: number;
      totalDayPrice: number;
    }[] = [];

    let totalCost = 0;
    let extraGuestPriceApplied = 0;

    for (let i = 0; i < stayDays; i++) {
      const currentDateStr = addDaysToBrazilDate(startDateStr, i);
      const calendarDay = acc.calendar?.[currentDateStr];

      // Base daily price
      const basePrice = calendarDay?.adultPrice 
        || acc.pricing?.adultPrice 
        || acc.sellRate 
        || 0;

      let extraGuestTotal = 0;
      let totalDayPrice = 0;

      if (useCategoriesLogic) {
        // Find best period for this day if target room or best room exists
        let currentDayRate = bestCategoryRate;
        const activeRoom = targetRoom;
        if (activeRoom && activeRoom.pricingPeriods && activeRoom.pricingPeriods.length > 0) {
          const matchingPeriod = activeRoom.pricingPeriods.find(p => p.startDate <= currentDateStr && p.endDate >= currentDateStr);
          if (matchingPeriod) {
            currentDayRate = matchingPeriod.price * roomsNeeded;
          } else {
             currentDayRate = activeRoom.basePrice * roomsNeeded;
          }
        }
        totalDayPrice = currentDayRate;
      } else if (chargeType === "per_room") {
        // Rooms cost + additional guests cost
        const roomsCost = basePrice * roomsNeeded;
        
        // Extra guest rate (usually 30% of base rate if not set explicitly)
        const singleExtraPrice = (acc as any).extraGuestPrice 
          || (acc.pricing as any)?.extraGuestPrice 
          || Math.round(basePrice * 0.3);
        
        extraGuestPriceApplied = singleExtraPrice;
        extraGuestTotal = extraGuestsCount * singleExtraPrice;
        totalDayPrice = roomsCost + extraGuestTotal;
      } else {
        // Hostel or per_person charge
        const childDayPrice = calendarDay?.childPrice 
          || acc.pricing?.childPrice 
          || Math.round(basePrice * 0.5);
        const babyDayPrice = calendarDay?.babyPrice 
          || acc.pricing?.babyPrice 
          || 0;

        totalDayPrice = (basePrice * guests.adults) 
          + (childDayPrice * guests.children) 
          + (babyDayPrice * guests.infants);
      }

      dailyBreakdown.push({
        date: currentDateStr,
        basePrice: useCategoriesLogic ? bestCategoryRate : basePrice,
        extraGuestTotal,
        totalDayPrice
      });

      totalCost += totalDayPrice;
    }

    return {
      totalCost,
      roomsNeeded,
      baseGuestsPerRoom,
      maxCapacityPerRoom,
      extraGuestsCount,
      extraGuestPriceApplied,
      chargeType,
      daysCount: stayDays,
      dailyBreakdown
    };
  },

  /**
   * Master calculation method to compute everything cleanly and dynamically.
   */
  calculate({
    cart,
    experiences,
    selectedAccommodation,
    arrivalDate,
    stayDays,
    guests,
    selectedRoomId,
    additionalServices = []
  }: {
    cart: BookingCartItem[];
    experiences: Experience[];
    selectedAccommodation?: Accommodation | null;
    arrivalDate: string;
    stayDays: number;
    guests: GuestCount;
    selectedRoomId?: string | null;
    additionalServices?: AdditionalService[];
  }): PricingEngineResult {
    // 1. Calculate Experiences Cost
    const experiencesDetail: PricingEngineResult["experiencesDetail"] = [];
    let experiencesCost = 0;

    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (!exp) return;

      const tariff = this.getExperienceTariff(exp, item.date);
      const adults = item.adults ?? guests.adults;
      const children = item.children ?? guests.children;
      const infants = item.infants ?? guests.infants;

      const adultsTotal = tariff.adultPrice * adults;
      const kidsTotal = tariff.childPrice * children;
      const babiesTotal = tariff.babyPrice * infants;
      const totalItemCost = adultsTotal + kidsTotal + babiesTotal;

      experiencesDetail.push({
        experienceId: exp.id,
        name: exp.name,
        date: item.date,
        adults,
        children,
        infants,
        adultPrice: tariff.adultPrice,
        childPrice: tariff.childPrice,
        babyPrice: tariff.babyPrice,
        total: totalItemCost,
        isClosed: tariff.isClosed
      });

      experiencesCost += totalItemCost;
    });

    // 2. Calculate Lodging Cost
    let lodgingCost = 0;
    let lodgingDetail: PricingEngineResult["lodgingDetail"] | undefined;

    if (selectedAccommodation) {
      const lodgingCalc = this.calculateLodging(
        selectedAccommodation,
        arrivalDate,
        stayDays,
        guests,
        selectedRoomId
      );
      lodgingCost = lodgingCalc.totalCost;
      lodgingDetail = {
        roomsNeeded: lodgingCalc.roomsNeeded,
        baseGuestsPerRoom: lodgingCalc.baseGuestsPerRoom,
        maxCapacityPerRoom: lodgingCalc.maxCapacityPerRoom,
        extraGuestsCount: lodgingCalc.extraGuestsCount,
        extraGuestPriceApplied: lodgingCalc.extraGuestPriceApplied,
        chargeType: lodgingCalc.chargeType,
        daysCount: lodgingCalc.daysCount,
        dailyBreakdown: lodgingCalc.dailyBreakdown
      };
    }

    // 3. Calculate Additional Services Cost
    const additionalServicesDetail: PricingEngineResult["additionalServicesDetail"] = [];
    let additionalServicesCost = 0;

    additionalServices.forEach(service => {
      const totalService = service.price * service.quantity;
      additionalServicesDetail.push({
        serviceId: service.id,
        type: service.type,
        name: service.name,
        price: service.price,
        quantity: service.quantity,
        total: totalService
      });
      additionalServicesCost += totalService;
    });

    // 4. Courtesies Compilation
    const courtesies: PricingEngineResult["courtesies"] = [];

    // Accommodation courtesies
    if (selectedAccommodation && selectedAccommodation.courtesies) {
      selectedAccommodation.courtesies.forEach(c => {
        courtesies.push({
          origin: selectedAccommodation.name,
          name: c.name,
          description: c.description
        });
      });
    }

    // Experiences courtesies
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp && exp.courtesies) {
        exp.courtesies.forEach(c => {
          // Avoid duplicating same courtesy name from same experience
          if (!courtesies.some(already => already.origin === exp.name && already.name === c.name)) {
            courtesies.push({
              origin: exp.name,
              name: c.name,
              description: c.description
            });
          }
        });
      }
    });

    const subtotal = experiencesCost + lodgingCost + additionalServicesCost;
    const discountTotal = 0; // Configurable hook for coupons or package discounts
    const total = subtotal - discountTotal;

    return {
      experiencesCost,
      lodgingCost,
      additionalServicesCost,
      subtotal,
      discountTotal,
      total,
      lodgingDetail,
      experiencesDetail,
      additionalServicesDetail,
      courtesies
    };
  }
};
