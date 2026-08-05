import { CustomerJourneyStage, SavedItinerary, ClientReservation } from "../types";

export interface JourneyStageInfo {
  stage: CustomerJourneyStage;
  label: string;
  shortDescription: string;
  progressPercent: number;
  badgeColor: string;
  nextStepLabel: string;
  iconName: string;
}

export const JOURNEY_STAGES: Record<CustomerJourneyStage, JourneyStageInfo> = {
  discovery: {
    stage: "discovery",
    label: "Descobrindo o Destino",
    shortDescription: "Explorando as maravilhas da Região dos Lagos e do Rio de Janeiro.",
    progressPercent: 10,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    nextStepLabel: "Montar Roteiro Personalizado",
    iconName: "Compass"
  },
  started_itinerary: {
    stage: "started_itinerary",
    label: "Iniciando Roteiro",
    shortDescription: "Definindo datas, quantidade de pessoas e preferências.",
    progressPercent: 25,
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    nextStepLabel: "Selecionar Passeios e Hospedagem",
    iconName: "MapPin"
  },
  itinerary_built: {
    stage: "itinerary_built",
    label: "Roteiro Montado",
    shortDescription: "Sua viagem dos sonhos está estruturada com passeios e hospedagens.",
    progressPercent: 40,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    nextStepLabel: "Solicitar Orçamento / Finalizar Reserva",
    iconName: "Calendar"
  },
  quote_requested: {
    stage: "quote_requested",
    label: "Orçamento Solicitado",
    shortDescription: "Atendimento humano concierge e condições especiais ativadas.",
    progressPercent: 55,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    nextStepLabel: "Aguardando Aprovação de Pagamento",
    iconName: "MessageCircle"
  },
  payment_pending: {
    stage: "payment_pending",
    label: "Pagamento Pendente",
    shortDescription: "Aguardando confirmação da entrada (sinal) para emissão do voucher.",
    progressPercent: 70,
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    nextStepLabel: "Realizar Pagamento do Sinal",
    iconName: "CreditCard"
  },
  payment_approved: {
    stage: "payment_approved",
    label: "Pagamento Aprovado",
    shortDescription: "Entrada confirmada com sucesso! Emitindo seus vouchers.",
    progressPercent: 80,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    nextStepLabel: "Gerar Vouchers Inteligentes",
    iconName: "CheckCircle2"
  },
  reservation_confirmed: {
    stage: "reservation_confirmed",
    label: "Reserva Confirmada",
    shortDescription: "Vouchers emitidos e sua vaga está garantida na operação.",
    progressPercent: 85,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    nextStepLabel: "Visualizar Voucher / Preparar Mala",
    iconName: "ShieldCheck"
  },
  pre_trip: {
    stage: "pre_trip",
    label: "Preparando a Viagem",
    shortDescription: "Contagem regressiva ativada, previsão do tempo e mimos liberados.",
    progressPercent: 90,
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    nextStepLabel: "Acessar Guia de Preparação e Previsão",
    iconName: "Luggage"
  },
  in_trip: {
    stage: "in_trip",
    label: "Em Viagem",
    shortDescription: "Você está vivendo a experiência Guida Trips no destino!",
    progressPercent: 95,
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    nextStepLabel: "Abrir Voucher / Ponto de Encontro",
    iconName: "Anchor"
  },
  post_trip: {
    stage: "post_trip",
    label: "Viagem Concluída",
    shortDescription: "Esperamos que suas memórias tenham sido inesquecíveis!",
    progressPercent: 100,
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    nextStepLabel: "Avaliar Experiências",
    iconName: "Smile"
  },
  evaluated: {
    stage: "evaluated",
    label: "Avaliação Concluída",
    shortDescription: "Muito obrigado por compartilhar seu feedback!",
    progressPercent: 100,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    nextStepLabel: "Explorar Novos Destinos",
    iconName: "Star"
  },
  community_active: {
    stage: "community_active",
    label: "MembroAtivo da Comunidade",
    shortDescription: "Conectado com outros viajantes e recebendo ofertas exclusivas.",
    progressPercent: 100,
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    nextStepLabel: "Interagir na Comunidade",
    iconName: "Users"
  },
  repeat_booking: {
    stage: "repeat_booking",
    label: "Viajante Recorrente",
    shortDescription: "Cliente VIP Guida Trips planejando a próxima aventura.",
    progressPercent: 100,
    badgeColor: "bg-gradient-to-r from-amber-500 to-amber-700 text-white",
    nextStepLabel: "Planejar Nova Viagem",
    iconName: "Sparkles"
  }
};

export const JourneyService = {
  /**
   * Computes current journey stage dynamically based on user itineraries, reservations, and dates.
   */
  calculateStage(
    itineraries: SavedItinerary[],
    reservations: ClientReservation[]
  ): CustomerJourneyStage {
    if (reservations.length > 0) {
      const hasConfirmed = reservations.some(r => r.status === "confirmed");
      const hasCompleted = reservations.some(r => r.status === "completed");
      const todayStr = new Date().toISOString().split("T")[0];

      if (hasCompleted) {
        return "post_trip";
      }

      if (hasConfirmed) {
        // Check if any reservation is happening today
        const isInTrip = reservations.some(r => r.status === "confirmed" && r.date === todayStr);
        if (isInTrip) return "in_trip";

        // Check if trip is in the future
        const isFuture = reservations.some(r => r.status === "confirmed" && r.date >= todayStr);
        if (isFuture) return "pre_trip";

        return "reservation_confirmed";
      }

      const hasPendingPayment = reservations.some(r => r.status === "pending" || r.paymentStatus === "pending");
      if (hasPendingPayment) return "payment_pending";

      return "quote_requested";
    }

    if (itineraries.length > 0) {
      const latest = itineraries[itineraries.length - 1];
      if (latest.status === "Orçamento solicitado") return "quote_requested";
      if (latest.status === "Pagamento pendente") return "payment_pending";
      if (latest.status === "Pago" || latest.status === "Confirmado") return "payment_approved";
      if (latest.items && latest.items.length > 0) return "itinerary_built";
      return "started_itinerary";
    }

    return "discovery";
  },

  getStageInfo(stage: CustomerJourneyStage): JourneyStageInfo {
    return JOURNEY_STAGES[stage] || JOURNEY_STAGES.discovery;
  }
};
