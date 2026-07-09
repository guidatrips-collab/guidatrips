import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization of Gemini client to prevent crashes if key is missing during startup
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave de API do Gemini (GEMINI_API_KEY) não está configurada nas variáveis de ambiente. Configure-a no painel 'Settings > Secrets'.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware to parse JSON body
  app.use(express.json());

  // API router / endpoints (if any)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Import and Structuring Endpoint for Accommodations (Fase 0 - POC)
  app.post("/api/accommodations/ai-import", async (req, res) => {
    try {
      const { rawInput } = req.body;
      if (!rawInput || typeof rawInput !== "string" || !rawInput.trim()) {
        return res.status(400).json({ error: "O campo rawInput é obrigatório e deve ser um texto preenchido." });
      }

      const client = getGeminiClient();

      const systemInstruction = `Você é um Engenheiro de Dados e Curador especializado em turismo de alto padrão para a Guida Trips / GuideOS.
Sua missão é extrair, normalizar e estruturar dados de hospedagens (hotéis, pousadas, casas e apartamentos de temporada) a partir de descrições brutas, textos de anúncios ou páginas da web.
Você deve produzir uma estrutura de dados de altíssima qualidade seguindo rigorosamente o esquema JSON fornecido.

Diretrizes de Extração e Normalização:
1. CATEGORIA: Escolha estritamente uma das opções: "hotel", "pousada", "hostel", "casa" ou "apartamento".
2. TYPETAG: Escolha uma tag conceitual forte como "boutique", "pe-na-areia", "vista", "rustico", "luxo", "design", "familiar".
3. AMENITIES: Extraia todas as comodidades e padronize os nomes em português (ex: "Ar Condicionado", "Piscina", "Estacionamento Gratuito", "Wi-Fi de Alta Velocidade", "Café da manhã incluso").
4. LOCATION: Identifique o bairro ou praia em Arraial do Cabo (ex: "Praia Grande", "Praia dos Anjos", "Pontal do Atalaia", "Centro", "Prainha").
5. RATES: Se houver valores numéricos na descrição, use-os como base. Caso contrário, estime valores realistas para Arraial do Cabo (ex: diária de pousada entre R$ 350 e R$ 1200). netRate (custo) deve ser cerca de 20% a 30% menor que o sellRate (venda).
6. CATEGORIAS DE QUARTO (roomCategories): Se a descrição mencionar suítes ou quartos diferentes, estruture-os com nome, descrição, capacidades (adultos, crianças, máximo) e preços. Caso contrário, crie pelo menos duas categorias fictícias altamente realistas com base no estilo do hotel (ex: "Suíte Standard" e "Suíte Master Vista Mar").
7. SAZONALIDADES (seasonalPeriods): Defina períodos de alta e baixa temporada realistas para o Brasil / Arraial do Cabo (Alta: Dezembro a Março + feriados; Baixa: Abril a Novembro). Adicione multiplicadores adequados (ex: Alta: 1.5, Baixa: 1.0).
8. POLÍTICAS E REGRAS: Extraia regras claras de cancelamento, regras de pet, fumo, barulho, check-in/out.
9. SMART TAGS: Gere de 3 a 5 tags inteligentes para o mecanismo de recomendação personalizado (ex: "Casais", "Famílias", "Pet Friendly", "Vista Pôr do Sol", "Conectado à Natureza", "Próximo ao Porto").`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise a seguinte hospedagem e estruture-a completamente em JSON:\n\n${rawInput}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nome completo da hospedagem" },
              category: { type: Type.STRING, description: "hotel, pousada, hostel, casa ou apartamento" },
              typeTag: { type: Type.STRING, description: "Etiqueta conceitual ex: boutique, pe-na-areia, vista, rustico, familiar" },
              description: { type: Type.STRING, description: "Breve texto de marketing/curadoria persuasivo em português" },
              highlight: { type: Type.STRING, description: "Uma frase marcante resumindo o diferencial da pousada" },
              amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array de comodidades e serviços padronizados em português"
              },
              location: { type: Type.STRING, description: "Bairro ou praia local em Arraial do Cabo" },
              address: { type: Type.STRING, description: "Endereço estruturado completo" },
              netRate: { type: Type.NUMBER, description: "Preço estimado de custo (net) por diária em reais" },
              sellRate: { type: Type.NUMBER, description: "Preço de venda ao cliente por diária em reais" },
              rating: { type: Type.NUMBER, description: "Avaliação da hospedagem, de 4.0 a 5.0" },
              reviews: { type: Type.INTEGER, description: "Número total estimado de avaliações da hospedagem" },
              whatsappMessage: { type: Type.STRING, description: "Mensagem personalizada pré-preenchida para contato de reserva direta via WhatsApp" },
              roomCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome da categoria do quarto" },
                    description: { type: Type.STRING, description: "Descrição detalhada do conforto e diferenciais do quarto" },
                    capacityAdults: { type: Type.INTEGER, description: "Capacidade máxima de adultos" },
                    capacityChildren: { type: Type.INTEGER, description: "Capacidade máxima de crianças" },
                    capacityMax: { type: Type.INTEGER, description: "Capacidade total máxima de hóspedes" },
                    amenities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Comodidades específicas deste quarto" },
                    basePrice: { type: Type.NUMBER, description: "Preço de venda diário base do quarto em reais" },
                    netPrice: { type: Type.NUMBER, description: "Preço de custo diário base do quarto com o parceiro" }
                  }
                },
                description: "Lista estruturada das categorias de quartos disponíveis"
              },
              seasonalPeriods: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome da época ex: Alta Temporada, Baixa Temporada, Réveillon" },
                    startDate: { type: Type.STRING, description: "Data de início em formato YYYY-MM-DD" },
                    endDate: { type: Type.STRING, description: "Data de fim em formato YYYY-MM-DD" },
                    type: { type: Type.STRING, description: "high ou low" },
                    priceMultiplier: { type: Type.NUMBER, description: "Multiplicador de preço aplicado ex: 1.5 para alta temporada" },
                    minNights: { type: Type.INTEGER, description: "Número mínimo de noites exigido para o período" }
                  }
                },
                description: "Definição de sazonalidades anuais"
              },
              policies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Políticas gerais de check-in, check-out e cancelamento"
              },
              restrictions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Restrições da hospedagem ex: Não é permitido pets, Proibido fumar"
              },
              occupancyRules: { type: Type.STRING, description: "Regra resumida de ocupação e políticas de crianças" },
              smartTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Marcadores de perfil recomendados ex: Casais, Famílias, Pet Friendly, Vista Pôr do Sol"
              }
            },
            required: ["name", "category", "description", "amenities", "location", "netRate", "sellRate", "roomCategories", "policies"]
          }
        }
      });

      const structuredData = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: structuredData });
    } catch (err: any) {
      console.error("Erro no processamento do importador IA:", err);
      return res.status(500).json({ 
        success: false, 
        error: err.message || "Erro desconhecido ao processar os dados com o Gemini." 
      });
    }
  });

  // Serve static files in dev or production
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
