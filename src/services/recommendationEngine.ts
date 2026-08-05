import { Experience, BookingCartItem } from "../types";

export interface RecommendationOffer {
  id: string;
  title: string;
  category: "transfer" | "photography" | "gastronomy" | "adventure" | "equipment";
  description: string;
  price: number;
  badgeText: string;
  iconName: string;
  targetExperienceIds?: string[];
}

export const RecommendationEngine = {
  /**
   * Automatically derives cross-selling recommendations based on items in the cart or itinerary.
   */
  getRecommendations(
    cart: BookingCartItem[],
    experiences: Experience[],
    destinationName?: string
  ): RecommendationOffer[] {
    const recommendations: RecommendationOffer[] = [];
    const hasNautical = cart.some(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      return exp && (exp.category === "nautico" || exp.name.toLowerCase().includes("barco") || exp.name.toLowerCase().includes("lancha"));
    });

    const hasOffRoad = cart.some(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      return exp && (exp.category === "off-road" || exp.name.toLowerCase().includes("buggy") || exp.name.toLowerCase().includes("quadriciclo"));
    });

    // 1. Photo & Drone Upgrade for Nautical / Boat Tours
    if (hasNautical) {
      recommendations.push({
        id: "rec_subaquatica_drone",
        title: "Sessão de Fotos Subaquáticas & Drone 4K",
        category: "photography",
        description: "Garante fotos profissionais de alta resolução sob as águas cristalinas das Prainhas do Pontal e tomadas aéreas cinematográficas com drone.",
        price: 150,
        badgeText: "Mais Recomendado para Barco",
        iconName: "Camera"
      });

      recommendations.push({
        id: "rec_transfer_cais",
        title: "Transfer Privativo até o Cais da Praia Grande",
        category: "transfer",
        description: "Evite filas de estacionamento e gargalos. Motorista credenciado busca e leva você diretamente na porta da pousada ou hotel.",
        price: 80,
        badgeText: "Conforto VIP",
        iconName: "Car"
      });
    }

    // 2. Off-road & Buggy additions
    if (!hasOffRoad) {
      recommendations.push({
        id: "rec_tour_buggy_sunset",
        title: "Tour de Buggy ao Pôr do Sol",
        category: "adventure",
        description: "Explore os mirantes secretos, dunas de areia branca e enseadas intocadas com fotógrafo Guida Trips guiando seu grupo.",
        price: 220,
        badgeText: "Top Experiência em Terra",
        iconName: "Compass"
      });
    }

    // 3. Gastronomy & Wine
    recommendations.push({
      id: "rec_jantar_boas_vindas",
      title: "Reserva VIP em Restaurante à Beira-Mar com Espumante",
      category: "gastronomy",
      description: "Mesa garantida nos melhores bistrôs com vista privilegiada para o pôr do sol e Welcome Drink de cortesia.",
      price: 120,
      badgeText: "Gastronomia Local",
      iconName: "Utensils"
    });

    return recommendations;
  }
};
