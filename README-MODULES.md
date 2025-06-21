# 📦 Guia de Módulos do AgendaPro

## 🎯 Visão Geral

O projeto foi organizado em módulos independentes para facilitar o desenvolvimento, manutenção e performance. Cada módulo tem responsabilidades bem definidas.

## 📁 Estrutura de Módulos

```
src/
├── modules/
│   ├── core/              # Sistema base
│   ├── appointments/      # Agendamentos e calendário  
│   ├── clients/          # Gestão de clientes
│   ├── services/         # Catálogo de serviços
│   ├── team/             # Equipe e tarefas
│   ├── leads/            # Gestão de leads
│   ├── analytics/        # Dashboard e métricas
│   ├── reports/          # Relatórios
│   ├── notifications/    # Notificações
│   ├── settings/         # Configurações
│   └── portal/           # Portal do cliente
├── config/
│   └── modules.ts        # Configuração dos módulos
└── utils/
    └── moduleLoader.ts   # Carregamento dinâmico
```

## 🔧 Como Trabalhar com Módulos

### 1. Configurar Estrutura Inicial
```bash
npm run setup:modules
```

### 2. Desenvolver um Módulo Específico
```typescript
// Trabalhar apenas no módulo de clientes
import { useClients } from '../modules/clients';

function ClientsPage() {
  const { clients, createClient } = useClients();
  // ...
}
```

### 3. Carregamento Lazy
```typescript
// Módulos são carregados apenas quando necessário
const ClientsModule = React.lazy(() => import('../modules/clients'));
```

## 📋 Módulos Disponíveis

### 🏠 Core
- **Propósito**: Sistema base, componentes compartilhados
- **Inclui**: App, Header, Sidebar, Dashboard, hooks básicos
- **Dependências**: Nenhuma

### 📅 Appointments  
- **Propósito**: Gestão de agendamentos e calendário
- **Inclui**: Calendar, AppointmentModal, hooks de agendamento
- **Dependências**: core, clients, services

### 👥 Clients
- **Propósito**: Gestão de clientes
- **Inclui**: Clients, ClientModal, hooks de cliente
- **Dependências**: core

### ⚙️ Services
- **Propósito**: Catálogo de serviços
- **Inclui**: Services, ServiceModal, hooks de serviço  
- **Dependências**: core

### 👨‍💼 Team
- **Propósito**: Gestão de equipe e tarefas (ClickUp-like)
- **Inclui**: TaskManagement, TaskModal, ProjectModal
- **Dependências**: core

### 🎯 Leads
- **Propósito**: Gestão de leads e prospects
- **Inclui**: Leads, LeadModal, conversão
- **Dependências**: core, services

### 📊 Analytics
- **Propósito**: Dashboard e métricas
- **Inclui**: Analytics, gráficos, KPIs
- **Dependências**: core, appointments, clients

### 📄 Reports
- **Propósito**: Geração de relatórios
- **Inclui**: Reports, exportação, templates
- **Dependências**: core, appointments, clients, analytics

### 🔔 Notifications
- **Propósito**: Sistema de notificações
- **Inclui**: Notifications, mensagens automáticas
- **Dependências**: core

### ⚙️ Settings
- **Propósito**: Configurações do sistema
- **Inclui**: Settings, AppearanceSettings, DataManagement
- **Dependências**: core

### 🌐 Portal
- **Propósito**: Interface pública para clientes
- **Inclui**: Login, cadastro, agendamento público
- **Dependências**: core, leads, services

## 🚀 Vantagens da Organização Modular

### ✅ Performance
- **Lazy Loading**: Módulos carregados apenas quando necessário
- **Code Splitting**: Bundle menor no carregamento inicial
- **Cache**: Módulos são cacheados após primeiro carregamento

### ✅ Desenvolvimento
- **Foco**: Trabalhe apenas no módulo que importa
- **Isolamento**: Mudanças em um módulo não afetam outros
- **Reutilização**: Módulos podem ser reutilizados em outros projetos

### ✅ Manutenção
- **Organização**: Código bem estruturado e fácil de encontrar
- **Testes**: Teste módulos de forma independente
- **Deploy**: Deploy módulos específicos se necessário

## 🛠️ Comandos Úteis

```bash
# Configurar estrutura de módulos
npm run setup:modules

# Analisar tamanho dos bundles
npm run analyze

# Build focado em módulos
npm run build:modules

# Desenvolvimento normal
npm run dev
```

## 📝 Convenções

### Estrutura de Módulo
```
módulo/
├── components/     # Componentes React
├── hooks/         # Custom hooks
├── types/         # TypeScript types  
├── services/      # Lógica de negócio
├── utils/         # Utilitários
├── constants/     # Constantes
└── index.ts       # Exports do módulo
```

### Imports/Exports
```typescript
// ✅ Bom
import { useClients } from '../modules/clients';

// ❌ Ruim
import { useClients } from '../modules/clients/hooks/useClients';
```

### Nomeação
- **Componentes**: PascalCase (ClientModal)
- **Hooks**: camelCase com "use" (useClients) 
- **Types**: PascalCase (Client, ClientFormData)
- **Services**: camelCase (clientService)

## 🔄 Migração Gradual

1. **Comece com um módulo** (ex: clients)
2. **Mova componentes relacionados** para o módulo
3. **Teste funcionamento** independente
4. **Repita para outros módulos**
5. **Otimize carregamento** com lazy loading

## 🎯 Próximos Passos

1. Execute `npm run setup:modules`
2. Escolha um módulo para começar (recomendo `clients`)
3. Mova os componentes existentes para a nova estrutura
4. Configure lazy loading
5. Teste e repita para outros módulos

Esta organização vai tornar o projeto muito mais gerenciável e performático! 🚀