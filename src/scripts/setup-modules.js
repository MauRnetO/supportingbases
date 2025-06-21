#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script para configurar a estrutura de módulos
const MODULES = [
  'core',
  'appointments', 
  'clients',
  'services',
  'team',
  'leads',
  'analytics',
  'reports',
  'notifications',
  'settings',
  'portal'
];

const MODULE_STRUCTURE = [
  'components',
  'hooks', 
  'types',
  'services',
  'utils',
  'constants'
];

function createModuleStructure() {
  const modulesDir = path.join(__dirname, '../modules');
  
  // Criar diretório modules se não existir
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  MODULES.forEach(moduleName => {
    const moduleDir = path.join(modulesDir, moduleName);
    
    // Criar diretório do módulo
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Criar estrutura interna do módulo
    MODULE_STRUCTURE.forEach(structureName => {
      const structureDir = path.join(moduleDir, structureName);
      if (!fs.existsSync(structureDir)) {
        fs.mkdirSync(structureDir, { recursive: true });
      }
    });

    // Criar arquivo index.ts do módulo se não existir
    const indexFile = path.join(moduleDir, 'index.ts');
    if (!fs.existsSync(indexFile)) {
      const indexContent = `// ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} module
export * from './components';
export * from './hooks';
export * from './types';
export * from './services';
export * from './utils';
export * from './constants';
`;
      fs.writeFileSync(indexFile, indexContent);
    }

    console.log(`✅ Módulo ${moduleName} configurado`);
  });

  console.log('\n🎉 Estrutura de módulos criada com sucesso!');
  console.log('\n📁 Estrutura criada:');
  console.log('src/');
  console.log('├── modules/');
  MODULES.forEach(module => {
    console.log(`│   ├── ${module}/`);
    MODULE_STRUCTURE.forEach(structure => {
      console.log(`│   │   ├── ${structure}/`);
    });
    console.log(`│   │   └── index.ts`);
  });
}

// Executar se chamado diretamente
if (require.main === module) {
  createModuleStructure();
}

module.exports = { createModuleStructure };