// Utilitário para carregamento dinâmico de módulos
import { MODULE_CONFIG } from '../config/modules';

export class ModuleLoader {
  private static loadedModules = new Map<string, any>();
  private static loadingPromises = new Map<string, Promise<any>>();

  static async loadModule(moduleName: string): Promise<any> {
    // Verificar se já está carregado
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    // Verificar se já está sendo carregado
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    // Carregar dependências primeiro
    const dependencies = MODULE_CONFIG[moduleName as keyof typeof MODULE_CONFIG]?.dependencies || [];
    await Promise.all(dependencies.map(dep => this.loadModule(dep)));

    // Carregar o módulo
    const loadingPromise = this.importModule(moduleName);
    this.loadingPromises.set(moduleName, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.set(moduleName, module);
      this.loadingPromises.delete(moduleName);
      
      console.log(`✅ Módulo ${moduleName} carregado`);
      return module;
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      console.error(`❌ Erro ao carregar módulo ${moduleName}:`, error);
      throw error;
    }
  }

  private static async importModule(moduleName: string): Promise<any> {
    switch (moduleName) {
      case 'appointments':
        return import('../modules/appointments');
      case 'clients':
        return import('../modules/clients');
      case 'services':
        return import('../modules/services');
      case 'team':
        return import('../modules/team');
      case 'leads':
        return import('../modules/leads');
      case 'analytics':
        return import('../modules/analytics');
      case 'reports':
        return import('../modules/reports');
      case 'notifications':
        return import('../modules/notifications');
      case 'settings':
        return import('../modules/settings');
      case 'portal':
        return import('../modules/portal');
      default:
        throw new Error(`Módulo desconhecido: ${moduleName}`);
    }
  }

  static preloadModule(moduleName: string): void {
    // Carregamento assíncrono sem aguardar
    this.loadModule(moduleName).catch(error => {
      console.warn(`Preload do módulo ${moduleName} falhou:`, error);
    });
  }

  static preloadCriticalModules(): void {
    // Módulos críticos que devem ser pré-carregados
    const criticalModules = ['appointments', 'clients'];
    criticalModules.forEach(module => this.preloadModule(module));
  }

  static unloadModule(moduleName: string): void {
    this.loadedModules.delete(moduleName);
    this.loadingPromises.delete(moduleName);
    console.log(`🗑️ Módulo ${moduleName} descarregado`);
  }

  static getLoadedModules(): string[] {
    return Array.from(this.loadedModules.keys());
  }

  static clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
    console.log('🧹 Cache de módulos limpo');
  }
}

// Hook para usar o module loader
export function useModuleLoader() {
  return {
    loadModule: ModuleLoader.loadModule.bind(ModuleLoader),
    preloadModule: ModuleLoader.preloadModule.bind(ModuleLoader),
    unloadModule: ModuleLoader.unloadModule.bind(ModuleLoader),
    getLoadedModules: ModuleLoader.getLoadedModules.bind(ModuleLoader),
    clearCache: ModuleLoader.clearCache.bind(ModuleLoader),
  };
}