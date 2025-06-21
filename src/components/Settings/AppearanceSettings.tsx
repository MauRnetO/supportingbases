import React, { useState, useEffect } from 'react';
import { Palette, Monitor, Sun, Moon, Type, Layout, Eye, Sliders, Check, RotateCcw, Download, Upload, Zap, Sparkles, Settings, Image, Grid, Sidebar, Square, Circle, Hexagon, Triangle, X, Save, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'inter' | 'roboto' | 'poppins' | 'system';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
  compactMode: boolean;
  sidebarStyle: 'default' | 'minimal' | 'floating';
  headerStyle: 'default' | 'compact' | 'prominent';
  cardStyle: 'default' | 'elevated' | 'outlined' | 'minimal';
  colorScheme: 'default' | 'vibrant' | 'pastel' | 'monochrome';
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves' | 'geometric';
  density: 'comfortable' | 'compact' | 'spacious';
  iconStyle: 'outline' | 'filled' | 'duotone';
  buttonStyle: 'rounded' | 'square' | 'pill';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  accentColorIntensity: 'subtle' | 'medium' | 'vibrant';
}

const defaultSettings: AppearanceSettings = {
  theme: 'light',
  primaryColor: '#2563eb',
  accentColor: '#10b981',
  fontSize: 'medium',
  fontFamily: 'inter',
  borderRadius: 'medium',
  animations: true,
  compactMode: false,
  sidebarStyle: 'default',
  headerStyle: 'default',
  cardStyle: 'default',
  colorScheme: 'default',
  backgroundPattern: 'none',
  density: 'comfortable',
  iconStyle: 'outline',
  buttonStyle: 'rounded',
  shadowIntensity: 'medium',
  accentColorIntensity: 'medium'
};

export default function AppearanceSettings() {
  const [settings, setSettings] = useLocalStorage<AppearanceSettings>('appearanceSettings', defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateSetting = (key: keyof AppearanceSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    setJustSaved(false);

    // Apply settings immediately
    applySettingsToDocument(newSettings);

    // Auto-save after 500ms of inactivity
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      setHasChanges(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }, 500);
    
    setAutoSaveTimeout(timeout);
  };

  const applySettingsToDocument = (settings: AppearanceSettings) => {
    try {
      const root = document.documentElement;
      const body = document.body;
      
      // Apply colors
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--accent-color', settings.accentColor);

      // Apply accent color intensity
      const accentIntensity = {
        subtle: 0.6,
        medium: 0.8,
        vibrant: 1.0
      };
      const intensity = accentIntensity[settings.accentColorIntensity];
      root.style.setProperty('--accent-color-opacity', (intensity ?? 1.0).toString());

      // Apply font size
      const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
      };
      root.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);
      body.style.fontSize = fontSizes[settings.fontSize];

      // Apply font family
      const fontFamilies = {
        inter: '"Inter", sans-serif',
        roboto: '"Roboto", sans-serif',
        poppins: '"Poppins", sans-serif',
        system: 'system-ui, -apple-system, sans-serif'
      };
      root.style.setProperty('--font-family', fontFamilies[settings.fontFamily]);
      body.style.fontFamily = fontFamilies[settings.fontFamily];

      // Apply border radius
      const borderRadii = {
        none: '0px',
        small: '4px',
        medium: '8px',
        large: '16px'
      };
      root.style.setProperty('--border-radius', borderRadii[settings.borderRadius]);

      // Apply animations
      root.style.setProperty('--animation-duration', settings.animations ? '0.2s' : '0s');

      // Apply compact mode
      if (settings.compactMode) {
        body.classList.add('compact-mode');
      } else {
        body.classList.remove('compact-mode');
      }

      // Apply density
      const densityScales = {
        compact: '0.8',
        comfortable: '1',
        spacious: '1.2'
      };
      root.style.setProperty('--spacing-scale', densityScales[settings.density]);
      
      // Apply density classes
      body.classList.remove('density-compact', 'density-spacious');
      if (settings.density === 'compact') {
        body.classList.add('density-compact');
      } else if (settings.density === 'spacious') {
        body.classList.add('density-spacious');
      }

      // Apply shadow intensity
      const shadowIntensities = {
        none: '0 0 0 0 rgba(0, 0, 0, 0)',
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      };
      root.style.setProperty('--shadow-intensity', shadowIntensities[settings.shadowIntensity]);
      
      // Apply shadow class only when not default
      if (settings.shadowIntensity !== 'medium') {
        body.classList.add('appearance-shadow');
      } else {
        body.classList.remove('appearance-shadow');
      }

      // Apply button style
      const buttonStyles = {
        rounded: '8px',
        square: '4px',
        pill: '9999px'
      };
      root.style.setProperty('--button-radius', buttonStyles[settings.buttonStyle]);
      
      // Apply button style classes
      body.classList.remove('button-rounded', 'button-square', 'button-pill');
      body.classList.add(`button-${settings.buttonStyle}`);

      // Apply styles classes
      const styleClasses = [
        'sidebar-minimal', 'sidebar-floating',
        'header-compact', 'header-prominent',
        'cards-elevated', 'cards-outlined', 'cards-minimal',
        'scheme-vibrant', 'scheme-pastel', 'scheme-monochrome',
        'icons-filled', 'icons-duotone',
        'appearance-shadow'
      ];
      
      body.classList.remove(...styleClasses);

      // Apply sidebar style (only when not default)
      if (settings.sidebarStyle === 'minimal') {
        body.classList.add('sidebar-minimal');
      } else if (settings.sidebarStyle === 'floating') {
        body.classList.add('sidebar-floating');
      }

      // Apply header style (only when not default)
      if (settings.headerStyle === 'compact') {
        body.classList.add('header-compact');
      } else if (settings.headerStyle === 'prominent') {
        body.classList.add('header-prominent');
      }

      // Apply card style (only when not default)
      if (settings.cardStyle === 'elevated') {
        body.classList.add('cards-elevated');
      } else if (settings.cardStyle === 'outlined') {
        body.classList.add('cards-outlined');
      } else if (settings.cardStyle === 'minimal') {
        body.classList.add('cards-minimal');
      }

      // Apply color scheme (only when not default)
      if (settings.colorScheme === 'vibrant') {
        body.classList.add('scheme-vibrant');
      } else if (settings.colorScheme === 'pastel') {
        body.classList.add('scheme-pastel');
      } else if (settings.colorScheme === 'monochrome') {
        body.classList.add('scheme-monochrome');
      }

      // Apply icon style (only when not default)
      if (settings.iconStyle === 'filled') {
        body.classList.add('icons-filled');
      } else if (settings.iconStyle === 'duotone') {
        body.classList.add('icons-duotone');
      }
      
      // Apply shadow class for shadow intensity
      if (settings.shadowIntensity !== 'none') {
        body.classList.add('appearance-shadow');
      }

      // Apply background pattern
      const patternClasses = ['bg-pattern-dots', 'bg-pattern-grid', 'bg-pattern-waves', 'bg-pattern-geometric'];
      body.classList.remove(...patternClasses);
      
      if (settings.backgroundPattern !== 'none') {
        body.classList.add(`bg-pattern-${settings.backgroundPattern}`);
      }

      // Apply theme
      const html = document.documentElement;
      html.classList.remove('dark');
      body.classList.remove('dark');
      
      if (settings.theme === 'dark') {
        html.classList.add('dark');
        body.classList.add('dark');
      } else if (settings.theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
          body.classList.add('dark');
        }
      }

      // Force re-render by triggering a small style change
      body.style.transition = 'all 0.1s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 100);
    } catch (error) {
      console.error('Error applying appearance settings:', error);
    }
  };

  const saveNow = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    setHasChanges(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar todas as configurações de aparência para os valores padrão?')) {
      setSettings(defaultSettings);
      applySettingsToDocument(defaultSettings);
      setHasChanges(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aparencia-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          const mergedSettings = { ...defaultSettings, ...importedSettings };
          setSettings(mergedSettings);
          applySettingsToDocument(mergedSettings);
        } catch (error) {
          alert('Erro ao importar configurações. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Apply settings on mount
  useEffect(() => {
    applySettingsToDocument(settings);
  }, []);

  const colorPresets = [
    { name: 'Azul Padrão', primary: '#2563eb', accent: '#10b981' },
    { name: 'Roxo Elegante', primary: '#7c3aed', accent: '#f59e0b' },
    { name: 'Verde Natureza', primary: '#059669', accent: '#dc2626' },
    { name: 'Rosa Moderno', primary: '#e11d48', accent: '#8b5cf6' },
    { name: 'Laranja Vibrante', primary: '#ea580c', accent: '#06b6d4' },
    { name: 'Índigo Profundo', primary: '#4f46e5', accent: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Configurações de Aparência</h3>
          <p className="text-sm text-gray-500">Personalize a aparência do sistema</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center text-orange-600 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
              Mudanças pendentes
            </div>
          )}
          
          {justSaved && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvo!
            </div>
          )}
          
          <button 
            onClick={resetToDefaults}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar
          </button>
          
          {hasChanges && (
            <button 
              onClick={saveNow}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Agora
            </button>
          )}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Palette className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tema</h4>
            <p className="text-sm text-gray-500">Escolha entre claro, escuro ou automático</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'light', name: 'Claro', icon: Sun, description: 'Interface clara' },
            { id: 'dark', name: 'Escuro', icon: Moon, description: 'Interface escura' },
            { id: 'system', name: 'Sistema', icon: Monitor, description: 'Segue o sistema' }
          ].map((theme) => {
            const Icon = theme.icon;
            return (
              <div
                key={theme.id}
                onClick={() => updateSetting('theme', theme.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  settings.theme === theme.id 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <Icon className={`w-8 h-8 ${settings.theme === theme.id ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <h5 className={`font-medium text-center ${settings.theme === theme.id ? 'text-blue-900' : 'text-gray-900'}`}>
                  {theme.name}
                </h5>
                <p className="text-sm text-gray-500 text-center mt-1">{theme.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Cores</h4>
            <p className="text-sm text-gray-500">Personalize as cores principais</p>
          </div>
        </div>

        {/* Color Presets */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-3">Presets de Cores</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  updateSetting('primaryColor', preset.primary);
                  updateSetting('accentColor', preset.accent);
                }}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                title={preset.name}
              >
                <div className="flex space-x-1 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: preset.primary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: preset.accent }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Cor Primária</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="#2563eb"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Cor de Destaque</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSetting('accentColor', e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => updateSetting('accentColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accent Color Intensity */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Intensidade da Cor de Destaque</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'subtle', name: 'Sutil', description: 'Menos intenso' },
              { id: 'medium', name: 'Médio', description: 'Intensidade padrão' },
              { id: 'vibrant', name: 'Vibrante', description: 'Mais intenso' }
            ].map((intensity) => (
              <div
                key={intensity.id}
                onClick={() => updateSetting('accentColorIntensity', intensity.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                  settings.accentColorIntensity === intensity.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h6 className="font-medium text-gray-900">{intensity.name}</h6>
                <p className="text-xs text-gray-500 mt-1">{intensity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Esquema de Cores</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'default', name: 'Padrão', description: 'Cores balanceadas' },
              { id: 'vibrant', name: 'Vibrante', description: 'Cores mais vivas' },
              { id: 'pastel', name: 'Pastel', description: 'Cores suaves' },
              { id: 'monochrome', name: 'Monocromático', description: 'Tons de cinza' }
            ].map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => updateSetting('colorScheme', scheme.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                  settings.colorScheme === scheme.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h6 className="font-medium text-gray-900">{scheme.name}</h6>
                <p className="text-xs text-gray-500 mt-1">{scheme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Type className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tipografia</h4>
            <p className="text-sm text-gray-500">Configure fontes e tamanhos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Família da Fonte</label>
            <div className="space-y-2">
              {[
                { id: 'inter', name: 'Inter', preview: 'Inter - Moderna e legível' },
                { id: 'roboto', name: 'Roboto', preview: 'Roboto - Clássica do Google' },
                { id: 'poppins', name: 'Poppins', preview: 'Poppins - Geométrica e friendly' },
                { id: 'system', name: 'Sistema', preview: 'Fonte padrão do sistema' }
              ].map((font) => (
                <div
                  key={font.id}
                  onClick={() => updateSetting('fontFamily', font.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.fontFamily === font.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{font.name}</span>
                    {settings.fontFamily === font.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: font.id !== 'system' ? font.name : 'system-ui' }}>
                    {font.preview}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tamanho da Fonte</label>
            <div className="space-y-2">
              {[
                { id: 'small', name: 'Pequeno', size: '14px', description: 'Texto compacto' },
                { id: 'medium', name: 'Médio', size: '16px', description: 'Tamanho padrão' },
                { id: 'large', name: 'Grande', size: '18px', description: 'Texto maior' }
              ].map((size) => (
                <div
                  key={size.id}
                  onClick={() => updateSetting('fontSize', size.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.fontSize === size.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{size.name}</span>
                    {settings.fontSize === size.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">{size.description}</p>
                    <span className="text-xs text-gray-400">{size.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layout & Components */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Layout className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Layout & Componentes</h4>
            <p className="text-sm text-gray-500">Configure espaçamento e elementos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Density */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Densidade</label>
            <div className="space-y-2">
              {[
                { id: 'compact', name: 'Compacto', description: 'Mais conteúdo' },
                { id: 'comfortable', name: 'Confortável', description: 'Balanceado' },
                { id: 'spacious', name: 'Espaçoso', description: 'Mais respiração' }
              ].map((density) => (
                <div
                  key={density.id}
                  onClick={() => updateSetting('density', density.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.density === density.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{density.name}</span>
                    {settings.density === density.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{density.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Bordas Arredondadas</label>
            <div className="space-y-2">
              {[
                { id: 'none', name: 'Nenhuma', preview: '□' },
                { id: 'small', name: 'Pequena', preview: '⬜' },
                { id: 'medium', name: 'Média', preview: '🔲' },
                { id: 'large', name: 'Grande', preview: '⬛' }
              ].map((radius) => (
                <div
                  key={radius.id}
                  onClick={() => updateSetting('borderRadius', radius.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.borderRadius === radius.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{radius.name}</span>
                    <span className="text-lg">{radius.preview}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadow Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Intensidade da Sombra</label>
            <div className="space-y-2">
              {[
                { id: 'none', name: 'Nenhuma', description: 'Sem sombras' },
                { id: 'subtle', name: 'Sutil', description: 'Sombra leve' },
                { id: 'medium', name: 'Média', description: 'Sombra padrão' },
                { id: 'strong', name: 'Forte', description: 'Sombra intensa' }
              ].map((shadow) => (
                <div
                  key={shadow.id}
                  onClick={() => updateSetting('shadowIntensity', shadow.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.shadowIntensity === shadow.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{shadow.name}</span>
                    {settings.shadowIntensity === shadow.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{shadow.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interface Styles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Estilos da Interface</h4>
            <p className="text-sm text-gray-500">Personalize componentes específicos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sidebar Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Estilo da Barra Lateral</label>
            <div className="space-y-2">
              {[
                { id: 'default', name: 'Padrão', description: 'Sidebar fixa normal' },
                { id: 'minimal', name: 'Minimalista', description: 'Apenas ícones' },
                { id: 'floating', name: 'Flutuante', description: 'Sidebar destacada' }
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => updateSetting('sidebarStyle', style.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.sidebarStyle === style.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{style.name}</span>
                    {settings.sidebarStyle === style.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Header Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Estilo do Cabeçalho</label>
            <div className="space-y-2">
              {[
                { id: 'default', name: 'Padrão', description: 'Altura normal' },
                { id: 'compact', name: 'Compacto', description: 'Menor altura' },
                { id: 'prominent', name: 'Proeminente', description: 'Maior destaque' }
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => updateSetting('headerStyle', style.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.headerStyle === style.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{style.name}</span>
                    {settings.headerStyle === style.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Estilo dos Cards</label>
            <div className="space-y-2">
              {[
                { id: 'default', name: 'Padrão', description: 'Sombra sutil' },
                { id: 'elevated', name: 'Elevado', description: 'Sombra proeminente' },
                { id: 'outlined', name: 'Contornado', description: 'Apenas bordas' },
                { id: 'minimal', name: 'Minimalista', description: 'Sem bordas' }
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => updateSetting('cardStyle', style.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    settings.cardStyle === style.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{style.name}</span>
                    {settings.cardStyle === style.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Sliders className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Opções Avançadas</h4>
            <p className="text-sm text-gray-500">Configurações especiais e experimentais</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Toggle Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Animações</h5>
                <p className="text-sm text-gray-500">Ativar transições suaves</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.animations}
                  onChange={(e) => updateSetting('animations', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Modo Compacto</h5>
                <p className="text-sm text-gray-500">Interface mais densa</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.compactMode}
                  onChange={(e) => updateSetting('compactMode', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Background Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Padrão de Fundo</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { id: 'none', name: 'Nenhum', icon: Square },
                { id: 'dots', name: 'Pontos', icon: Circle },
                { id: 'grid', name: 'Grade', icon: Grid },
                { id: 'waves', name: 'Ondas', icon: Hexagon },
                { id: 'geometric', name: 'Geométrico', icon: Triangle }
              ].map((pattern) => {
                const Icon = pattern.icon;
                return (
                  <div
                    key={pattern.id}
                    onClick={() => updateSetting('backgroundPattern', pattern.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      settings.backgroundPattern === pattern.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      settings.backgroundPattern === pattern.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">{pattern.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Icon & Button Styles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Estilo dos Ícones</label>
              <div className="space-y-2">
                {[
                  { id: 'outline', name: 'Contorno', description: 'Ícones vazados' },
                  { id: 'filled', name: 'Preenchido', description: 'Ícones sólidos' },
                  { id: 'duotone', name: 'Duotone', description: 'Dois tons' }
                ].map((style) => (
                  <div
                    key={style.id}
                    onClick={() => updateSetting('iconStyle', style.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      settings.iconStyle === style.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{style.name}</span>
                      {settings.iconStyle === style.id && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Estilo dos Botões</label>
              <div className="space-y-2">
                {[
                  { id: 'rounded', name: 'Arredondado', description: 'Bordas suaves' },
                  { id: 'square', name: 'Quadrado', description: 'Bordas retas' },
                  { id: 'pill', name: 'Pílula', description: 'Totalmente arredondado' }
                ].map((style) => (
                  <div
                    key={style.id}
                    onClick={() => updateSetting('buttonStyle', style.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      settings.buttonStyle === style.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{style.name}</span>
                      {settings.buttonStyle === style.id && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Backup & Restauração</h4>
            <p className="text-sm text-gray-500">Salve ou carregue suas configurações</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={exportSettings}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Configurações
          </button>
          
          <label className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Importar Configurações
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Dica:</strong> Use essas opções para fazer backup das suas configurações ou compartilhar com outros usuários.
          </p>
        </div>
      </div>
    </div>
  );
}