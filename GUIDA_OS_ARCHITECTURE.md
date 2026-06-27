# Arquitetura Guida OS

## 1. Análise da Arquitetura Atual

A Guida Trips atualmente é uma Single Page Application (SPA) desenvolvida em React com Vite e TypeScript. 

**Frontend:**
- Interface estilizada com Tailwind CSS.
- Gerenciamento de estado centralizado no `App.tsx` (lifted state).
- Navegação baseada em renderização condicional (`currentView`).
- Componentes principais divididos por domínios (`HomeView`, `ExperiencesView`, `DestinoView`, `ClientPanelView`, `AdminView`, etc).

**Backend / Dados:**
- Utiliza Firebase Firestore como banco de dados NoSQL (`firestoreService`).
- Sincronização local com `localStorage` para fallback e performance.
- Estruturas de dados atuais (definidas em `types.ts`): `Experience`, `BlogPost`, `Lead`, `Destination`, `ClientUser`, `ClientReservation`, `GlobalSettings`.

**Painel Administrativo Atual:**
- O `AdminView.tsx` é um componente monolítico com abas (Dashboard, Destinos, Experiências, CRM, Blog, Configurações).
- Ele atendeu bem ao MVP, mas não é escalável para o nível de um Sistema Operacional (ERP/CRM completo).

---

## 2. Proposta da Estrutura Ideal do Guida OS

Para transformar o painel em um verdadeiro Sistema Operacional (Guida OS) sem quebrar o site atual, adotaremos uma arquitetura modular, escalável e baseada em permissões de acesso (RBAC - Role-Based Access Control).

### 2.1. Novo Domínio / Roteamento
- O site do cliente continuará operando nas rotas padrão.
- O Guida OS será acessado via um novo view state (`currentView === 'os'`), simulando a rota `/os`.
- O acesso será protegido por autenticação, validando o nível de acesso (`role`) do usuário.

### 2.2. Perfis de Acesso (RBAC)
- **Administrador:** Acesso total ao Guida OS.
- **Equipe:** Acesso restrito a CRM, Reservas e Orçamentos.
- **Parceiro:** Acesso a um painel isolado (Meus Passeios, Minha Agenda, Minhas Comissões).
- **Afiliado:** Acesso a um painel de conversões e links (Dashboard de Afiliado).
- **Cliente:** Acesso mantido no `ClientPanelView` atual, que será alimentado pelas ações do Guida OS.

### 2.3. Estrutura de Diretórios Sugerida
```text
src/
 ├── os/
 │    ├── GuidaOS.tsx (Layout Principal e Roteador Interno)
 │    ├── components/ (Componentes compartilhados do OS: Sidebar, Header, Cards)
 │    ├── modules/
 │    │    ├── Dashboard/ (Indicadores Executivos)
 │    │    ├── CRM/ (Gestão de Leads, Clientes, Funil)
 │    │    ├── Partners/ (Gestão de Parceiros e Área do Parceiro)
 │    │    ├── Products/ (Passeios e Hospedagens)
 │    │    ├── SmartItinerary/ (Roteiro IA e Orçamentos)
 │    │    ├── Financial/ (Fluxo de Caixa, Comissões, DRE)
 │    │    ├── Affiliates/ (Programa de Afiliados)
 │    │    └── Settings/ (Configurações do OS)
 │    └── utils/ (Lógicas específicas do OS)
```

### 2.4. Evolução do Banco de Dados (Firestore)
Para suportar o Guida OS, expandiremos a tipagem e as coleções:
- `users`: Adição do campo `role` (`admin`, `staff`, `partner`, `affiliate`, `client`).
- `partners`: Nova coleção com dados da empresa, comissionamento e integrações.
- `accommodations`: Nova coleção para Hotéis, Pousadas, etc.
- `financial_transactions`: Entradas, saídas, comissões, centro de custos.
- `budgets` / `itineraries`: Orçamentos gerados pela IA e aprovados pela equipe.
- `affiliate_links`: Rastreio de indicações e cliques.

---

## 3. Como cada Módulo será Integrado (Sem quebrar o atual)

1. **Separação Pacífica:** O componente `AdminView.tsx` atual será mantido temporariamente. O Guida OS nascerá em paralelo (`/src/os/GuidaOS.tsx`). Só desativaremos o `AdminView` antigo quando o Guida OS estiver 100% funcional.
2. **Camada de Dados Independente:** Em vez de inchar o `App.tsx` com todos os dados do universo (financeiro, parceiros, etc), os módulos do Guida OS farão o _fetch_ de seus próprios dados diretamente do `firestoreService` quando montados, utilizando a estrutura atual de Firebase.
3. **UI/UX:** O Guida OS terá um design system próprio (Premium, Dark, Minimalista, estilo SaaS), utilizando Tailwind. Ele não afetará o CSS público do site.
4. **Integração com o Site Público:** Quando a equipe aprovar um roteiro ou reserva no Guida OS, o banco de dados será atualizado. O `ClientPanelView` (área do cliente) automaticamente refletirá essas mudanças, pois ambos consomem o mesmo Firestore.
5. **Inteligência Artificial:** Criaremos serviços utilitários em `src/os/ai/` que usarão o banco de dados atual para alimentar prompts estruturados para a IA (ex: gerar orçamento com base nas disponibilidades atuais).

---

## 4. Próximos Passos (Plano de Ação)

1. **Fundação:** Criar os tipos de dados base no `types.ts` (Parceiros, Transações, Roles de Usuário).
2. **Casca do Sistema:** Criar o `GuidaOS.tsx` com o layout base (Sidebar de navegação dark/premium) e o controle de acesso.
3. **Migração Progressiva:**
   - Módulo 1: Dashboard Executivo e Migração dos Passeios/Destinos (Products).
   - Módulo 2: CRM (Clientes, Leads, Funil).
   - Módulo 3: Parceiros (Cadastro e Painel).
   - Módulo 4: Roteiro Inteligente e Orçamentos (Integração IA).
   - Módulo 5: Financeiro e Afiliados.

Aguardando sua aprovação desta arquitetura para iniciarmos a criação do esqueleto do **Guida OS** no código!
