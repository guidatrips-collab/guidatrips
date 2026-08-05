import { Experience, Accommodation, BlogPost, Destination } from "../types";
import { SupportedLanguage } from "../context/LanguageContext";

/**
 * Common static translations dictionary for experience names, categories, and key terms
 */
const EXPERIENCE_TRANSLATIONS: Record<string, Record<SupportedLanguage, Partial<Experience>>> = {
  "Passeio de Barco VIP Arraial do Cabo": {
    pt: {},
    en: {
      name: "Arraial do Cabo VIP Boat Tour",
      shortDescription: "Exclusive boat tour through crystal clear waters.",
      fullDescription: "Exclusive boat tour through the crystal clear waters of Arraial do Cabo. Stops at Pontal do Atalaia, Ilha do Farol, and Praia do Forno with tropical fruits, water, and specialized guide.",
      highlights: [
        "Stop at Ilha do Farol (Voted one of Brazil's most beautiful beaches)",
        "Staircase of Prainhas do Pontal do Atalaia",
        "Submarine Grotto and Crevice of Our Lady",
        "Boutique vessel with bathroom, sound system, and safety gear"
      ],
      included: ["Mineral water & tropical fruits", "Complete snorkeling gear", "Licensed captain and bilingual guide"],
      notIncluded: ["Navy boarding fee (R$ 10)", "Lunch at restaurant", "Subaquatic photo packages"],
      meetingPoint: "Praia dos Anjos Boarding Pier, Gate 3",
      tags: ["BEST SELLER"]
    },
    es: {
      name: "Paseo en Barco VIP Arraial do Cabo",
      shortDescription: "Navegación exclusiva por aguas cristalinas.",
      fullDescription: "Navegación exclusiva por las aguas cristalinas de Arraial do Cabo. Paradas en Pontal do Atalaia, Ilha do Farol y Praia do Forno con frutas tropicales, agua y guía especializado.",
      highlights: [
        "Parada en Ilha do Farol (Elegida una de las playas más bellas del mundo)",
        "Escalinatas de Prainhas do Pontal do Atalaia",
        "Gruta Azul y Grieta de Nuestra Señora",
        "Embarcación boutique con baño, sonido y equipos de seguridad"
      ],
      included: ["Agua mineral y frutas de estación", "Mascara de snorkel completa", "Capitán acreditado y guía marinero"],
      notIncluded: ["Tasa de embarque de la Marina (R$ 10)", "Almuerzo en restaurante", "Paquete de fotos bajo el agua"],
      meetingPoint: "Muelle de Embarque Praia dos Anjos, Portón 3",
      tags: ["MÁS VENDIDO"]
    }
  }
};

/**
 * Translates an Experience object dynamically or via static dictionary lookup.
 */
export function getTranslatedExperience(exp: Experience, lang: SupportedLanguage): Experience {
  if (lang === "pt" || !exp) return exp;

  const staticMatch = EXPERIENCE_TRANSLATIONS[exp.name]?.[lang];
  if (staticMatch) {
    return { ...exp, ...staticMatch };
  }

  // Fallback term replacements if static dictionary doesn't match
  let translatedName = exp.name;

  if (lang === "en") {
    translatedName = translatedName
      .replace("Passeio de Barco", "Boat Tour")
      .replace("Passeio de Quadriciclo", "ATV Tour")
      .replace("Mergulho de Batismo", "Discovery Scuba Dive")
      .replace("Tour de Buggy", "Buggy Tour")
      .replace("Passeio de Lancha", "Speedboat Tour");
  } else if (lang === "es") {
    translatedName = translatedName
      .replace("Passeio de Barco", "Paseo en Barco")
      .replace("Passeio de Quadriciclo", "Paseo en Cuatrimoto")
      .replace("Mergulho de Batismo", "Buceo de Bautismo")
      .replace("Tour de Buggy", "Tour en Buggy")
      .replace("Passeio de Lancha", "Paseo en Lancha");
  }

  return {
    ...exp,
    name: translatedName
  };
}

/**
 * Translates an Accommodation object for current language
 */
export function getTranslatedAccommodation(acc: Accommodation, lang: SupportedLanguage): Accommodation {
  if (lang === "pt" || !acc) return acc;

  let translatedCategory = acc.category;
  let translatedTag = acc.tag;

  if (lang === "en") {
    if (acc.category === "pousada") translatedCategory = "Inn / Boutique Lodge";
    if (acc.category === "hotel") translatedCategory = "Hotel";
    if (acc.category === "casa") translatedCategory = "Beach House";

    if (acc.tag) {
      translatedTag = acc.tag
        .replace("BEIRA-MAR", "BEACHFRONT")
        .replace("PÉ NA AREIA", "BEACHFRONT")
        .replace("BOUTIQUE", "BOUTIQUE")
        .replace("CONFORTO", "COMFORT");
    }
  } else if (lang === "es") {
    if (acc.category === "pousada") translatedCategory = "Posada Boutique";
    if (acc.category === "hotel") translatedCategory = "Hotel";
    if (acc.category === "casa") translatedCategory = "Casa de Playa";

    if (acc.tag) {
      translatedTag = acc.tag
        .replace("BEIRA-MAR", "FRENTE AL MAR")
        .replace("PÉ NA AREIA", "PIE EN LA ARENA")
        .replace("BOUTIQUE", "BOUTIQUE")
        .replace("CONFORTO", "CONFORT");
    }
  }

  return {
    ...acc,
    category: translatedCategory,
    tag: translatedTag
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
      .replace("Guia Completo de Arraial do Cabo", "Complete Guide to Arraial do Cabo")
      .replace("Melhores Praias", "Best Beaches")
      .replace("Roteiro de 3 Dias", "3-Day Itinerary");
  } else if (lang === "es") {
    translatedTitle = post.title
      .replace("Guia Completo de Arraial do Cabo", "Guía Completa de Arraial do Cabo")
      .replace("Melhores Praias", "Mejores Playas")
      .replace("Roteiro de 3 Dias", "Itinerario de 3 Días");
  }

  return {
    ...post,
    title: translatedTitle,
    excerpt: translatedExcerpt
  };
}
