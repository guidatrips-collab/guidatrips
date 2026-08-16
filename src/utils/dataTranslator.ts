import { Experience, Accommodation, BlogPost, Destination } from "../types";
import { SupportedLanguage } from "../context/LanguageContext";

type TranslatedExperienceFields = Partial<Omit<Experience, "badge">> & { badge?: string; tagText?: string };

/**
 * Static translations dictionary for Experiences
 */
const EXPERIENCE_TRANSLATIONS: Record<string, Record<SupportedLanguage, TranslatedExperienceFields>> = {
  "Bate e Volta Arraial do Cabo: O Paraíso Saindo do Rio!": {
    pt: {},
    en: {
      name: "Day Trip Arraial do Cabo: Paradise Departing from Rio!",
      shortDescription: "Depart from Rio de Janeiro and experience an unforgettable day in the 'Brazilian Caribbean' with maximum comfort and convenience.",
      badge: "BEST SELLER",
      departureCity: "Rio de Janeiro RJ (South Zone / Downtown)",
      effortLevel: "Light (Bus Trip + Boat)",
      bestTime: "Full Day (Departure 06:00 AM)",
      idealFor: "Families & First-time Visitors",
      bestSeason: "Year-round (Especially outside holidays)",
      included: [
        "Premium Rio-Arraial-Rio transportation with AC",
        "Licensed Cadastur Tourism Guide",
        "Two-story Boat Tour with water slide and Wi-Fi",
        "Full Barbecue on board (beef, pork, chicken, sausage & sides)",
        "1 Large Caipirinha, 2 Large Soft Drinks or Juices",
        "1 Exclusive glass & seasonal fruits"
      ],
      notIncluded: [
        "Desserts",
        "Snorkeling masks (rental on boat if available)",
        "Navy pier fee: R$ 15.00 (paid in cash)",
        "Local transport fee: R$ 20.00 (paid in cash)"
      ],
      meetingPoint: "Boarding at South Zone hotels or strategic meeting points in Downtown Rio",
      itinerary: [
        "Farol Island: One of the most famous and preserved beaches, accessible only by boat.",
        "Pontal do Atalaia Beaches: Two paradise beaches connected by white sand.",
        "Blue Grotto: A fascinating cave with a natural light spectacle.",
        "Gorilla Rock: An iconic point with rock formations resembling a gorilla.",
        "Turtle Rock: A rock formation reminiscent of a turtle.",
        "Crevice of Our Lady: A scenic narrow opening in the rocks.",
        "Forno Beach: A charming beach with calm, crystal-clear waters.",
        "Meteorite Impact: A unique geological point of interest.",
        "Grotto of Love: A small charming cave surrounded by local legends."
      ]
    },
    es: {
      name: "Excursión de un Día Arraial do Cabo: ¡El Paraíso desde Río!",
      shortDescription: "Sal de Río de Janeiro y vive un día inolvidable en el 'Caribe Brasileño' con el máximo confort y conveniencia.",
      badge: "MÁS VENDIDO",
      departureCity: "Río de Janeiro RJ (Zona Sur / Centro)",
      effortLevel: "Leve (Autobús + Barco)",
      bestTime: "Día Completo (Salida 06:00 AM)",
      idealFor: "Familias y Visitantes de Primera Vez",
      bestSeason: "Todo el Año (Especialmente fuera de festivos)",
      included: [
        "Transporte Premium Río-Arraial-Río con aire acondicionado",
        "Guía de Turismo acreditado Cadastur",
        "Paseo en Barco de dos pisos con tobogán acuático y Wi-Fi",
        "Asado completo a bordo (carne de res, cerdo, pollo, chorizo y guarniciones)",
        "1 Caipirinha grande, 2 Refrescos o Jugos grandes",
        "1 Copa exclusiva y frutas de estación"
      ],
      notIncluded: [
        "Postres",
        "Máscaras de buceo (alquiler en el barco si está disponible)",
        "Tasa del muelle de la Marina: R$ 15,00 (en efectivo)",
        "Tasa de transporte local: R$ 20,00 (en efectivo)"
      ],
      meetingPoint: "Embarque en hoteles de la Zona Sur o puntos de encuentro en el Centro de Río",
      itinerary: [
        "Isla del Faro: Una de las playas más famosas y preservadas, accesible solo en barco.",
        "Playitas de Pontal do Atalaia: Dos playas paradisíacas conectadas por arena blanca.",
        "Gruta Azul: Una cueva fascinante con un espectáculo de luz natural.",
        "Roca del Gorila: Formación rocosa semejante al perfil de un gorila.",
        "Roca de la Tortuga: Formación rocosa que recuerda una tortuga.",
        "Grieta de Nuestra Señora: Estrecha abertura en las rocas de gran valor escénico.",
        "Playa del Forno: Una encantadora playa de aguas calmas y cristalinas.",
        "Impacto del Meteorito: Punto de interés geológico único.",
        "Gruta del Amor: Pequeña cueva llena de encanto y leyendas locales."
      ]
    }
  },
  "Experiência Gastronômica & Mar: Passeio de Barco Completo em Arraial do Cabo": {
    pt: {},
    en: {
      name: "Gastronomic & Sea Experience: Full Boat Tour in Arraial do Cabo",
      shortDescription: "Treat yourself to a royal experience in the Brazilian Caribbean. Combining the best scenic route with a complete onboard gastronomic barbecue.",
      badge: "BEST SELLER",
      departureCity: "Arraial do Cabo RJ",
      effortLevel: "Moderate (Boat boarding)",
      bestTime: "Early Afternoon (12:00 PM)",
      idealFor: "Couples, Groups of Friends & Barbecue Lovers",
      bestSeason: "Year-round (Especially Summer)",
      included: [
        "🍹 1 Large Caipirinha, 2 Large Soft drinks or Juices, 1 Custom Souvenir Glass",
        "🍽️ Premium Fresh BBQ Lunch (Beef, Pork, Chicken & Sausages)",
        "🥗 Rice, cassava flour (farofa), vinaigrette, garlic bread & fries or pasta salad",
        "🍎 1 Fresh seasonal fruit",
        "🚤 Two-story Boat with Water Slide & Free Wi-Fi",
        "Snorkeling floaties & life jackets"
      ],
      notIncluded: [
        "Professional photography packages",
        "Navy Pier Fee: R$ 15.00 (paid in cash)"
      ],
      meetingPoint: "Rua Gonçalves Dias, 10 - Praia dos Anjos (Near Praça do Cova), Arraial do Cabo",
      itinerary: [
        "Ilha do Farol Beach (Disembarkation) 🏝️",
        "Guriri Cove (Snorkeling & Waterslides) 🤿",
        "Praia do Forno (Snorkeling & Waterslides) 🌊",
        "Prainhas do Pontal do Atalaia 🌅",
        "Blue Grotto 🏔️",
        "Gorilla Rock 🦍",
        "Turtle Rock 🐢",
        "Crevice of Our Lady 🙏",
        "Meteorite Impact ☄️"
      ]
    },
    es: {
      name: "Experiencia Gastronómica y Mar: Paseo en Barco Completo en Arraial do Cabo",
      shortDescription: "Disfruta de un día de rey y reina en el Caribe Brasileño. Combinando la mejor ruta de navegación con un asado gastronómico completo a bordo.",
      badge: "MÁS VENDIDO",
      departureCity: "Arraial do Cabo RJ",
      effortLevel: "Moderado (Embarque en barco)",
      bestTime: "Inicio de la tarde (12:00 PM)",
      idealFor: "Parejas, Grupos de Amigos y Amantes del Asado",
      bestSeason: "Todo el Año (Especialmente en Verano)",
      included: [
        "🍹 1 Caipirinha grande, 2 Refrescos o Jugos grandes, 1 Copa personalizada",
        "🍽️ Asado Mixto Premium preparado al momento",
        "🥗 Arroz, farofa, vinagreta, pan de ajo y papas fritas o ensalada de pasta",
        "🍎 1 Fruta de estación",
        "🚤 Embarcación de dos pisos con Tobogán y Wi-Fi libre",
        "Flotadores y chalecos salvavidas"
      ],
      notIncluded: [
        "Fotografía profesional",
        "Tasa de embarque de la Marina: R$ 15,00 (en efectivo)"
      ],
      meetingPoint: "Rua Gonçalves Dias, 10 - Praia dos Anjos (Cerca de Praça do Cova), Arraial do Cabo",
      itinerary: [
        "Playa de Ilha do Farol (Desembarque) 🏝️",
        "Ensenada de Guriri (Snorkel y Tobogán) 🤿",
        "Playa do Forno (Snorkel y Tobogán) 🌊",
        "Playitas de Pontal do Atalaia 🌅",
        "Gruta Azul 🏔️",
        "Roca del Gorila 🦍",
        "Roca de la Tortuga 🐢",
        "Grieta de Nuestra Señora 🙏",
        "Impacto del Meteorito ☄️"
      ]
    }
  },
  "Passeio de Barco em Arraial do Cabo (com Tobogã)": {
    pt: {},
    en: {
      name: "Boat Tour in Arraial do Cabo (with Water Slide)",
      shortDescription: "Discover the crystal-clear waters of Arraial do Cabo with comfort, fun water slides, onboard Wi-Fi, and fresh fruits.",
      badge: "NEW",
      included: [
        "Modern two-story boat with water slide",
        "Unlimited mineral water on board",
        "Fresh seasonal fruits served during tour",
        "High-speed onboard Wi-Fi"
      ],
      notIncluded: ["Photography package", "Navy Pier fee: R$ 15.00 (cash)"],
      meetingPoint: "Praia dos Anjos Boarding Pier, Arraial do Cabo"
    },
    es: {
      name: "Paseo en Barco en Arraial do Cabo (con Tobogán)",
      shortDescription: "Descubre las aguas cristalinas de Arraial do Cabo con confort, divertido tobogán, Wi-Fi a bordo y frutas frescas.",
      badge: "NOVEDAD",
      included: [
        "Barco moderno de dos pisos con tobogán acuático",
        "Agua mineral ilimitada a bordo",
        "Frutas de estación servidas durante el recorrido",
        "Wi-Fi de alta velocidad a bordo"
      ],
      notIncluded: ["Paquete de fotos", "Tasa del muelle: R$ 15,00 (en efectivo)"],
      meetingPoint: "Muelle de Embarque Praia dos Anjos, Arraial do Cabo"
    }
  },
  "Passeio de Lancha Exclusiva em Cabo Frio": {
    pt: {},
    en: {
      name: "Exclusive Speedboat Charter in Cabo Frio",
      shortDescription: "Private luxury speedboat tour through Canal Itajuru, Ilha do Japonês, and Praia do Forte. Includes sailor, fuel, and cooler.",
      badge: "VIP",
      included: ["Licensed Master Captain", "Fuel included", "Cooler with ice", "Bluetooth sound system"],
      notIncluded: ["Food & beverages", "Personal towels"],
      meetingPoint: "Itajuru Canal Pier, Cabo Frio"
    },
    es: {
      name: "Paseo en Lancha Exclusiva en Cabo Frio",
      shortDescription: "Navegación privada en lancha VIP por Canal Itajuru, Ilha do Japonês y Praia do Forte. Incluye capitán, combustible y hielera.",
      badge: "VIP",
      included: ["Capitán acreditado", "Combustible incluido", "Hielera con hielo", "Sistema de sonido Bluetooth"],
      notIncluded: ["Comidas y bebidas", "Toallas personales"],
      meetingPoint: "Muelle del Canal Itajuru, Cabo Frio"
    }
  },
  "Passeio de Quadriciclo VIP em Arraial do Cabo": {
    pt: {},
    en: {
      name: "VIP ATV Quad Bike Tour in Arraial do Cabo",
      shortDescription: "Adrenaline and breathtaking landscapes! Ride 4x4 quad bikes through trails, dunes, and secret beaches of Praia Grande.",
      badge: "ADVENTURE",
      included: ["Automatic 4x4 Quad Bike", "Safety helmet & gear", "Experienced trail guide", "Basic driving instructions"],
      notIncluded: ["Goggles & bandana rental", "Personal accident insurance"],
      meetingPoint: "ATV Base Camp - Praia Grande, Arraial do Cabo"
    },
    es: {
      name: "Paseo en Cuatrimoto VIP en Arraial do Cabo",
      shortDescription: "¡Adrenalina y paisajes deslumbrantes! Conduce cuatrimotos 4x4 por senderos, dunas y playas secretas de Praia Grande.",
      badge: "AVENTURA",
      included: ["Cuatrimoto 4x4 Automático", "Casco y equipo de seguridad", "Guía de sendero experimentado", "Instrucciones de manejo"],
      notIncluded: ["Alquiler de antiparras y bandana", "Seguro personal de accidentes"],
      meetingPoint: "Base Cuatrimotos - Praia Grande, Arraial do Cabo"
    }
  },
  "Mergulho de Batismo com Instrutor VIP": {
    pt: {},
    en: {
      name: "Discovery Scuba Dive with VIP Instructor",
      shortDescription: "Dive into the Atlantic marine sanctuary with full equipment and a dedicated PADI instructor. No prior experience required!",
      badge: "MUST DO",
      included: ["Complete PADI scuba gear", "1-on-1 Certified Diving Instructor", "Boating transfer to dive site", "Submarine photography (optional)"],
      notIncluded: ["Pier fee: R$ 15.00"],
      meetingPoint: "Diving Center Pier - Praia dos Anjos, Arraial do Cabo"
    },
    es: {
      name: "Buceo de Bautismo con Instructor VIP",
      shortDescription: "Sumérgete en el santuario marino del Atlántico con equipo completo y un instructor PADI dedicado. ¡No requiere experiencia previa!",
      badge: "IMPERDIBLE",
      included: ["Equipo completo de buceo PADI", "Instructor certificado de buceo 1 a 1", "Traslado en barco al sitio de buceo", "Fotos submarinas (opcional)"],
      notIncluded: ["Tasa del muelle: R$ 15,00"],
      meetingPoint: "Centro de Buceo - Praia dos Anjos, Arraial do Cabo"
    }
  }
};

/**
 * Static translations dictionary for Accommodations
 */
const ACCOMMODATION_TRANSLATIONS: Record<string, Record<SupportedLanguage, Partial<Accommodation>>> = {
  "Pousada do Timoneiro": {
    pt: {},
    en: {
      name: "Pousada do Timoneiro",
      tag: "200M FROM PRAIA GRANDE & POOL",
      highlight: "Prime location 200m from Praia Grande with tropical pool, colonial breakfast, and private parking.",
      description: "A classic reference of hospitality and elegance in Arraial do Cabo. Located just 200 meters from famous Praia Grande, offering a complete structure with outdoor pool surrounded by tropical garden, Gastrobar, artisanal colonial breakfast, and free private parking.",
      idealProfile: "Ideal for families and couples seeking comfort, a relaxing pool after the beach, and easy walking access to Praia Grande's spectacular sunset.",
      amenities: [
        "Outdoor swimming pool with sun deck",
        "Colonial buffet breakfast included",
        "Gastrobar / On-site restaurant",
        "High-speed Fiber Wi-Fi",
        "Free private parking",
        "Split Air Conditioning",
        "24-hour Front Desk",
        "Room Service & Concierge"
      ],
      priceDisplay: "From R$ 380 / night"
    },
    es: {
      name: "Pousada do Timoneiro",
      tag: "A 200M DE PLAYA GRANDE Y PISCINA",
      highlight: "Excelente ubicación a 200m de Praia Grande con piscina tropical, desayuno colonial y estacionamiento privado.",
      description: "Referencia clásica de hospitalidad y elegancia en Arraial do Cabo. Ubicada a solo 200 metros de la famosa Praia Grande, ofrece piscina al aire libre, Gastrobar, desayuno colonial artesanal incluido y estacionamiento privado gratuito.",
      idealProfile: "Ideal para familias y parejas que buscan confort, piscina relajante tras la playa y acceso caminando a la atardecer espectaculares de Praia Grande.",
      amenities: [
        "Piscina al aire libre con solárium",
        "Desayuno buffet colonial incluido",
        "Gastrobar / Restaurante en la posada",
        "Wi-Fi Fibra de alta velocidad",
        "Estacionamiento privado gratuito",
        "Aire Acondicionado Split",
        "Recepción 24 horas",
        "Servicio a la habitación y Concierge"
      ],
      priceDisplay: "Desde R$ 380 / noche"
    }
  },
  "Pousada Caminho do Mar": {
    pt: {},
    en: {
      name: "Pousada Caminho do Mar",
      tag: "50M FROM BOARDING PIER",
      highlight: "Charming lodging steps away from Praia dos Anjos Pier, perfect for boat tours and diving.",
      description: "Just a few steps from paradisiacal Praia dos Anjos, Pousada Caminho do Mar is the perfect haven for waking up next to the sea and enjoying instant access to the boat tour pier.",
      amenities: [
        "Regional buffet breakfast included",
        "High-speed Fiber Wi-Fi",
        "Split Air Conditioning",
        "Smart TV 43\"",
        "Mini-fridge",
        "Private parking",
        "24-hour Front Desk",
        "Just 50m from Boarding Pier"
      ],
      priceDisplay: "From R$ 290 / night"
    },
    es: {
      name: "Pousada Caminho do Mar",
      tag: "A 50M DEL MUELLE DE EMBARQUE",
      highlight: "Encantador alojamiento a pasos del muelle de Praia dos Anjos, perfecto para paseos en barco y buceo.",
      description: "A pocos pasos de la paradisíaca Praia dos Anjos, Pousada Caminho do Mar es el refugio perfecto para despertar al lado del mar y acceder de inmediato a los paseos en barco.",
      amenities: [
        "Desayuno buffet regional incluido",
        "Wi-Fi Fibra de alta velocidad",
        "Aire Acondicionado Split",
        "Smart TV 43\"",
        "Frigobar",
        "Estacionamiento privado",
        "Recepción 24 horas",
        "A solo 50m del Muelle de Embarque"
      ],
      priceDisplay: "Desde R$ 290 / noche"
    }
  },
  "Ohana Pousada Boutique": {
    pt: {},
    en: {
      name: "Ohana Pousada Boutique",
      tag: "EXCLUSIVE RETREAT WITH SEA VIEW",
      highlight: "Panoramic deck with floating infinity jacuzzi built right over the open sea.",
      description: "Perched on the sacred cliffs of Pontal do Atalaia. Features an infinity deck overlooking Brazil's most legendary sunset and humpback whale migrations.",
      priceDisplay: "From R$ 510 / night"
    },
    es: {
      name: "Ohana Pousada Boutique",
      tag: "REFUGIO EXCLUSIVO CON VISTA AL MAR",
      highlight: "Deck panorámico con jacuzzi flotante sobre el mar abierto.",
      description: "Ubicada en los acantilados de Pontal do Atalaia. Cuenta con deck infinito para contemplar el atardecer más legendario de Brasil y ballenas jorobadas.",
      priceDisplay: "Desde R$ 510 / noche"
    }
  },
  "Hotel Orlanova Boutique": {
    pt: {},
    en: {
      name: "Hotel Orlanova Boutique",
      tag: "BEACHFRONT & VIP BOARDING",
      highlight: "Unbeatable location right facing the sea on Praia dos Anjos, next to the Boarding Pier.",
      description: "Facing paradisiacal Praia dos Anjos and just a 2-minute walk from the Boarding Pier, combining contemporary elegance and cozy accommodations.",
      priceDisplay: "From R$ 320 / night"
    },
    es: {
      name: "Hotel Orlanova Boutique",
      tag: "FRENTE AL MAR Y EMBARQUE VIP",
      highlight: "Ubicación inmejorable frente al mar en Praia dos Anjos, junto al muelle de embarque.",
      description: "Frente a la paradisíaca Praia dos Anjos y a solo 2 minutos caminando del Muelle, combinando elegancia contemporánea y habitaciones confortables.",
      priceDisplay: "Desde R$ 320 / noche"
    }
  }
};

/**
 * Translates an Experience object dynamically or via static dictionary lookup.
 */
export function getTranslatedExperience(exp: Experience, lang: SupportedLanguage): Experience {
  if (lang === "pt" || !exp) return exp;

  const staticMatch = EXPERIENCE_TRANSLATIONS[exp.name]?.[lang];

  let translatedName = exp.name;
  let translatedShort = exp.shortDescription;
  let translatedTagText = exp.tagText || "";
  let translatedEffort = exp.effortLevel;
  let translatedIdeal = exp.idealFor;

  if (lang === "en") {
    translatedName = translatedName
      .replace("Passeio de Barco", "Boat Tour")
      .replace("Passeio de Quadriciclo", "ATV Quad Bike Tour")
      .replace("Mergulho de Batismo", "Discovery Scuba Dive")
      .replace("Tour de Buggy", "Buggy Tour")
      .replace("Passeio de Lancha", "Speedboat Tour")
      .replace("Passeio de Helicóptero", "Helicopter Flight")
      .replace("Bate e Volta", "Day Trip")
      .replace("Experiência Gastronômica", "Gastronomic Experience");

    if (exp.badge === "mais-vendido") translatedTagText = "BEST SELLER";
    else if (exp.badge === "novidade") translatedTagText = "NEW";

    if (translatedEffort) {
      translatedEffort = translatedEffort
        .replace("Leve", "Light")
        .replace("Moderado", "Moderate")
        .replace("Intenso", "Intense");
    }
  } else if (lang === "es") {
    translatedName = translatedName
      .replace("Passeio de Barco", "Paseo en Barco")
      .replace("Passeio de Quadriciclo", "Paseo en Cuatrimoto")
      .replace("Mergulho de Batismo", "Buceo de Bautismo")
      .replace("Tour de Buggy", "Tour en Buggy")
      .replace("Passeio de Lancha", "Paseo en Lancha")
      .replace("Passeio de Helicóptero", "Paseo en Helicóptero")
      .replace("Bate e Volta", "Excursión de un Día")
      .replace("Experiência Gastronômica", "Experiencia Gastronómica");

    if (exp.badge === "mais-vendido") translatedTagText = "MÁS VENDIDO";
    else if (exp.badge === "novidade") translatedTagText = "NOVEDAD";

    if (translatedEffort) {
      translatedEffort = translatedEffort
        .replace("Leve", "Leve")
        .replace("Moderado", "Moderado")
        .replace("Intenso", "Intenso");
    }
  }

  const displayTag = staticMatch?.badge || staticMatch?.tagText || translatedTagText || exp.tagText;
  const originalBadge = exp.badge || "";

  return {
    ...exp,
    ...(staticMatch || {}),
    name: staticMatch?.name || translatedName,
    shortDescription: staticMatch?.shortDescription || translatedShort,
    badge: originalBadge as any,
    tagText: displayTag,
    effortLevel: staticMatch?.effortLevel || translatedEffort,
    idealFor: staticMatch?.idealFor || translatedIdeal
  };
}

/**
 * Translates an Accommodation object for current language
 */
export function getTranslatedAccommodation(acc: Accommodation, lang: SupportedLanguage): Accommodation {
  if (lang === "pt" || !acc) return acc;

  const staticMatch = ACCOMMODATION_TRANSLATIONS[acc.name]?.[lang];

  let translatedCategory = acc.category;
  let translatedTag = acc.tag;
  let translatedPriceDisplay = acc.priceDisplay;

  if (lang === "en") {
    if (acc.category === "pousada") translatedCategory = "Inn / Boutique Lodge";
    if (acc.category === "hotel") translatedCategory = "Hotel";
    if (acc.category === "casa") translatedCategory = "Beach House";

    if (acc.tag) {
      translatedTag = acc.tag
        .replace("BEIRA-MAR", "BEACHFRONT")
        .replace("PÉ NA AREIA", "BEACHFRONT")
        .replace("A 200M DA PRAIA GRANDE", "200M FROM PRAIA GRANDE")
        .replace("A 50M DO CAIS DE EMBARQUE", "50M FROM BOARDING PIER")
        .replace("FRENTE MAR", "BEACHFRONT")
        .replace("BOUTIQUE", "BOUTIQUE")
        .replace("CONFORTO", "COMFORT");
    }

    if (translatedPriceDisplay) {
      translatedPriceDisplay = translatedPriceDisplay.replace("A partir de", "From").replace("/ noite", "/ night");
    }
  } else if (lang === "es") {
    if (acc.category === "pousada") translatedCategory = "Posada Boutique";
    if (acc.category === "hotel") translatedCategory = "Hotel";
    if (acc.category === "casa") translatedCategory = "Casa de Playa";

    if (acc.tag) {
      translatedTag = acc.tag
        .replace("BEIRA-MAR", "FRENTE AL MAR")
        .replace("PÉ NA AREIA", "PIE EN LA ARENA")
        .replace("A 200M DA PRAIA GRANDE", "A 200M DE PLAYA GRANDE")
        .replace("A 50M DO CAIS DE EMBARQUE", "A 50M DEL MUELLE DE EMBARQUE")
        .replace("FRENTE MAR", "FRENTE AL MAR")
        .replace("BOUTIQUE", "BOUTIQUE")
        .replace("CONFORTO", "CONFORT");
    }

    if (translatedPriceDisplay) {
      translatedPriceDisplay = translatedPriceDisplay.replace("A partir de", "Desde").replace("/ noite", "/ noche");
    }
  }

  // Translate room types inside accommodation if present
  let translatedRoomTypes = acc.roomTypes;
  if (acc.roomTypes && acc.roomTypes.length > 0) {
    translatedRoomTypes = acc.roomTypes.map(room => {
      let roomName = room.name;
      let roomDesc = room.description;
      let roomBeds = room.beds;

      if (lang === "en") {
        roomName = roomName
          .replace("Apartamento Categoria A - Casal", "Category A Apartment - Couple")
          .replace("Apartamento Categoria B - Térreo Vista Piscina", "Category B Apartment - Pool View Ground Floor")
          .replace("Apartamento Quádruplo Família", "Quadruple Family Apartment")
          .replace("Suíte Standard Casal", "Standard Double Suite")
          .replace("Suíte Superior com Varanda", "Superior Suite with Balcony")
          .replace("Suíte Família Tripla / Quádrupla", "Triple / Quad Family Suite")
          .replace("Quarto Standard Queen", "Standard Queen Room")
          .replace("Quarto Queen Superior Vista Mar", "Superior Ocean View Queen Room")
          .replace("Suíte Master Deluxe com Varanda Vista Mar", "Deluxe Master Ocean View Suite");

        if (roomBeds) {
          roomBeds = roomBeds
            .replace("Cama de Casal Box", "Double Box Bed")
            .replace("Cama Queen Size", "Queen Size Bed")
            .replace("Cama King Size", "King Size Bed")
            .replace("Cama de Solteiro", "Single Bed");
        }
      } else if (lang === "es") {
        roomName = roomName
          .replace("Apartamento Categoria A - Casal", "Apartamento Categoría A - Pareja")
          .replace("Apartamento Categoria B - Térreo Vista Piscina", "Apartamento Categoría B - Planta Baja Vista Piscina")
          .replace("Apartamento Quádruplo Família", "Apartamento Cuádruple Familia")
          .replace("Suíte Standard Casal", "Suite Standard Pareja")
          .replace("Suíte Superior com Varanda", "Suite Superior con Balcón")
          .replace("Suíte Família Tripla / Quádrupla", "Suite Familia Triple / Cuádruple")
          .replace("Quarto Standard Queen", "Habitación Standard Queen")
          .replace("Quarto Queen Superior Vista Mar", "Habitación Queen Superior Vista Mar")
          .replace("Suíte Master Deluxe com Varanda Vista Mar", "Suite Master Deluxe con Balcón Vista Mar");

        if (roomBeds) {
          roomBeds = roomBeds
            .replace("Cama de Casal Box", "Cama Matrimonial Box")
            .replace("Cama Queen Size", "Cama Queen Size")
            .replace("Cama King Size", "Cama King Size")
            .replace("Cama de Solteiro", "Cama Individual");
        }
      }

      return {
        ...room,
        name: roomName,
        description: roomDesc,
        beds: roomBeds
      };
    });
  }

  return {
    ...acc,
    ...(staticMatch || {}),
    category: staticMatch?.category || translatedCategory,
    tag: staticMatch?.tag || translatedTag,
    priceDisplay: staticMatch?.priceDisplay || translatedPriceDisplay,
    roomTypes: translatedRoomTypes
  };
}

/**
 * Translates a Destination object for current language
 */
export function getTranslatedDestination(dest: Destination, lang: SupportedLanguage): Destination {
  if (lang === "pt" || !dest) return dest;

  let translatedDesc = dest.description;
  let translatedShort = dest.shortDescription;

  if (lang === "en") {
    if (dest.id === "arraial-do-cabo") {
      translatedDesc = "The Brazilian Caribbean.";
      translatedShort = "The Brazilian Caribbean.";
    } else if (dest.id === "buzios") {
      translatedDesc = "The charming peninsula.";
      translatedShort = "The charming peninsula.";
    } else if (dest.id === "cabo-frio") {
      translatedDesc = "White sands and crystal-clear waters.";
      translatedShort = "Breathtaking beaches.";
    } else if (dest.id === "angra-dos-reis") {
      translatedDesc = "365 paradisiacal islands.";
      translatedShort = "Paradisiacal islands.";
    }
  } else if (lang === "es") {
    if (dest.id === "arraial-do-cabo") {
      translatedDesc = "El Caribe Brasileño.";
      translatedShort = "El Caribe Brasileño.";
    } else if (dest.id === "buzios") {
      translatedDesc = "La encantadora península.";
      translatedShort = "La encantadora península.";
    } else if (dest.id === "cabo-frio") {
      translatedDesc = "Arenas blancas y aguas cristalinas.";
      translatedShort = "Playas deslumbrantes.";
    } else if (dest.id === "angra-dos-reis") {
      translatedDesc = "365 islas paradisíacas.";
      translatedShort = "Islas paradisíacas.";
    }
  }

  return {
    ...dest,
    description: translatedDesc,
    shortDescription: translatedShort
  };
}

/**
 * Translates a BlogPost object for current language
 */
export function getTranslatedBlogPost(post: BlogPost, lang: SupportedLanguage): BlogPost {
  if (lang === "pt" || !post) return post;

  let translatedTitle = post.title;
  let translatedExcerpt = post.excerpt;

  if (lang === "en") {
    translatedTitle = post.title
      .replace("Guia Completo de Arraial do Cabo: O Caribe Brasileiro", "Complete Guide to Arraial do Cabo: The Brazilian Caribbean")
      .replace("As 5 Melhores Praias de Búzios para Visitar em 2026", "The 5 Best Beaches in Búzios to Visit in 2026")
      .replace("Roteiro de 3 Dias Perfeitos em Cabo Frio", "Perfect 3-Day Itinerary in Cabo Frio");

    if (translatedExcerpt) {
      translatedExcerpt = translatedExcerpt
        .replace("Descubra as melhores praias", "Discover the best beaches")
        .replace("Tudo o que você precisa saber", "Everything you need to know");
    }
  } else if (lang === "es") {
    translatedTitle = post.title
      .replace("Guia Completo de Arraial do Cabo: O Caribe Brasileiro", "Guía Completa de Arraial do Cabo: El Caribe Brasileño")
      .replace("As 5 Melhores Praias de Búzios para Visitar em 2026", "Las 5 Mejores Playas de Búzios para Visitar en 2026")
      .replace("Roteiro de 3 Dias Perfeitos em Cabo Frio", "Itinerario de 3 Días Perfectos en Cabo Frio");

    if (translatedExcerpt) {
      translatedExcerpt = translatedExcerpt
        .replace("Descubra as melhores praias", "Descubre las mejores playas")
        .replace("Tudo o que você precisa saber", "Todo lo que necesitas saber");
    }
  }

  return {
    ...post,
    title: translatedTitle,
    excerpt: translatedExcerpt
  };
}

