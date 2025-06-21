// Configuração dos módulos do sistema
export const MODULE_CONFIG = {
  core: {
    name: 'Sistema Principal',
    description: 'Componentes base do sistema',
    version: '1.0.0',
    dependencies: [],
  },
  appointments: {
    name: 'Agendamentos',
    description: 'Gestão de agendamentos e calendário',
    version: '1.0.0',
    dependencies: ['core', 'clients', 'services'],
  },
  clients: {
    name: 'Clientes',
    description: 'Gestão de clientes',
    version: '1.0.0',
    dependencies: ['core'],
  },
  services: {
    name: 'Serviços',
    description: 'Catálogo de serviços',
    version: '1.0.0',
    dependencies: ['core'],
  },
  team: {
    name: 'Equipe e Tarefas',
    description: 'Gestão de equipe e projetos',
    version: '1.0.0',
    dependencies: ['core'],
  },
  leads: {
    name: 'Leads',
    description: 'Gestão de leads e prospects',
    version: '1.0.0',
    dependencies: ['core', 'services'],
  },
  analytics: {
    name: 'Análises',
    description: 'Dashboard e métricas',
    version: '1.0.0',
    dependencies: ['core', 'appointments', 'clients'],
  },
  reports: {
    name: 'Relatórios',
    description: 'Geração de relatórios',
    version: '1.0.0',
    dependencies: ['core', 'appointments', 'clients', 'analytics'],
  },
  notifications: {
    name: 'Notificações',
    description: 'Sistema de notificações',
    version: '1.0.0',
    dependencies: ['core'],
  },
  settings: {
    name: 'Configurações',
    description: 'Configurações do sistema',
    version: '1.0.0',
    dependencies: ['core'],
  },
  portal: {
    name: 'Portal do Cliente',
    description: 'Interface pública para clientes',
    version: '1.0.0',
    dependencies: ['core', 'leads', 'services'],
  },
};

export const getModuleDependencies = (moduleName: string): string[] => {
  return MODULE_CONFIG[moduleName as keyof typeof MODULE_CONFIG]?.dependencies || [];
};

export const isModuleEnabled = (moduleName: string): boolean => {
  const enabledModules = JSON.parse(localStorage.getItem('enabledModules') || '[]');
  return enabledModules.includes(moduleName);
};

export const enableModule = (moduleName: string): void => {
  const enabledModules = JSON.parse(localStorage.getItem('enabledModules') || '[]');
  if (!enabledModules.includes(moduleName)) {
    enabledModules.push(moduleName);
    localStorage.setItem('enabledModules', JSON.stringify(enabledModules));
  }
};

export const disableModule = (moduleName: string): void => {
  const enabledModules = JSON.parse(localStorage.getItem('enabledModules') || '[]');
  const filtered = enabledModules.filter((m: string) => m !== moduleName);
  localStorage.setItem('enabledModules', JSON.stringify(filtered));
};